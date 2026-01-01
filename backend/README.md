# AI 사주 천년지기 백엔드 API

Node.js + Express + MongoDB 기반 백엔드 서버

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 만들고, 실제 값으로 수정하세요.

```bash
cp .env.example .env
```

**주요 환경 변수:**

- `MONGODB_URI`: MongoDB Atlas 연결 URI
- `JWT_SECRET`: JWT 토큰 암호화 키
- `PORT`: 서버 포트 (기본값: 3000)

### 3. 서버 실행

**개발 모드:**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

### 4. 서버 확인

```
http://localhost:3000/health
```

---

## 📁 프로젝트 구조

```
backend/
├── models/              # 데이터 모델
│   ├── User.js         # 사용자 모델
│   ├── SajuAnalysis.js # 사주 분석 모델
│   └── Subscription.js # 구독 모델
├── controllers/         # 비즈니스 로직
│   ├── authController.js
│   ├── sajuController.js
│   └── subscriptionController.js
├── routes/             # API 라우트
│   ├── auth.js
│   ├── saju.js
│   ├── subscription.js
│   └── users.js
├── .env.example        # 환경 변수 템플릿
├── server.js           # 메인 서버 파일
└── package.json        # 의존성 관리
```

---

## 🔌 API 엔드포인트

### 인증 API (`/api/auth`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/signup` | 회원가입 | ❌ |
| POST | `/login` | 로그인 | ❌ |
| GET | `/me` | 내 정보 조회 | ✅ |
| PATCH | `/update-password` | 비밀번호 변경 | ✅ |

### 사주 분석 API (`/api/saju`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| POST | `/` | 사주 분석 저장 | ✅ |
| GET | `/my` | 내 사주 목록 | ✅ |
| GET | `/:id` | 사주 분석 조회 | ✅ |
| PATCH | `/:id` | 사주 분석 수정 | ✅ |
| DELETE | `/:id` | 사주 분석 삭제 | ✅ |
| GET | `/public` | 공개 사주 목록 | ❌ |
| GET | `/share/:shareToken` | 공유 사주 조회 | ❌ |

### 구독 API (`/api/subscription`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| GET | `/plans` | 구독 플랜 목록 | ❌ |
| GET | `/my` | 내 구독 정보 | ✅ |
| POST | `/` | 구독 생성 | ✅ |
| POST | `/cancel` | 구독 취소 | ✅ |
| POST | `/renew` | 구독 재개 | ✅ |
| GET | `/history` | 구독 히스토리 | ✅ |

### 사용자 API (`/api/users`)

| 메서드 | 엔드포인트 | 설명 | 인증 |
|--------|-----------|------|------|
| PATCH | `/profile` | 프로필 수정 | ✅ |
| DELETE | `/me` | 계정 삭제 | ✅ |

---

## 🧪 API 테스트 예시

### 회원가입

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "홍길동"
  }'
```

### 로그인

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 인증이 필요한 API 호출

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔒 보안

- 비밀번호는 bcrypt로 암호화
- JWT 토큰 기반 인증
- CORS 설정
- Rate Limiting 적용
- Helmet으로 HTTP 헤더 보안

---

## 📦 주요 의존성

- **express**: 웹 프레임워크
- **mongoose**: MongoDB ODM
- **bcrypt**: 비밀번호 암호화
- **jsonwebtoken**: JWT 인증
- **helmet**: HTTP 보안
- **cors**: CORS 설정
- **express-rate-limit**: API 요청 제한
- **morgan**: HTTP 로깅

---

## 🌐 배포

### Vercel 배포 (권장)

1. Vercel CLI 설치:
```bash
npm i -g vercel
```

2. 배포:
```bash
vercel
```

### Railway 배포

1. Railway CLI 설치 또는 웹 UI 사용
2. MongoDB URI를 환경 변수로 설정
3. 배포

---

## 📝 라이선스

ISC

---

## 👨‍💻 개발자

AI 사주 천년지기 팀

---

## 🔗 관련 링크

- **프론트엔드**: https://github.com/ubin72-beep/saju-gpt-service
- **프로덕션**: https://ubin72-beep.github.io/saju-gpt-service/
