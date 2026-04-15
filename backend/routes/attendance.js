const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const { validateAttendance, checkValidation } = require('../utils/validators');
const { 
  markAttendance, 
  markAttendanceWithFace, 
  getAttendance, 
  getAttendanceStats 
} = require('../controllers/attendanceController');

// Faculty and Admin routes
router.post('/', auth, authorize('faculty', 'admin'), validateAttendance, checkValidation, markAttendance);
router.post('/face-recognition', auth, authorize('faculty', 'admin'), upload.single('image'), markAttendanceWithFace);

// All authenticated users can view attendance (filtered by role)
router.get('/', auth, getAttendance);
router.get('/stats', auth, getAttendanceStats);

module.exports = router;
