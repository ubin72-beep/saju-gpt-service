# 🔌 AI 사주 천년지기 - Backend API 문서

---

## 📋 목차

1. [개요](#개요)
2. [인증 방식](#인증-방식)
3. [에러 응답 형식](#에러-응답-형식)
4. [인증 API](#인증-api)
5. [사주 분석 API](#사주-분석-api)
6. [구독 API](#구독-api)
7. [사용자 API](#사용자-api)

---

## 개요

### Base URL
```
개발: http://localhost:3000
프로덕션: https://api.saju2026.com (예정)
```

### Content-Type
```
Content-Type: application/json
```

---

## 인증 방식

### JWT Bearer Token

**헤더 형식:**
```
Authorization: Bearer {JWT_TOKEN}
```

**토큰 만료:**
- 기본 만료 시간: 7일
- 토큰은 로그인 또는 회원가입 시 발급됩니다

**예시:**
```javascript
fetch('http://localhost:3000/api/auth/me', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})
```

---

## 에러 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "성공 메시지",
  "data": { ... }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "error": "상세 에러 정보 (개발 환경)"
}
```

### HTTP 상태 코드
- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청
- `401 Unauthorized`: 인증 실패
- `403 Forbidden`: 권한 없음
- `404 Not Found`: 리소스 없음
- `500 Internal Server Error`: 서버 오류

---

## 인증 API

### 1. 회원가입

**`POST /api/auth/signup`**

**요청 본문:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "name": "홍길동",
  "birthDate": {
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14
  },
  "gender": "male"
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67751d2e3f4b2c001a8d9f12",
      "email": "test@example.com",
      "name": "홍길동",
      "role": "user",
      "subscription": {
        "plan": "free",
        "status": "active"
      },
      "credits": 3,
      "createdAt": "2026-01-01T14:30:00.000Z"
    }
  }
}
```

**에러 (400 Bad Request):**
```json
{
  "success": false,
  "message": "이미 등록된 이메일입니다."
}
```

---

### 2. 로그인

**`POST /api/auth/login`**

**요청 본문:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "로그인 성공",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "67751d2e3f4b2c001a8d9f12",
      "email": "test@example.com",
      "name": "홍길동",
      "role": "user",
      "subscription": {
        "plan": "free",
        "status": "active"
      },
      "credits": 3,
      "lastLogin": "2026-01-01T14:31:00.000Z"
    }
  }
}
```

**에러 (401 Unauthorized):**
```json
{
  "success": false,
  "message": "이메일 또는 비밀번호가 올바르지 않습니다."
}
```

---

### 3. 내 정보 조회

**`GET /api/auth/me`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "67751d2e3f4b2c001a8d9f12",
      "email": "test@example.com",
      "name": "홍길동",
      "birthDate": {
        "year": 1990,
        "month": 5,
        "day": 15,
        "hour": 14
      },
      "gender": "male",
      "role": "user",
      "subscription": {
        "plan": "free",
        "status": "active"
      },
      "credits": 3,
      "lastLogin": "2026-01-01T14:31:00.000Z",
      "createdAt": "2026-01-01T14:30:00.000Z"
    }
  }
}
```

---

### 4. 비밀번호 변경

**`PATCH /api/auth/update-password`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "비밀번호가 변경되었습니다."
}
```

---

## 사주 분석 API

### 1. 사주 분석 저장

**`POST /api/saju`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "birthInfo": {
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "isLunar": false,
    "gender": "male"
  },
  "sajuData": {
    "yearPillar": { "heaven": "경", "earth": "오" },
    "monthPillar": { "heaven": "신", "earth": "사" },
    "dayPillar": { "heaven": "갑", "earth": "자" },
    "hourPillar": { "heaven": "경", "earth": "오" },
    "dayMaster": "갑",
    "elements": {
      "wood": 2,
      "fire": 3,
      "earth": 1,
      "metal": 2,
      "water": 0
    }
  },
  "analysis": {
    "personality": "리더십이 강하고...",
    "career": "경영, 기획...",
    "wealth": "재물운이 좋음...",
    "health": "간 건강 주의...",
    "love": "이성운이 왕성...",
    "luck2026": "2026년 대길...",
    "strengths": ["리더십", "추진력", "창의성"],
    "weaknesses": ["고집", "급한 성격"],
    "luckyColors": ["빨강", "주황"],
    "luckyNumbers": [3, 9],
    "luckyDirections": ["남쪽", "동쪽"]
  },
  "aiInsights": {
    "summary": "AI 요약...",
    "detailedAnalysis": "AI 상세 분석...",
    "recommendations": ["추천 1", "추천 2"],
    "warnings": ["주의 1", "주의 2"]
  }
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "message": "사주 분석이 저장되었습니다.",
  "data": {
    "sajuAnalysis": {
      "id": "67751e3f5a1b3c002b9d8f23",
      "userId": "67751d2e3f4b2c001a8d9f12",
      "birthInfo": { ... },
      "sajuData": { ... },
      "analysis": { ... },
      "aiInsights": { ... },
      "shareToken": "a3f5b8c9d2e1f4g6h7i8j9k0",
      "isPublic": false,
      "viewCount": 0,
      "createdAt": "2026-01-01T14:35:00.000Z"
    }
  }
}
```

**에러 (403 Forbidden):**
```json
{
  "success": false,
  "message": "무료 이용 횟수가 모두 소진되었습니다. 구독 플랜을 이용해주세요."
}
```

---

### 2. 내 사주 분석 목록

**`GET /api/saju/my?page=1&limit=10`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 개수 (기본값: 10)

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "67751e3f5a1b3c002b9d8f23",
        "birthInfo": { ... },
        "analysis": { ... },
        "shareToken": "a3f5b8c9d2e1f4g6h7i8j9k0",
        "isPublic": false,
        "viewCount": 0,
        "createdAt": "2026-01-01T14:35:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### 3. 사주 분석 조회

**`GET /api/saju/:id`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": "67751e3f5a1b3c002b9d8f23",
      "birthInfo": { ... },
      "sajuData": { ... },
      "analysis": { ... },
      "aiInsights": { ... },
      "shareToken": "a3f5b8c9d2e1f4g6h7i8j9k0",
      "isPublic": false,
      "viewCount": 1,
      "createdAt": "2026-01-01T14:35:00.000Z"
    }
  }
}
```

---

### 4. 사주 분석 수정

**`PATCH /api/saju/:id`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "isPublic": true
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "사주 분석이 수정되었습니다.",
  "data": {
    "analysis": { ... }
  }
}
```

