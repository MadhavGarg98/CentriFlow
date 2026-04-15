const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Analytics = require('../models/Analytics');
const axios = require('axios');

// Mark attendance (Faculty only)
const markAttendance = async (req, res) => {
  try {
    const { student, subject, semester, status = 'present', notes } = req.body;
    const faculty = req.user._id;

    // Verify student exists
    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      student,
      subject,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student in this subject today'
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      student,
      faculty,
      subject,
      semester,
      status,
      notes,
      date: new Date(),
      verificationMethod: 'manual'
    });

    await attendance.save();

    // Update analytics
    await updateStudentAnalytics(student, semester);

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        attendance
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error marking attendance',
      error: error.message
    });
  }
};

// Mark attendance with face recognition
const markAttendanceWithFace = async (req, res) => {
  try {
    const { subject, semester } = req.body;
    const faculty = req.user._id;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required'
      });
    }

    // Convert image to base64
    const base64Image = imageFile.buffer.toString('base64');

    // Call AI service for face recognition
    let recognizedStudent;
    try {
      const response = await axios.post(`${process.env.AI_SERVICE_URL}/face-recognition`, {
        image: base64Image
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success && response.data.student) {
        recognizedStudent = response.data.student;
      } else {
        return res.status(404).json({
          success: false,
          message: 'No face recognized in the image'
        });
      }
    } catch (aiError) {
      return res.status(500).json({
        success: false,
        message: 'Face recognition service unavailable',
        error: aiError.message
      });
    }

    // Check if attendance already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingAttendance = await Attendance.findOne({
      student: recognizedStudent._id,
      subject,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student in this subject today'
      });
    }

    // Create attendance record
    const attendance = new Attendance({
      student: recognizedStudent._id,
      faculty,
      subject,
      semester,
      status: 'present',
      date: new Date(),
      verificationMethod: 'face-recognition',
      confidence: recognizedStudent.confidence || 0
    });

    await attendance.save();

    // Update analytics
    await updateStudentAnalytics(recognizedStudent._id, semester);

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully with face recognition',
      data: {
        attendance,
        student: recognizedStudent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error marking attendance',
      error: error.message
    });
  }
};

// Get attendance records
const getAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, student, subject, date, status } = req.query;
    const skip = (page - 1) * limit;

    // Build query based on user role
    let query = {};
    
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'faculty') {
      query.faculty = req.user._id;
    }

    // Apply filters
    if (student && (req.user.role === 'admin' || req.user.role === 'faculty')) {
      query.student = student;
    }
    if (subject) query.subject = subject;
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const attendance = await Attendance.find(query)
      .populate('student', 'name email profileImage')
      .populate('faculty', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        attendance,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance',
      error: error.message
    });
  }
};

// Get attendance statistics
const getAttendanceStats = async (req, res) => {
  try {
    const { studentId, semester, startDate, endDate } = req.query;
    
    let query = {};
    
    // Filter by student
    if (studentId) {
      query.student = studentId;
    } else if (req.user.role === 'student') {
      query.student = req.user._id;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Filter by semester
    if (semester) {
      query.semester = semester;
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalClasses = await Attendance.countDocuments(query);
    const presentClasses = await Attendance.countDocuments({ ...query, status: 'present' });
    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalClasses,
        presentClasses,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendance statistics',
      error: error.message
    });
  }
};

// Helper function to update student analytics
const updateStudentAnalytics = async (studentId, semester) => {
  try {
    const totalClasses = await Attendance.countDocuments({
      student: studentId,
      semester
    });

    const presentClasses = await Attendance.countDocuments({
      student: studentId,
      semester,
      status: 'present'
    });

    const attendancePercentage = totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0;

    // Update or create analytics record
    await Analytics.findOneAndUpdate(
      { student: studentId, semester },
      {
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        totalClasses,
        presentClasses,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating analytics:', error);
  }
};

module.exports = {
  markAttendance,
  markAttendanceWithFace,
  getAttendance,
  getAttendanceStats
};
