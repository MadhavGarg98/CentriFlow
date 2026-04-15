const { body, validationResult } = require('express-validator');

// Validation rules
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['student', 'faculty', 'admin'])
    .withMessage('Role must be student, faculty, or admin')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

const validateAttendance = [
  body('student')
    .isMongoId()
    .withMessage('Valid student ID is required'),
  
  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required'),
  
  body('semester')
    .trim()
    .notEmpty()
    .withMessage('Semester is required'),
  
  body('status')
    .optional()
    .isIn(['present', 'absent', 'late'])
    .withMessage('Status must be present, absent, or late')
];

// Error checking middleware
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateAttendance,
  checkValidation
};
