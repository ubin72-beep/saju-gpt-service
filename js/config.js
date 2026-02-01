// AI 사주 천년지기 - API 설정 파일
// 작성일: 2026-02-01

/**
 * API 기본 설정
 */
const API_CONFIG = {
  // 배포 환경에 따라 자동으로 Base URL 설정
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'  // 로컬 개발
    : 'https://your-backend.railway.app',  // 프로덕션 (배포 후 변경 필요)
  
  /**
   * API 엔드포인트
   */
  ENDPOINTS: {
    // 인증 API
    AUTH: {
      SIGNUP: '/api/auth/signup',
      LOGIN: '/api/auth/login',
      ME: '/api/auth/me',
      UPDATE_PASSWORD: '/api/auth/update-password',
      LOGOUT: '/api/auth/logout'
    },
    
    // 사주 분석 API
    SAJU: {
      CREATE: '/api/saju',
      MY_LIST: '/api/saju/my',
      DETAIL: (id) => `/api/saju/${id}`,
      UPDATE: (id) => `/api/saju/${id}`,
      DELETE: (id) => `/api/saju/${id}`,
      PUBLIC: '/api/saju/public',
      SHARE: (shareToken) => `/api/saju/share/${shareToken}`
    },
    
    // 구독 관리 API
    SUBSCRIPTION: {
      PLANS: '/api/subscription/plans',
      MY: '/api/subscription/my',
      CREATE: '/api/subscription',
      CANCEL: '/api/subscription/cancel',
      RENEW: '/api/subscription/renew',
      HISTORY: '/api/subscription/history'
    },
    
    // 사용자 API
    USERS: {
      PROFILE: '/api/users/profile',
      DELETE: '/api/users/me'
    },
    
    // 관리자 API (TODO: 백엔드 구현 필요)
    ADMIN: {
      STATS: '/api/admin/stats',
      USERS: '/api/admin/users',
      ORDERS: '/api/admin/orders',
      SERVICES: '/api/admin/services'
    }
  },
  
  /**
   * 기본 헤더
   */
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json'
  }
};

/**
 * API 호출 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} options - fetch 옵션
 * @returns {Promise} API 응답
 */
async function apiCall(endpoint, options = {}) {
  // 토큰 가져오기
  const token = localStorage.getItem('authToken');
  
  // 기본 옵션 설정
  const defaultOptions = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };
  
  // 옵션 병합
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  try {
    // API 호출
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, finalOptions);
    
    // 응답 파싱
    const data = await response.json();
    
    // 에러 처리
    if (!response.ok) {
      // 401 Unauthorized - 로그인 필요
      if (response.status === 401) {
        console.error('❌ 인증 실패: 로그인이 필요합니다.');
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        
        // 로그인 페이지로 리다이렉트 (현재 페이지가 로그인 페이지가 아닌 경우)
        if (!window.location.pathname.includes('login.html')) {
          alert('로그인이 필요합니다.');
          window.location.href = 'login.html';
        }
      }
      
      throw new Error(data.message || `HTTP ${response.status}: 요청 실패`);
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ API 호출 실패:', error);
    throw error;
  }
}

/**
 * 인증 API 함수들
 */
const AuthAPI = {
  /**
   * 회원가입
   */
  async signup(email, password, name) {
    return apiCall(API_CONFIG.ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  },
  
  /**
   * 로그인
   */
  async login(email, password) {
    const response = await apiCall(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // 토큰 저장
    if (response.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return response;
  },
  
  /**
   * 내 정보 조회
   */
  async getMe() {
    return apiCall(API_CONFIG.ENDPOINTS.AUTH.ME);
  },
  
  /**
   * 비밀번호 변경
   */
  async updatePassword(currentPassword, newPassword) {
    return apiCall(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PASSWORD, {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  },
  
  /**
   * 로그아웃
   */
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
  }
};

/**
 * 사주 분석 API 함수들
 */
const SajuAPI = {
  /**
   * 사주 분석 생성
   */
  async create(sajuData) {
    return apiCall(API_CONFIG.ENDPOINTS.SAJU.CREATE, {
      method: 'POST',
      body: JSON.stringify(sajuData)
    });
  },
  
  /**
   * 내 사주 목록 조회
   */
  async getMyList(page = 1, limit = 10) {
    return apiCall(`${API_CONFIG.ENDPOINTS.SAJU.MY_LIST}?page=${page}&limit=${limit}`);
  },
  
  /**
   * 사주 분석 상세 조회
   */
  async getDetail(id) {
    return apiCall(API_CONFIG.ENDPOINTS.SAJU.DETAIL(id));
  },
  
  /**
   * 사주 분석 수정
   */
  async update(id, updateData) {
    return apiCall(API_CONFIG.ENDPOINTS.SAJU.UPDATE(id), {
      method: 'PATCH',
      body: JSON.stringify(updateData)
    });
  },
  
  /**
   * 사주 분석 삭제
   */
  async delete(id) {
    return apiCall(API_CONFIG.ENDPOINTS.SAJU.DELETE(id), {
      method: 'DELETE'
    });
  }
};

/**
 * 구독 API 함수들
 */
const SubscriptionAPI = {
  /**
   * 구독 플랜 목록 조회
   */
  async getPlans() {
    return apiCall(API_CONFIG.ENDPOINTS.SUBSCRIPTION.PLANS);
  },
  
  /**
   * 내 구독 정보 조회
   */
  async getMy() {
    return apiCall(API_CONFIG.ENDPOINTS.SUBSCRIPTION.MY);
  },
  
  /**
   * 구독 생성
   */
  async create(plan, paymentMethod, transactionId) {
    return apiCall(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CREATE, {
      method: 'POST',
      body: JSON.stringify({ plan, paymentMethod, transactionId })
    });
  },
  
  /**
   * 구독 취소
   */
  async cancel(reason) {
    return apiCall(API_CONFIG.ENDPOINTS.SUBSCRIPTION.CANCEL, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
};

/**
 * 관리자 API 함수들 (TODO: 백엔드 구현 필요)
 */
const AdminAPI = {
  /**
   * 대시보드 통계 조회
   */
  async getStats() {
    return apiCall(API_CONFIG.ENDPOINTS.ADMIN.STATS);
  },
  
  /**
   * 회원 목록 조회
   */
  async getUsers(page = 1, limit = 20) {
    return apiCall(`${API_CONFIG.ENDPOINTS.ADMIN.USERS}?page=${page}&limit=${limit}`);
  },
  
  /**
   * 주문 목록 조회
   */
  async getOrders(page = 1, limit = 20) {
    return apiCall(`${API_CONFIG.ENDPOINTS.ADMIN.ORDERS}?page=${page}&limit=${limit}`);
  }
};

/**
 * 사용 예시:
 * 
 * // 로그인
 * const loginResponse = await AuthAPI.login('user@example.com', 'password123');
 * 
 * // 내 정보 조회
 * const userInfo = await AuthAPI.getMe();
 * 
 * // 사주 분석 생성
 * const sajuResponse = await SajuAPI.create({
 *   birthInfo: { ... },
 *   analysis: { ... }
 * });
 * 
 * // 구독 플랜 조회
 * const plans = await SubscriptionAPI.getPlans();
 */

// 콘솔 로그
console.log('✅ API 설정 로드 완료');
console.log('📡 Base URL:', API_CONFIG.BASE_URL);
