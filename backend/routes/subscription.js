const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const {
  getPlans,
  getMySubscription,
  createSubscription,
  cancelSubscription,
  renewSubscription,
  getSubscriptionHistory
} = require('../controllers/subscriptionController');

// 공개 라우트
router.get('/plans', getPlans);

// 보호된 라우트 (인증 필요)
router.get('/my', protect, getMySubscription);
router.post('/', protect, createSubscription);
router.post('/cancel', protect, cancelSubscription);
router.post('/renew', protect, renewSubscription);
router.get('/history', protect, getSubscriptionHistory);

module.exports = router;
