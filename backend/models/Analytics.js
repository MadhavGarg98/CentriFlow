const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  semester: {
    type: String,
    required: true,
    trim: true
  },
  attendancePercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalClasses: {
    type: Number,
    default: 0
  },
  presentClasses: {
    type: Number,
    default: 0
  },
  averageGrades: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  performanceTrend: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  aiPredictions: {
    dropoutRisk: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    performancePrediction: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    recommendations: [{
      type: String,
      trim: true
    }]
  },
  subjects: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    attendance: {
      type: Number,
      default: 0
    },
    grade: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
analyticsSchema.index({ student: 1, semester: 1 }, { unique: true });
analyticsSchema.index({ riskLevel: 1 });
analyticsSchema.index({ lastUpdated: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