---

### 5. 사주 분석 삭제

**`DELETE /api/saju/:id`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "사주 분석이 삭제되었습니다."
}
```

---

### 6. 공개 사주 분석 목록

**`GET /api/saju/public?page=1&limit=10`**

**쿼리 파라미터:**
- `page`: 페이지 번호 (기본값: 1)
- `limit`: 페이지당 개수 (기본값: 10)

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "67751e3f5a1b3c002b9d8f23",
        "birthInfo": { ... },
        "analysis": { ... },
        "viewCount": 42,
        "createdAt": "2026-01-01T14:35:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

---

### 7. 공유 토큰으로 조회

**`GET /api/saju/share/:shareToken`**

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "analysis": { ... }
  }
}
```

---

## 구독 API

### 1. 구독 플랜 목록

**`GET /api/subscription/plans`**

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "free",
        "name": "무료 체험",
        "price": 0,
        "currency": "KRW",
        "duration": "영구",
        "features": {
          "analysisLimit": 3,
          "unlimitedAnalysis": false,
          "aiChat": false,
          "premiumReports": false,
          "prioritySupport": false
        },
        "description": "회원가입 시 무료 3회 제공"
      },
      {
        "id": "monthly",
        "name": "월간 구독",
        "price": 19900,
        "currency": "KRW",
        "duration": "1개월",
        "features": {
          "analysisLimit": -1,
          "unlimitedAnalysis": true,
          "aiChat": true,
          "premiumReports": true,
          "prioritySupport": false
        },
        "description": "무제한 사주 분석 + AI 챗봇 상담"
      },
      {
        "id": "yearly",
        "name": "연간 구독",
        "price": 199000,
        "currency": "KRW",
        "duration": "1년",
        "features": {
          "analysisLimit": -1,
          "unlimitedAnalysis": true,
          "aiChat": true,
          "premiumReports": true,
          "prioritySupport": true
        },
        "description": "무제한 사주 분석 + AI 챗봇 상담 + 우선 지원",
        "discount": "월간 대비 17% 할인"
      }
    ]
  }
}
```

---

### 2. 내 구독 정보

**`GET /api/subscription/my`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscription": {
      "id": "67752a1f6b2c4d003c9e9a34",
      "userId": "67751d2e3f4b2c001a8d9f12",
      "plan": "monthly",
      "status": "active",
      "pricing": {
        "amount": 19900,
        "currency": "KRW"
      },
      "startDate": "2026-01-01T14:40:00.000Z",
      "endDate": "2026-02-01T14:40:00.000Z",
      "autoRenew": true,
      "features": { ... },
      "usageStats": {
        "analysisCount": 15,
        "aiChatCount": 42,
        "reportDownloads": 3
      }
    },
    "daysRemaining": 31
  }
}
```

