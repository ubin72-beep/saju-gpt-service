require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Express 앱 생성
const app = express();

// ====================
// 미들웨어 설정
// ====================

// 보안 헤더
app.use(helmet());

// CORS 설정
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:8000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body 파싱
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 로깅
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.'
});
app.use('/api/', limiter);

// ====================
// MongoDB 연결
// ====================

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB 연결 성공!');
})
.catch((err) => {
  console.error('❌ MongoDB 연결 실패:', err.message);
  process.exit(1);
});

// ====================
// 라우트 설정
// ====================

// 헬스 체크
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'AI 사주 천년지기 백엔드 서버가 정상 작동 중입니다.',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API 라우트
try {
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/saju', require('./routes/saju'));
  app.use('/api/subscription', require('./routes/subscription'));
  app.use('/api/users', require('./routes/users'));
} catch (err) {
  console.log('⚠️ 라우트 파일을 찾을 수 없습니다. 나중에 추가하세요.');
}

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 API 엔드포인트를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error('❌ 에러 발생:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ====================
// 서버 시작
// ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║     🔮 AI 사주 천년지기 백엔드 서버 시작!      ║
║                                                  ║
║     포트: ${PORT}                                  
║     환경: ${process.env.NODE_ENV || 'development'}
║     시간: ${new Date().toLocaleString('ko-KR')}
║                                                  ║
╚══════════════════════════════════════════════════╝
  `);
});

// 우아한 종료
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM 신호를 받았습니다. 서버를 종료합니다...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB 연결이 종료되었습니다.');
    process.exit(0);
  });
});

module.exports = app;
