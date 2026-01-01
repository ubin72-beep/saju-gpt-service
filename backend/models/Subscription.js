const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'monthly', 'yearly'],
    required: true,
    default: 'free'
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'active'
  },
  pricing: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'KRW'
    }
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  paymentInfo: {
    method: {
      type: String,
      enum: ['card', 'bank_transfer', 'toss', 'kakao_pay', 'naver_pay']
    },
    transactionId: String,
    paidAt: Date,
    lastPaymentDate: Date,
    nextBillingDate: Date
  },
  features: {
    unlimitedAnalysis: { type: Boolean, default: false },
    aiChat: { type: Boolean, default: false },
    premiumReports: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false }
  },
  usageStats: {
    analysisCount: { type: Number, default: 0 },
    aiChatCount: { type: Number, default: 0 },
    reportDownloads: { type: Number, default: 0 }
  },
  cancelledAt: Date,
  cancelReason: String,
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
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

// 구독 만료 체크 메서드
subscriptionSchema.methods.isExpired = function() {
  return this.endDate < new Date();
};

// 구독 기간 계산 메서드
subscriptionSchema.methods.getDaysRemaining = function() {
  const now = new Date();
  const diff = this.endDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
