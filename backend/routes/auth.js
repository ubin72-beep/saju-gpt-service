const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  getMe,
  updatePassword,
  protect
} = require('../controllers/authController');

// 공개 라우트 (인증 불필요)
router.post('/signup', signup);
router.post('/login', login);

// 보호된 라우트 (인증 필요)
router.get('/me', protect, getMe);
router.patch('/update-password', protect, updatePassword);

module.exports = router;
