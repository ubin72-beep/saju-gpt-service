const express = require('express');
const router = express.Router();
const { protect } = require('../controllers/authController');
const {
  createAnalysis,
  getMyAnalyses,
  getAnalysisById,
  getAnalysisByShareToken,
  updateAnalysis,
  deleteAnalysis,
  getPublicAnalyses
} = require('../controllers/sajuController');

// 공개 라우트
router.get('/public', getPublicAnalyses);
router.get('/share/:shareToken', getAnalysisByShareToken);

// 보호된 라우트 (인증 필요)
router.post('/', protect, createAnalysis);
router.get('/my', protect, getMyAnalyses);
router.get('/:id', protect, getAnalysisById);
router.patch('/:id', protect, updateAnalysis);
router.delete('/:id', protect, deleteAnalysis);

module.exports = router;
