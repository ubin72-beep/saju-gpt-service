/**
 * 인증 시스템 (회원가입/로그인/로그아웃)
 * LocalStorage 기반 클라이언트 사이드 구현
 */

// 사용자 데이터 구조
const USER_STORAGE_KEY = 'saju2026_users';
const CURRENT_USER_KEY = 'saju2026_current_user';

// 초기 사용자 데이터 (데모용)
function initializeUsers() {
    const users = getUsers();
    if (users.length === 0) {
        // 데모 계정 추가
        const demoUser = {
            id: generateUserId(),
            email: 'demo@saju2026.com',
            password: hashPassword('demo1234'),
            name: '홍길동',
            phone: '010-1234-5678',
            birthDate: '1990-05-15',
            birthTime: '자시(子時, 23:30-01:29)',
            gender: 'male',
            calendarType: 'lunar',
            membershipType: 'free', // free, premium
            premiumExpiry: null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            sajuData: null,
            purchaseHistory: [],
            consultationHistory: []
        };
        
        saveUser(demoUser);
        console.log('✅ 데모 계정 생성됨: demo@saju2026.com / demo1234');
    }
}

// 사용자 목록 가져오기
function getUsers() {
    const usersJson = localStorage.getItem(USER_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

// 사용자 저장
function saveUser(user) {
    const users = getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex !== -1) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(users));
}

// 사용자 ID 생성
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 비밀번호 해싱 (간단한 해싱 - 실제로는 bcrypt 등 사용)
function hashPassword(password) {
    // 실제 운영에서는 서버에서 bcrypt 등으로 해싱
    return btoa(password + 'saju2026_salt');
}

// 비밀번호 검증
function verifyPassword(inputPassword, hashedPassword) {
    return hashPassword(inputPassword) === hashedPassword;
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사
function isValidPassword(password) {
    // 최소 8자 (간단한 체크)
    return password.length >= 8;
}

// 전화번호 유효성 검사
function isValidPhone(phone) {
    const phoneRegex = /^01[0-9]-?[0-9]{4}-?[0-9]{4}$/;
    return phoneRegex.test(phone);
}

// 회원가입
function register(userData) {
    const { email, password, name, phone, birthDate, birthTime, gender, calendarType } = userData;
    
    // 유효성 검사
    if (!email || !password || !name) {
        return { success: false, message: '필수 정보를 모두 입력해주세요.' };
    }
    
    if (!isValidEmail(email)) {
        return { success: false, message: '올바른 이메일 형식이 아닙니다.' };
    }
    
    if (!isValidPassword(password)) {
        return { success: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
    }
    
    // 전화번호가 입력된 경우에만 유효성 검사
    if (phone && !isValidPhone(phone)) {
        return { success: false, message: '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)' };
    }
    
    // 이메일 중복 체크
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        return { success: false, message: '이미 가입된 이메일입니다.' };
    }
    
    // 새 사용자 생성
    const newUser = {
        id: generateUserId(),
        email,
        password: hashPassword(password),
        name,
        phone: phone || null,
        birthDate: birthDate || null,
        birthTime: birthTime || null,
        gender: gender || null,
        calendarType: calendarType || 'solar',
        membershipType: 'free',
        premiumExpiry: null,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        sajuData: null,
        purchaseHistory: [],
        consultationHistory: []
    };
    
    saveUser(newUser);
    
    return { 
        success: true, 
        message: '회원가입이 완료되었습니다!',
        user: sanitizeUser(newUser)
    };
}

// 로그인
function login(email, password) {
    if (!email || !password) {
        return { success: false, message: '이메일과 비밀번호를 입력해주세요.' };
    }
    
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return { success: false, message: '가입되지 않은 이메일입니다.' };
    }
    
    if (!verifyPassword(password, user.password)) {
        return { success: false, message: '비밀번호가 올바르지 않습니다.' };
    }
    
    // 마지막 로그인 시간 업데이트
    user.lastLogin = new Date().toISOString();
    saveUser(user);
    
    // 현재 사용자 설정
    setCurrentUser(user);
    
    return { 
        success: true, 
        message: '로그인 되었습니다!',
        user: sanitizeUser(user)
    };
}

// 로그아웃
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { success: true, message: '로그아웃 되었습니다.' };
}

