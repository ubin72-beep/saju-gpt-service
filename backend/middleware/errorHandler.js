/**
 * 전역 에러 핸들러 미들웨어
 */
exports.errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // 로그 출력
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = '리소스를 찾을 수 없습니다.';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = '중복된 값이 존재합니다.';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || '서버 에러가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 404 Not Found 핸들러
 */
exports.notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `요청하신 API 엔드포인트를 찾을 수 없습니다: ${req.originalUrl}`
  });
};
