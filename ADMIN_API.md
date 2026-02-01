# 🔐 관리자 API 문서

**작성일**: 2026-02-01  
**버전**: 1.0.0  
**Base URL**: `https://your-backend.railway.app/api/admin`

---

## 🔒 **인증 요구사항**

모든 관리자 API는 다음 조건을 만족해야 합니다:

1. **JWT 토큰** 필수 (Header: `Authorization: Bearer <token>`)
2. **관리자 권한** 필수 (`role: 'admin'` 또는 `'super_admin'`)

---

## 📊 **1. 대시보드 통계 API**

### **GET /api/admin/stats**

관리자 대시보드의 통계 데이터 조회 (그래프 없음, 숫자 카드만)

#### **Request**
```javascript
fetch('https://your-backend.railway.app/api/admin/stats', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  }
})
```

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "mainStats": {
      "totalUsers": {
        "value": 12543,
        "change": "+12.5%",
        "trend": "up",
        "label": "총 회원 수"
      },
      "todayVisitors": {
        "value": 1847,
        "change": "+8.3%",
        "trend": "up",
        "label": "오늘 방문자"
      },
      "monthlyRevenue": {
        "value": 8542000,
        "change": "+23.1%",
        "trend": "up",
        "label": "이번 달 매출",
        "formatted": "₩8,542,000"
      },
      "premiumMembers": {
        "value": 2156,
        "change": "+15.7%",
        "trend": "up",
        "label": "프리미엄 회원"
      }
    },
    "additionalStats": {
      "newUsersThisMonth": {
        "value": 345,
        "label": "이번 달 신규 회원"
      },
      "totalSajuAnalysis": {
        "value": 45678,
        "label": "총 사주 분석 건수"
      },
      "thisMonthSaju": {
        "value": 1234,
        "label": "이번 달 사주 분석"
      }
    },
    "recentActivity": {
      "recentUsers": [
        {
          "name": "홍길동",
          "email": "hong@example.com",
          "plan": "free",
          "joinedAt": "2026-02-01T10:30:00Z"
        }
      ],
      "recentSubscriptions": [
        {
          "userName": "김철수",
          "plan": "monthly",
          "amount": 19900,
          "status": "active",
          "createdAt": "2026-02-01T09:00:00Z"
        }
      ],
      "popularServices": [
        {
          "type": "detailed",
          "count": 1234
        }
      ]
    }
  }
}
```

---

## 👥 **2. 회원 관리 API**

### **GET /api/admin/users**

회원 목록 조회 (페이지네이션, 검색 지원)

#### **Query Parameters**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `search` (optional): 검색어 (이름, 이메일)

#### **Request**
```javascript
fetch('https://your-backend.railway.app/api/admin/users?page=1&limit=20&search=홍길동', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  }
})
```

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "홍길동",
        "email": "hong@example.com",
        "plan": "monthly",
        "joinedAt": "2026-01-15T10:30:00Z",
        "lastLogin": "2026-02-01T14:20:00Z",
        "status": "활성"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalUsers": 200,
      "limit": 20
    }
  }
}
```

---

### **GET /api/admin/users/:id**

회원 상세 정보 조회

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "홍길동",
      "email": "hong@example.com",
      "phone": "010-1234-5678",
      "subscription": {
        "plan": "monthly",
        "status": "active",
        "startDate": "2026-01-15T00:00:00Z",
        "endDate": "2026-02-15T00:00:00Z"
      },
      "createdAt": "2026-01-15T10:30:00Z",
      "lastLogin": "2026-02-01T14:20:00Z",
      "isActive": true
    },
    "sajuHistory": [
      {
        "analysisType": "detailed",
        "createdAt": "2026-01-20T10:00:00Z"
      }
    ],
    "subscriptionHistory": [
      {
        "plan": "monthly",
        "amount": 19900,
        "status": "active"
      }
    ]
  }
}
```

---

### **PATCH /api/admin/users/:id**

회원 정보 수정

#### **Request Body**
```json
{
  "name": "홍길동",
  "email": "new@example.com",
  "phone": "010-9999-8888",
  "isActive": true,
  "subscription": {
    "plan": "premium"
  }
}
```

#### **Response (200 OK)**
```json
{
  "success": true,
  "message": "회원 정보가 수정되었습니다.",
  "data": {
    "user": { /* 수정된 회원 정보 */ }
  }
}
```

---

### **DELETE /api/admin/users/:id**

회원 비활성화 (소프트 삭제)

#### **Response (200 OK)**
```json
{
  "success": true,
  "message": "회원이 비활성화되었습니다."
}
```

---

## 💳 **3. 주문/결제 관리 API**

### **GET /api/admin/orders**

주문 목록 조회

#### **Query Parameters**
- `page` (optional): 페이지 번호 (기본값: 1)
- `limit` (optional): 페이지당 항목 수 (기본값: 20)
- `status` (optional): 상태 필터 (전체, active, cancelled, expired)

#### **Request**
```javascript
fetch('https://your-backend.railway.app/api/admin/orders?page=1&status=active', {
  headers: {
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  }
})
```

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "507f1f77bcf86cd799439012",
        "userName": "홍길동",
        "userEmail": "hong@example.com",
        "plan": "monthly",
        "amount": 19900,
        "finalAmount": 19900,
        "status": "active",
        "paymentMethod": "card",
        "createdAt": "2026-01-15T10:00:00Z",
        "startDate": "2026-01-15T00:00:00Z",
        "endDate": "2026-02-15T00:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalOrders": 100,
      "limit": 20
    }
  }
}
```

