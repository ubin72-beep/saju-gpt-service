const mongoose = require('mongoose');

const sajuAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  birthInfo: {
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    hour: { type: Number, required: true },
    isLunar: { type: Boolean, default: false },
    gender: { type: String, enum: ['male', 'female'], required: true }
  },
  sajuData: {
    yearPillar: { heaven: String, earth: String },
    monthPillar: { heaven: String, earth: String },
    dayPillar: { heaven: String, earth: String },
    hourPillar: { heaven: String, earth: String },
    dayMaster: String,  // 일간 (日干)
    elements: {
      wood: Number,
      fire: Number,
      earth: Number,
      metal: Number,
      water: Number
    }
  },
  analysis: {
    personality: String,
    career: String,
    wealth: String,
    health: String,
    love: String,
    luck2026: String,
    strengths: [String],
    weaknesses: [String],
    luckyColors: [String],
    luckyNumbers: [Number],
    luckyDirections: [String]
  },
  aiInsights: {
    summary: String,
    detailedAnalysis: String,
    recommendations: [String],
    warnings: [String]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 인덱스 설정
sajuAnalysisSchema.index({ userId: 1, createdAt: -1 });
sajuAnalysisSchema.index({ shareToken: 1 });

const SajuAnalysis = mongoose.model('SajuAnalysis', sajuAnalysisSchema);

module.exports = SajuAnalysis;