// 현재 로그인 사용자 설정
function setCurrentUser(user) {
    const sanitized = sanitizeUser(user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sanitized));
}

// 현재 로그인 사용자 가져오기
function getCurrentUser() {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
}

// 로그인 여부 확인
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// 프리미엄 회원 여부 확인
function isPremiumUser() {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (user.membershipType === 'premium') {
        if (!user.premiumExpiry) return true;
        return new Date(user.premiumExpiry) > new Date();
    }
    
    return false;
}

// 사용자 정보 업데이트
function updateUser(userId, updates) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return { success: false, message: '사용자를 찾을 수 없습니다.' };
    }
    
    // 비밀번호 변경 시 해싱
    if (updates.password) {
        updates.password = hashPassword(updates.password);
    }
    
    // 이메일 변경 시 중복 체크
    if (updates.email && updates.email !== user.email) {
        if (users.find(u => u.email === updates.email && u.id !== userId)) {
            return { success: false, message: '이미 사용중인 이메일입니다.' };
        }
    }
    
    // 정보 업데이트
    Object.assign(user, updates);
    saveUser(user);
    
    // 현재 사용자인 경우 업데이트
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
        setCurrentUser(user);
    }
    
    return { 
        success: true, 
        message: '정보가 업데이트되었습니다.',
        user: sanitizeUser(user)
    };
}

// 사용자 정보 정제 (비밀번호 제거)
function sanitizeUser(user) {
    const { password, ...sanitized } = user;
    return sanitized;
}

// 사주 데이터 저장
function saveSajuData(userId, sajuData) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        user.sajuData = sajuData;
        user.sajuCalculatedAt = new Date().toISOString();
        saveUser(user);
        
        // 현재 사용자 업데이트
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.id === userId) {
            setCurrentUser(user);
        }
        
        return { success: true };
    }
    
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
}

// 구매 내역 추가
function addPurchaseHistory(userId, purchase) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        if (!user.purchaseHistory) {
            user.purchaseHistory = [];
        }
        
        const purchaseRecord = {
            id: 'purchase_' + Date.now(),
            ...purchase,
            date: new Date().toISOString()
        };
        
        user.purchaseHistory.unshift(purchaseRecord);
        saveUser(user);
        
        // 프리미엄 구매 시 회원 등급 업데이트
        if (purchase.type === 'premium_monthly' || purchase.type === 'premium_yearly') {
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + (purchase.type === 'premium_yearly' ? 12 : 1));
            
            updateUser(userId, {
                membershipType: 'premium',
                premiumExpiry: expiryDate.toISOString()
            });
        }
        
        return { success: true, purchase: purchaseRecord };
    }
    
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
}

// 상담 내역 추가
function addConsultationHistory(userId, consultation) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (user) {
        if (!user.consultationHistory) {
            user.consultationHistory = [];
        }
        
        const consultationRecord = {
            id: 'consult_' + Date.now(),
            ...consultation,
            date: new Date().toISOString()
        };
        
        user.consultationHistory.unshift(consultationRecord);
        saveUser(user);
        
        return { success: true, consultation: consultationRecord };
    }
    
    return { success: false, message: '사용자를 찾을 수 없습니다.' };
}

// 오늘의 AI 상담 횟수 확인
function getTodayConsultationCount(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user || !user.consultationHistory) return 0;
    
    const today = new Date().toDateString();
    return user.consultationHistory.filter(c => {
        return new Date(c.date).toDateString() === today;
    }).length;
}

// 비밀번호 찾기
function resetPassword(email) {
    const users = getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return { success: false, message: '가입되지 않은 이메일입니다.' };
    }
    
    // 임시 비밀번호 생성
    const tempPassword = 'temp' + Math.random().toString(36).substr(2, 8);
    
    // 비밀번호 업데이트
    user.password = hashPassword(tempPassword);
    saveUser(user);
    
    console.log(`임시 비밀번호: ${tempPassword}`);
    
    return { 
        success: true, 
        message: '임시 비밀번호가 이메일로 전송되었습니다.',
        tempPassword // 데모용
    };
}

// 초기화
initializeUsers();

console.log('✅ auth.js 로드 완료');
console.log('📝 데모 계정: demo@saju2026.com / demo1234');
