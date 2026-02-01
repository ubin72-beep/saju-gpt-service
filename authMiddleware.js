const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * 인증 미들웨어 - JWT 토큰 검증
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 헤더에서 토큰 추출
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 토큰이 없으면 에러
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 조회
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: '유효하지 않은 사용자입니다.'
        });
      }

      // req.user에 사용자 정보 저장
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }

  } catch (error) {
    console.error('인증 미들웨어 에러:', error);
    res.status(500).json({
      success: false,
      message: '인증 처리 중 오류가 발생했습니다.'
    });
  }
};

/**
 * 권한 체크 미들웨어 - 관리자 권한 확인
 */
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user는 protect 미들웨어에서 설정됨
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    // 사용자 역할 확인
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: '이 작업을 수행할 권한이 없습니다.'
      });
    }

    next();
  };
};
