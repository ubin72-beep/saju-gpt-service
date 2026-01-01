/**
 * API 클라이언트
 * 백엔드 API와 통신하는 헬퍼 함수들
 */

// API Base URL
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000' 
  : 'https://api.saju2026.com';  // 프로덕션 URL로 변경 필요

/**
 * API 요청 헬퍼 함수
 * @param {string} endpoint - API 엔드포인트
 * @param {object} options - fetch 옵션
 * @returns {Promise} - API 응답
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // 토큰이 있으면 Authorization 헤더 추가
  const token = localStorage.getItem('authToken');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    // 에러 처리
    if (!response.ok) {
      throw new Error(data.message || '요청 실패');
    }
    
    return data;
    
  } catch (error) {
    console.error('API 요청 에러:', error);
    throw error;
  }
}

/**
 * GET 요청
 */
async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST 요청
 */
async function post(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * PATCH 요청
 */
async function patch(endpoint, body) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * DELETE 요청
 */
async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

// ==================== 인증 API ====================

/**
 * 회원가입
 */
async function signup(email, password, name, birthDate, gender) {
  const data = await post('/api/auth/signup', {
    email,
    password,
    name,
    birthDate,
    gender
  });
  
  // 토큰 저장
  if (data.data && data.data.token) {
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
}

/**
 * 로그인
 */
async function login(email, password) {
  const data = await post('/api/auth/login', {
    email,
    password
  });
  
  // 토큰 저장
  if (data.data && data.data.token) {
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
}

/**
 * 로그아웃
 */
function logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  window.location.href = '/';
}

/**
 * 내 정보 조회
 */
async function getMe() {
  return get('/api/auth/me');
}

/**
 * 비밀번호 변경
 */
async function updatePassword(currentPassword, newPassword) {
  return patch('/api/auth/update-password', {
    currentPassword,
    newPassword
  });
}

// ==================== 사주 분석 API ====================

/**
 * 사주 분석 저장
 */
async function saveSajuAnalysis(birthInfo, sajuData, analysis, aiInsights) {
  return post('/api/saju', {
    birthInfo,
    sajuData,
    analysis,
    aiInsights
  });
}

/**
 * 내 사주 분석 목록
 */
async function getMySajuList(page = 1, limit = 10) {
  return get(`/api/saju/my?page=${page}&limit=${limit}`);
}

/**
 * 사주 분석 조회
 */
async function getSajuAnalysis(id) {
  return get(`/api/saju/${id}`);
}

/**
 * 사주 분석 수정
 */
async function updateSajuAnalysis(id, updates) {
  return patch(`/api/saju/${id}`, updates);
}

/**
 * 사주 분석 삭제
 */
async function deleteSajuAnalysis(id) {
  return del(`/api/saju/${id}`);
}

/**
 * 공개 사주 분석 목록
 */
async function getPublicSajuList(page = 1, limit = 10) {
  return get(`/api/saju/public?page=${page}&limit=${limit}`);
}

/**
 * 공유 토큰으로 사주 조회
 */
async function getSajuByShareToken(shareToken) {
  return get(`/api/saju/share/${shareToken}`);
}

// ==================== 구독 API ====================

/**
 * 구독 플랜 목록
 */
async function getSubscriptionPlans() {
  return get('/api/subscription/plans');
}

/**
 * 내 구독 정보
 */
async function getMySubscription() {
  return get('/api/subscription/my');
}

/**
 * 구독 생성
 */
async function createSubscription(plan, paymentInfo) {
  return post('/api/subscription', {
    plan,
    paymentInfo
  });
}

/**
 * 구독 취소
 */
async function cancelSubscription(reason) {
  return post('/api/subscription/cancel', { reason });
}

/**
 * 구독 재개
 */
async function renewSubscription() {
  return post('/api/subscription/renew');
}

/**
 * 구독 히스토리
 */
async function getSubscriptionHistory() {
  return get('/api/subscription/history');
}

// ==================== 사용자 API ====================

/**
 * 프로필 수정
 */
async function updateProfile(name, birthDate, gender) {
  return patch('/api/users/profile', {
    name,
    birthDate,
    gender
  });
}

/**
 * 계정 삭제
 */
async function deleteAccount() {
  const confirmed = confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
  if (!confirmed) return;
  
  await del('/api/users/me');
  logout();
}

// ==================== API 객체 export ====================

const API = {
  // 인증
  signup,
  login,
  logout,
  getMe,
  updatePassword,
  
  // 사주 분석
  saveSajuAnalysis,
  getMySajuList,
  getSajuAnalysis,
  updateSajuAnalysis,
  deleteSajuAnalysis,
  getPublicSajuList,
  getSajuByShareToken,
  
  // 구독
  getSubscriptionPlans,
  getMySubscription,
  createSubscription,
  cancelSubscription,
  renewSubscription,
  getSubscriptionHistory,
  
  // 사용자
  updateProfile,
  deleteAccount
};

// 전역 객체로 등록
window.API = API;
