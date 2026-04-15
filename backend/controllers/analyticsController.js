const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const groqClient = require('../utils/groqClient');

// Get student analytics
const getStudentAnalytics = async (req, res) => {
  try {
    const { studentId, semester } = req.query;
    
    let student = studentId;
    if (req.user.role === 'student') {
      student = req.user._id;
    }

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Build query
    const query = { student };
    if (semester) query.semester = semester;

    let analytics = await Analytics.findOne(query)
      .populate('student', 'name email profileImage');

    if (!analytics) {
      // Create basic analytics if not exists
      const attendanceData = await Attendance.aggregate([
        { $match: { student: student } },
        {
          $group: {
            _id: '$semester',
            totalClasses: { $sum: 1 },
            presentClasses: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            }
          }
        }
      ]);

      if (attendanceData.length > 0) {
        const latestSemester = attendanceData[attendanceData.length - 1];
        const attendancePercentage = latestSemester.totalClasses > 0 
          ? (latestSemester.presentClasses / latestSemester.totalClasses) * 100 
          : 0;

        analytics = new Analytics({
          student,
          semester: latestSemester._id,
          attendancePercentage: Math.round(attendancePercentage * 100) / 100,
          totalClasses: latestSemester.totalClasses,
          presentClasses: latestSemester.presentClasses
        });

        await analytics.save();
        await analytics.populate('student', 'name email profileImage');
      }
    }

    res.status(200).json({
      success: true,
      data: {
        analytics
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics',
      error: error.message
    });
  }
};

// Generate AI-powered analytics prediction
const generatePrediction = async (req, res) => {
  try {
    const { studentId, semester } = req.body;
    
    let student = studentId;
    if (req.user.role === 'student') {
      student = req.user._id;
    }

    // Get student data
    const studentData = await Analytics.findOne({ student, semester })
      .populate('student', 'name email enrollmentDate');

    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'No analytics data found for this student'
      });
    }

    // Get attendance history
    const attendanceHistory = await Attendance.find({ student, semester })
      .sort({ date: -1 })
      .limit(30);

    // Prepare data for Groq AI
    const aiInput = {
      name: studentData.student.name,
      attendancePercentage: studentData.attendancePercentage,
      totalClasses: studentData.totalClasses,
      presentClasses: studentData.presentClasses,
      averageGrades: studentData.averageGrades || 0,
      recentAttendance: attendanceHistory.map(a => ({
        date: a.date,
        status: a.status
      }))
    };

    // Call Groq API for prediction
    const predictionResult = await groqClient.generatePrediction(aiInput);
    
    if (predictionResult.success) {
      const prediction = predictionResult.prediction;

      // Update analytics with AI predictions
      await Analytics.findOneAndUpdate(
        { student, semester },
        {
          riskLevel: prediction.riskLevel,
          riskScore: prediction.riskScore,
          aiPredictions: {
            dropoutRisk: prediction.dropoutRisk,
            performancePrediction: prediction.performancePrediction,
            recommendations: prediction.recommendations
          },
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );

      res.status(200).json({
        success: true,
        message: 'Prediction generated successfully',
        data: {
          prediction,
          analytics: await Analytics.findOne({ student, semester })
            .populate('student', 'name email profileImage')
        }
      });
    } else {
      throw new Error('Failed to generate prediction');
    }
  } catch (error) {
    console.error('Prediction generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error generating prediction',
      error: error.message
    });
  }
};

// Get dashboard analytics for admin
const getDashboardAnalytics = async (req, res) => {
  try {
    const { semester } = req.query;

    // Get overall statistics
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalFaculty = await User.countDocuments({ role: 'faculty' });
    
    // Get attendance statistics
    const attendanceStats = await Attendance.aggregate([
      ...(semester ? [{ $match: { semester } }] : []),
      {
        $group: {
          _id: null,
          totalClasses: { $sum: 1 },
          presentClasses: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          },
          absentClasses: {
            $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = attendanceStats[0] || { totalClasses: 0, presentClasses: 0, absentClasses: 0 };
    const overallAttendancePercentage = stats.totalClasses > 0 
      ? (stats.presentClasses / stats.totalClasses) * 100 
      : 0;

    // Get risk distribution
    const riskDistribution = await Analytics.aggregate([
      ...(semester ? [{ $match: { semester } }] : []),
      {
        $group: {
          _id: '$riskLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent activity
    const recentActivity = await Attendance.find()
      .populate('student', 'name')
      .populate('faculty', 'name')
      .sort({ date: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents,
          totalFaculty,
          overallAttendancePercentage: Math.round(overallAttendancePercentage * 100) / 100,
          totalClasses: stats.totalClasses,
          presentClasses: stats.presentClasses,
          absentClasses: stats.absentClasses
        },
        riskDistribution,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard analytics',
      error: error.message
    });
  }
};

// Get performance trends
const getPerformanceTrends = async (req, res) => {
  try {
    const { studentId, semester } = req.query;
    
    let student = studentId;
    if (req.user.role === 'student') {
      student = req.user._id;
    }

    if (!student) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }

    // Get attendance trends over time
    const attendanceTrends = await Attendance.aggregate([
      { $match: { student } },
      ...(semester ? [{ $match: { semester } }] : []),
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          total: { $sum: 1 },
          present: {
            $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    // Format trends data
    const trends = attendanceTrends.map(trend => ({
      date: `${trend._id.year}-${trend._id.month.toString().padStart(2, '0')}-${trend._id.day.toString().padStart(2, '0')}`,
      attendancePercentage: trend.total > 0 ? (trend.present / trend.total) * 100 : 0
    }));

    res.status(200).json({
      success: true,
      data: {
        trends
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching performance trends',
      error: error.message
    });
  }
};

module.exports = {
  getStudentAnalytics,
  generatePrediction,
  getDashboardAnalytics,
  getPerformanceTrends
};
