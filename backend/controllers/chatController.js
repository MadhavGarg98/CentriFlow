const axios = require('axios');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Analytics = require('../models/Analytics');
const groqClient = require('../utils/groqClient');

// Chat with AI assistant
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Get user's relevant data
    const user = await User.findById(userId);
    const recentAttendance = await Attendance.find({ student: userId })
      .sort({ date: -1 })
      .limit(10);
    
    const analytics = await Analytics.findOne({ 
      student: userId 
    }).sort({ lastUpdated: -1 });

    // Prepare context for Groq AI
    const context = {
      userName: user.name,
      role: user.role,
      email: user.email,
      attendancePercentage: analytics?.attendancePercentage || 0,
      totalClasses: analytics?.totalClasses || 0,
      presentClasses: analytics?.presentClasses || 0,
      riskLevel: analytics?.riskLevel || 'low',
      recommendations: analytics?.aiPredictions?.recommendations || []
    };

    // Call Groq API directly
    const aiResponse = await groqClient.generateResponse(message, context);

    res.status(200).json({
      success: true,
      data: {
        response: aiResponse.response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Chat service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing chat request',
      error: error.message
    });
  }
};

// Get chat history (placeholder for future implementation)
const getChatHistory = async (req, res) => {
  try {
    // This would be implemented with a ChatHistory model
    // For now, return empty history
    res.status(200).json({
      success: true,
      data: {
        history: [],
        message: 'Chat history feature coming soon'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching chat history',
      error: error.message
    });
  }
};

module.exports = {
  chatWithAI,
  getChatHistory
};
