/**
 * 인증 헬퍼 유틸리티
 * 로그인 상태 관리 및 토큰 처리
 */

/**
 * 로그인 여부 확인
 * @returns {boolean}
 */
function isLoggedIn() {
  return localStorage.getItem('authToken') !== null;
}

/**
 * 현재 사용자 정보 가져오기
 * @returns {object|null}
 */
function getCurrentUser() {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('사용자 정보 파싱 에러:', error);
    return null;
  }
}

/**
 * 토큰 가져오기
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('authToken');
}

/**
 * 로그인 필요 페이지 접근 제한
 * 로그인하지 않은 경우 로그인 페이지로 리다이렉트
 */
function requireAuth() {
  if (!isLoggedIn()) {
    const currentPath = window.location.pathname;
    sessionStorage.setItem('redirectAfterLogin', currentPath);
    window.location.href = '/login.html';
  }
}

/**
 * 로그인 후 원래 페이지로 리다이렉트
 */
function redirectAfterLogin() {
  const redirectPath = sessionStorage.getItem('redirectAfterLogin');
  sessionStorage.removeItem('redirectAfterLogin');
  
  if (redirectPath) {
    window.location.href = redirectPath;
  } else {
    window.location.href = '/mypage.html';
  }
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
 * 토큰 만료 확인
 * @returns {boolean}
 */
function isTokenExpired() {
  const token = getToken();
  if (!token) return true;
  
  try {
    // JWT 디코딩 (간단한 방식)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;  // 초 → 밀리초
    
    return Date.now() >= exp;
  } catch (error) {
    console.error('토큰 파싱 에러:', error);
    return true;
  }
}

/**
 * 자동 로그아웃 (토큰 만료 시)
 */
function checkTokenExpiration() {
  if (isLoggedIn() && isTokenExpired()) {
    alert('로그인 세션이 만료되었습니다. 다시 로그인해주세요.');
    logout();
  }
}

/**
 * 주기적으로 토큰 만료 확인 (5분마다)
 */
setInterval(checkTokenExpiration, 5 * 60 * 1000);

/**
 * 로그인 상태에 따라 UI 업데이트
 * 네비게이션 바의 로그인/로그아웃 버튼 토글
 */
function updateAuthUI() {
  const loginBtn = document.querySelector('.nav-login-btn');
  const userMenu = document.querySelector('.user-menu');
  
  if (isLoggedIn()) {
    // 로그인 상태
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) {
      userMenu.style.display = 'block';
      
      const user = getCurrentUser();
      if (user) {
        const userName = userMenu.querySelector('.user-name');
        if (userName) userName.textContent = user.name;
      }
    }
  } else {
    // 비로그인 상태
    if (loginBtn) loginBtn.style.display = 'block';
    if (userMenu) userMenu.style.display = 'none';
  }
}

/**
 * 페이지 로드 시 인증 UI 업데이트
 */
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  checkTokenExpiration();
});

/**
 * 로그인 폼 처리
 */
function handleLoginForm() {
  const loginForm = document.querySelector('#loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    
    try {
      // 버튼 비활성화
      submitBtn.disabled = true;
      submitBtn.textContent = '로그인 중...';
      
      // API 호출
      const response = await API.login(email, password);
      
      if (response.success) {
        alert('로그인 성공!');
        redirectAfterLogin();
      }
      
    } catch (error) {
      alert(error.message || '로그인에 실패했습니다.');
      submitBtn.disabled = false;
      submitBtn.textContent = '로그인';
    }
  });
}

/**
 * 회원가입 폼 처리
 */
function handleSignupForm() {
  const signupForm = document.querySelector('#signupForm');
  if (!signupForm) return;
  
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;
    const name = document.querySelector('#name').value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    
    // 비밀번호 확인
    if (password !== passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    try {
      // 버튼 비활성화
      submitBtn.disabled = true;
      submitBtn.textContent = '가입 중...';
      
      // API 호출
      const response = await API.signup(email, password, name);
      
      if (response.success) {
        alert('회원가입 성공! 환영합니다.');
        window.location.href = '/mypage.html';
      }
      
    } catch (error) {
      alert(error.message || '회원가입에 실패했습니다.');
      submitBtn.disabled = false;
      submitBtn.textContent = '회원가입';
    }
  });
}

/**
 * 페이지 로드 시 폼 핸들러 등록
 */
document.addEventListener('DOMContentLoaded', () => {
  handleLoginForm();
  handleSignupForm();
});

// ==================== Auth 객체 export ====================

const Auth = {
  isLoggedIn,
  getCurrentUser,
  getToken,
  requireAuth,
  redirectAfterLogin,
  logout,
  isTokenExpired,
  checkTokenExpiration,
  updateAuthUI
};

// 전역 객체로 등록
window.Auth = Auth;