---

### **GET /api/admin/orders/:id**

주문 상세 정보 조회

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "507f1f77bcf86cd799439012",
      "userId": {
        "name": "홍길동",
        "email": "hong@example.com",
        "phone": "010-1234-5678"
      },
      "plan": "monthly",
      "amount": 19900,
      "finalAmount": 19900,
      "status": "active",
      "paymentMethod": "card",
      "transactionId": "toss_12345",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  }
}
```

---

### **PATCH /api/admin/orders/:id/status**

주문 상태 변경

#### **Request Body**
```json
{
  "status": "cancelled"
}
```

**허용된 상태**: `active`, `cancelled`, `expired`, `pending`

#### **Response (200 OK)**
```json
{
  "success": true,
  "message": "주문 상태가 변경되었습니다.",
  "data": {
    "order": { /* 수정된 주문 정보 */ }
  }
}
```

---

## 🛍️ **4. 서비스 관리 API**

### **GET /api/admin/services**

서비스 목록 및 통계 조회

#### **Response (200 OK)**
```json
{
  "success": true,
  "data": {
    "sajuServices": [
      {
        "type": "detailed",
        "count": 1234,
        "label": "상세 사주"
      },
      {
        "type": "premium",
        "count": 567,
        "label": "프리미엄 종합 분석"
      }
    ],
    "subscriptionPlans": [
      {
        "plan": "monthly",
        "count": 2000,
        "revenue": 39800000,
        "label": "월간 플랜"
      },
      {
        "plan": "annual",
        "count": 500,
        "revenue": 99500000,
        "label": "연간 플랜"
      }
    ]
  }
}
```

---

### **PATCH /api/admin/services/:id**

서비스 정보 수정 (TODO: 구현 예정)

---

## ❌ **에러 응답**

### **401 Unauthorized - 인증 실패**
```json
{
  "success": false,
  "message": "로그인이 필요합니다."
}
```

### **403 Forbidden - 권한 없음**
```json
{
  "success": false,
  "message": "이 작업을 수행할 권한이 없습니다."
}
```

### **404 Not Found - 리소스 없음**
```json
{
  "success": false,
  "message": "회원을 찾을 수 없습니다."
}
```

### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "서버 내부 오류가 발생했습니다.",
  "error": "에러 상세 메시지"
}
```

---

## 💡 **사용 예시**

### **JavaScript (Fetch API)**

```javascript
// 관리자 토큰 (로그인 후 받은 토큰)
const adminToken = localStorage.getItem('authToken');

// 1. 대시보드 통계 조회
async function loadAdminStats() {
  const response = await fetch('https://your-backend.railway.app/api/admin/stats', {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    const stats = data.data.mainStats;
    
    // UI 업데이트
    document.getElementById('total-users').textContent = stats.totalUsers.value.toLocaleString();
    document.getElementById('today-visitors').textContent = stats.todayVisitors.value.toLocaleString();
    document.getElementById('monthly-revenue').textContent = stats.monthlyRevenue.formatted;
    document.getElementById('premium-members').textContent = stats.premiumMembers.value.toLocaleString();
  }
}

// 2. 회원 목록 조회
async function loadUsers(page = 1) {
  const response = await fetch(`https://your-backend.railway.app/api/admin/users?page=${page}&limit=20`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    renderUsersTable(data.data.users);
    renderPagination(data.data.pagination);
  }
}

// 3. 회원 상세 정보 조회
async function getUserDetail(userId) {
  const response = await fetch(`https://your-backend.railway.app/api/admin/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    showUserModal(data.data.user);
  }
}

// 4. 주문 목록 조회
async function loadOrders(page = 1, status = '전체') {
  const statusQuery = status !== '전체' ? `&status=${status}` : '';
  
  const response = await fetch(`https://your-backend.railway.app/api/admin/orders?page=${page}&limit=20${statusQuery}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  
  const data = await response.json();
  
  if (data.success) {
    renderOrdersTable(data.data.orders);
  }
}
```

---

## 🔗 **관련 문서**

- [백엔드 API 전체 문서](./BACKEND_API.md)
- [배포 가이드](./BACKEND_DEPLOYMENT_PLAN.md)
- [프론트엔드 연동 가이드](./FRONTEND_BACKEND_INTEGRATION.md)

---

**작성자**: AI Assistant  
**최종 수정일**: 2026-02-01
