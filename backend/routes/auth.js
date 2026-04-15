const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');
const { validateRegister, validateLogin, checkValidation } = require('../utils/validators');
const { register, login, getCurrentUser, updateProfile } = require('../controllers/authController');

// Public routes
router.post('/register', upload.single('profileImage'), validateRegister, checkValidation, register);
router.post('/login', validateLogin, checkValidation, login);

// Protected routes
router.get('/me', auth, getCurrentUser);
router.put('/profile', auth, upload.single('profileImage'), updateProfile);

module.exports = router;
