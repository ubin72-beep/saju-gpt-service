const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const User = require('../models/User');

// 프로필 수정
router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, birthDate, gender } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (name) user.name = name;
    if (birthDate) user.birthDate = birthDate;
    if (gender) user.gender = gender;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: '프로필이 수정되었습니다.',
      data: { user }
    });
    
  } catch (error) {
    console.error('프로필 수정 에러:', error);
    res.status(500).json({
      success: false,
      message: '프로필 수정 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// 계정 삭제
router.delete('/me', protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({
      success: true,
      message: '계정이 삭제되었습니다.'
    });
    
  } catch (error) {
    console.error('계정 삭제 에러:', error);
    res.status(500).json({
      success: false,
      message: '계정 삭제 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
