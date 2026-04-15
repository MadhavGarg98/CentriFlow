const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getStudents,
  updateFaceData
} = require('../controllers/userController');

// Admin only routes
router.get('/', auth, authorize('admin'), getAllUsers);
router.get('/:id', auth, authorize('admin'), getUserById);
router.put('/:id', auth, authorize('admin'), updateUser);
router.delete('/:id', auth, authorize('admin'), deleteUser);

// Faculty and Admin routes
router.get('/students/list', auth, authorize('faculty', 'admin'), getStudents);

// Student routes
router.put('/face-data', auth, updateFaceData);

module.exports = router;
