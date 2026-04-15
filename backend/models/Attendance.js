const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present'
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  semester: {
    type: String,
    required: true,
    trim: true
  },
  verificationMethod: {
    type: String,
    enum: ['manual', 'face-recognition'],
    default: 'manual'
  },
  confidence: {
    type: Number, // Face recognition confidence score
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ faculty: 1, date: 1 });
attendanceSchema.index({ date: 1, status: 1 });

// Ensure one attendance record per student per day per subject
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
