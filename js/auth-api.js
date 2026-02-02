/**
 * AI 사주 천년지기 - 인증 처리 (API 연동)
 */

const API_BASE = '/api';

/**
 * 로그인
 */
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // 토큰 저장
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            return { 
                success: true, 
                message: '로그인 성공!' 
            };
        } else {
            return { 
                success: false, 
                message: data.error || '로그인 실패' 
            };
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        return { 
            success: false, 
            message: '서버 오류가 발생했습니다' 
        };
    }
}

/**
 * 회원가입
 */
async function register(userData) {
    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            return { 
                success: true, 
                message: '회원가입이 완료되었습니다!' 
            };
        } else {
            return { 
                success: false, 
                message: data.error || '회원가입 실패' 
            };
        }
    } catch (error) {
        console.error('회원가입 오류:', error);
        return { 
            success: false, 
            message: '서버 오류가 발생했습니다' 
        };
    }
}

/**
 * 로그아웃
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = 'index.html';
}

/**
 * 로그인 상태 확인
 */
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

/**
 * 현재 사용자 정보 가져오기
 */
function getCurrentUser() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

/**
 * 관리자 권한 확인
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

/**
 * 인증 토큰 가져오기
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * API 호출 헬퍼 (인증 포함)
 */
async function apiCall(endpoint, options = {}) {
    const token = getAuthToken();
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        const data = await response.json();
        
        // 인증 오류 시 로그인 페이지로 리다이렉트
        if (response.status === 401 || response.status === 403) {
            alert('로그인이 필요합니다');
            sessionStorage.setItem('returnUrl', window.location.href);
            window.location.href = 'login.html';
            return null;
        }
        
        if (!response.ok) {
            throw new Error(data.error || '요청 실패');
        }
        
        return data;
    } catch (error) {
        console.error('API 호출 오류:', error);
        throw error;
    }
}
