const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

/**
 * 로그 디렉토리 생성
 */
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * 로그 파일 스트림 생성
 */
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

/**
 * 개발 환경 로거
 */
exports.devLogger = morgan('dev');

/**
 * 프로덕션 환경 로거
 * 파일에 로그 저장
 */
exports.prodLogger = morgan('combined', { stream: accessLogStream });

/**
 * 요청 로깅 미들웨어
 */
exports.requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent')
    };
    
    console.log(JSON.stringify(log));
  });
  
  next();
};

/**
 * 에러 로깅 함수
 */
exports.logError = (error, req) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      message: error.message,
      stack: error.stack
    },
    request: {
      method: req.method,
      path: req.originalUrl,
      body: req.body,
      ip: req.ip
    }
  };
  
  const errorLogPath = path.join(logsDir, 'error.log');
  fs.appendFileSync(errorLogPath, JSON.stringify(errorLog) + '\n');
  
  console.error('ERROR:', errorLog);
};