---

### 3. 구독 생성

**`POST /api/subscription`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "plan": "monthly",
  "paymentInfo": {
    "method": "card",
    "transactionId": "TXN12345678"
  }
}
```

**응답 (201 Created):**
```json
{
  "success": true,
  "message": "구독이 시작되었습니다.",
  "data": {
    "subscription": { ... }
  }
}
```

---

### 4. 구독 취소

**`POST /api/subscription/cancel`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "reason": "서비스 불만족"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "구독이 취소되었습니다. 구독 기간까지는 계속 이용 가능합니다.",
  "data": {
    "subscription": { ... }
  }
}
```

---

### 5. 구독 재개

**`POST /api/subscription/renew`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "구독이 재개되었습니다.",
  "data": {
    "subscription": { ... }
  }
}
```

---

### 6. 구독 히스토리

**`GET /api/subscription/history`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "data": {
    "subscriptions": [
      {
        "id": "67752a1f6b2c4d003c9e9a34",
        "plan": "monthly",
        "status": "active",
        "startDate": "2026-01-01T14:40:00.000Z",
        "endDate": "2026-02-01T14:40:00.000Z",
        "createdAt": "2026-01-01T14:40:00.000Z"
      },
      {
        "id": "67651b2e5c3d4e002d8f8b23",
        "plan": "free",
        "status": "expired",
        "startDate": "2025-12-01T10:00:00.000Z",
        "endDate": "2025-12-31T10:00:00.000Z",
        "createdAt": "2025-12-01T10:00:00.000Z"
      }
    ]
  }
}
```

---

## 사용자 API

### 1. 프로필 수정

**`PATCH /api/users/profile`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 본문:**
```json
{
  "name": "홍길동2",
  "birthDate": {
    "year": 1990,
    "month": 5,
    "day": 16,
    "hour": 15
  },
  "gender": "male"
}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "프로필이 수정되었습니다.",
  "data": {
    "user": { ... }
  }
}
```

---

### 2. 계정 삭제

**`DELETE /api/users/me`** 🔒 인증 필요

**헤더:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 (200 OK):**
```json
{
  "success": true,
  "message": "계정이 삭제되었습니다."
}
```

---

## 📝 추가 참고사항

### Rate Limiting
- 기본: 15분당 100회 요청
- 초과 시: 429 Too Many Requests

### CORS
- 허용 도메인: 
  - http://localhost:8000
  - https://ubin72-beep.github.io

### 보안
- 모든 비밀번호는 bcrypt로 암호화
- JWT 토큰은 7일 후 만료
- HTTPS 사용 권장 (프로덕션)

---

**Made with ❤️ by AI 사주 천년지기 Team**
