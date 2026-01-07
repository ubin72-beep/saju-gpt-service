// API 클라이언트
const API_BASE_URL = '/api';

/**
 * 로그인 함수
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 로그인 결과
 */
async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // 토큰 저장
            localStorage.setItem('authToken', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            return data;
        } else {
            return {
                success: false,
                message: data.message || '로그인에 실패했습니다.'
            };
        }
    } catch (error) {
        console.error('로그인 API 오류:', error);
        return {
            success: false,
            message: '서버와 통신할 수 없습니다.'
        };
    }
}

/**
 * 로그아웃 함수
 */
function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('admin_remember');
    window.location.href = 'index.html';
}

/**
 * 인증 확인 함수
 * @returns {boolean} 인증 여부
 */
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
}

/**
 * 현재 사용자 정보 가져오기
 * @returns {Object|null} 사용자 정보
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

/**
 * 관리자 권한 확인
 * @returns {boolean} 관리자 여부
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// API 클라이언트 준비 완료
console.log('✅ API 클라이언트 로드 완료');
