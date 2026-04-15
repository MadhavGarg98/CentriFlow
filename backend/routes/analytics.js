const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getStudentAnalytics, 
  generatePrediction, 
  getDashboardAnalytics,
  getPerformanceTrends
} = require('../controllers/analyticsController');

// All authenticated users can get their own analytics
router.get('/student', auth, getStudentAnalytics);
router.get('/trends', auth, getPerformanceTrends);

// Generate prediction (students can generate for themselves, others can specify student)
router.post('/predict', auth, generatePrediction);

// Admin and Faculty can get analytics for specific students
router.get('/student/:studentId', auth, authorize('admin', 'faculty'), getStudentAnalytics);

// Admin only dashboard analytics
router.get('/dashboard', auth, authorize('admin'), getDashboardAnalytics);

module.exports = router;
