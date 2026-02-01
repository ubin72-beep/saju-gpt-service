/**
 * 관리자 인증 시스템
 * 관리자 전용 로그인/로그아웃 처리
 */

// 관리자 데이터 저장 키
const ADMIN_STORAGE_KEY = 'saju2026_admins';
const CURRENT_ADMIN_KEY = 'saju2026_current_admin';
const ADMIN_SESSION_KEY = 'saju2026_admin_session';

// 관리자 계정 초기화
function initializeAdmins() {
    const admins = getAdmins();
    if (admins.length === 0) {
        // 기본 관리자 계정 생성
        const defaultAdmin = {
            id: 'admin_' + Date.now(),
            username: 'admin',
            password: hashAdminPassword('admin1234'),
            name: '관리자',
            role: 'super_admin', // super_admin, admin, operator
            email: 'admin@aisaju1000.com',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            permissions: ['all'] // all, dashboard, users, orders, content, settings
        };
        
        saveAdmin(defaultAdmin);
        console.log('✅ 관리자 계정 생성됨: admin / admin1234');
    }
}

// 관리자 목록 가져오기
function getAdmins() {
    const adminsJson = localStorage.getItem(ADMIN_STORAGE_KEY);
    return adminsJson ? JSON.parse(adminsJson) : [];
}

// 관리자 저장
function saveAdmin(admin) {
    const admins = getAdmins();
    const existingIndex = admins.findIndex(a => a.id === admin.id);
    
    if (existingIndex !== -1) {
        admins[existingIndex] = admin;
    } else {
        admins.push(admin);
    }
    
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(admins));
}

// 관리자 비밀번호 해싱 (일반 사용자와 다른 솔트 사용)
function hashAdminPassword(password) {
    return btoa(password + 'admin_saju2026_secure_salt_v1');
}

// 관리자 비밀번호 검증
function verifyAdminPassword(inputPassword, hashedPassword) {
    return hashAdminPassword(inputPassword) === hashedPassword;
}

// 관리자 로그인
function adminLogin(username, password) {
    if (!username || !password) {
        return { success: false, message: '아이디와 비밀번호를 입력해주세요.' };
    }
    
    const admins = getAdmins();
    const admin = admins.find(a => a.username === username);
    
    if (!admin) {
        return { success: false, message: '존재하지 않는 관리자 계정입니다.' };
    }
    
    if (!verifyAdminPassword(password, admin.password)) {
        return { success: false, message: '비밀번호가 올바르지 않습니다.' };
    }
    
    // 마지막 로그인 시간 업데이트
    admin.lastLogin = new Date().toISOString();
    saveAdmin(admin);
    
    // 세션 생성
    createAdminSession(admin);
    
    return { 
        success: true, 
        message: '관리자 로그인 성공!',
        admin: sanitizeAdmin(admin)
    };
}

// 관리자 로그아웃
function adminLogout() {
    localStorage.removeItem(CURRENT_ADMIN_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return { success: true, message: '로그아웃 되었습니다.' };
}

// 관리자 세션 생성 (30분 자동 만료)
function createAdminSession(admin) {
    const session = {
        adminId: admin.id,
        username: admin.username,
        role: admin.role,
        permissions: admin.permissions,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30분
    };
    
    localStorage.setItem(CURRENT_ADMIN_KEY, JSON.stringify(sanitizeAdmin(admin)));
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

// 현재 관리자 가져오기
function getCurrentAdmin() {
    const adminJson = localStorage.getItem(CURRENT_ADMIN_KEY);
    if (!adminJson) return null;
    
    // 세션 유효성 검사
    const sessionJson = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionJson) return null;
    
    const session = JSON.parse(sessionJson);
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    
    // 세션 만료 확인
    if (now > expiresAt) {
        adminLogout();
        return null;
    }
    
    // 세션 연장 (활동 시 자동 30분 연장)
    session.expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    
    return JSON.parse(adminJson);
}

// 관리자 로그인 여부 확인
function isAdminLoggedIn() {
    return getCurrentAdmin() !== null;
}

// 관리자 권한 확인
function hasAdminPermission(permission) {
    const admin = getCurrentAdmin();
    if (!admin) return false;
    
    // super_admin은 모든 권한 보유
    if (admin.role === 'super_admin') return true;
    
    // 특정 권한 확인
    return admin.permissions.includes('all') || admin.permissions.includes(permission);
}

// 관리자 정보 정제 (비밀번호 제거)
function sanitizeAdmin(admin) {
    const { password, ...sanitized } = admin;
    return sanitized;
}

// 관리자 페이지 접근 체크 (페이지 로드 시 호출)
function checkAdminAccess() {
    if (!isAdminLoggedIn()) {
        alert('⚠️ 관리자 로그인이 필요합니다.');
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// 세션 만료 알림 (5분 전)
function checkSessionExpiry() {
    const sessionJson = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionJson) return;
    
    const session = JSON.parse(sessionJson);
    const expiresAt = new Date(session.expiresAt);
    const now = new Date();
    const timeLeft = expiresAt - now;
    
    // 5분 남았을 때 알림
    if (timeLeft > 0 && timeLeft < 5 * 60 * 1000 && timeLeft > 4.5 * 60 * 1000) {
        alert('⏰ 세션이 5분 후 만료됩니다. 활동을 계속하면 자동으로 연장됩니다.');
    }
}

// 관리자 비밀번호 변경
function changeAdminPassword(adminId, currentPassword, newPassword) {
    const admins = getAdmins();
    const admin = admins.find(a => a.id === adminId);
    
    if (!admin) {
        return { success: false, message: '관리자를 찾을 수 없습니다.' };
    }
    
    if (!verifyAdminPassword(currentPassword, admin.password)) {
        return { success: false, message: '현재 비밀번호가 올바르지 않습니다.' };
    }
    
    if (newPassword.length < 8) {
        return { success: false, message: '새 비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    
    admin.password = hashAdminPassword(newPassword);
    saveAdmin(admin);
    
    return { success: true, message: '비밀번호가 변경되었습니다.' };
}

// 관리자 추가 (super_admin만 가능)
function addAdmin(newAdminData) {
    const currentAdmin = getCurrentAdmin();
    
    if (!currentAdmin || currentAdmin.role !== 'super_admin') {
        return { success: false, message: '권한이 없습니다. (Super Admin 전용)' };
    }
    
    const { username, password, name, email, role, permissions } = newAdminData;
    
    if (!username || !password || !name) {
        return { success: false, message: '필수 정보를 모두 입력해주세요.' };
    }
    
    // 중복 확인
    const admins = getAdmins();
    if (admins.find(a => a.username === username)) {
        return { success: false, message: '이미 존재하는 아이디입니다.' };
    }
    
    const newAdmin = {
        id: 'admin_' + Date.now(),
        username,
        password: hashAdminPassword(password),
        name,
        email: email || '',
        role: role || 'admin',
        permissions: permissions || ['dashboard', 'users', 'orders'],
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    saveAdmin(newAdmin);
    
    return { 
        success: true, 
        message: '관리자 계정이 생성되었습니다.',
        admin: sanitizeAdmin(newAdmin)
    };
}

// 초기화
initializeAdmins();

// 세션 만료 체크 (1분마다)
if (typeof window !== 'undefined') {
    setInterval(checkSessionExpiry, 60 * 1000);
}

console.log('✅ admin-auth.js 로드 완료');
console.log('🔐 관리자 계정: admin / admin1234');
