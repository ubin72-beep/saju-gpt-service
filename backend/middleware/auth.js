const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * JWT 인증 미들웨어
 * Authorization 헤더의 Bearer 토큰을 검증합니다
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Authorization 헤더에서 토큰 추출
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 토큰이 없는 경우
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '인증 토큰이 없습니다. 로그인해주세요.'
      });
    }

    try {
      // 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 정보 조회
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: '사용자를 찾을 수 없습니다.'
        });
      }

      // req.user에 사용자 정보 저장
      req.user = user;
      next();

    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.',
        error: error.message
      });
    }

  } catch (error) {
    console.error('인증 미들웨어 에러:', error);
    return res.status(500).json({
      success: false,
      message: '인증 처리 중 오류가 발생했습니다.',
      error: error.message
    });
  }
};

/**
 * 관리자 권한 확인 미들웨어
 * protect 미들웨어 이후에 사용해야 합니다
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `${req.user.role} 권한으로는 접근할 수 없습니다.`
      });
    }
    next();
  };
};
