/**
 * 🔒 AI 사주 천년지기 - 클라이언트 측 데이터 보안 가이드
 * 
 * 목적: 사용자 개인정보 보호 및 데이터 보안 강화
 * 작성일: 2026-01-09
 */

// ============================================
// 1. 데이터 수집 최소화
// ============================================

/**
 * ✅ 좋은 예: 필수 정보만 수집
 */
function collectUserDataGood(formData) {
    return {
        birthDate: formData.birthDate,  // YYYY-MM-DD
        birthTime: formData.birthTime,  // HH:MM
        gender: formData.gender,        // M/F
        nickname: formData.nickname || '익명'  // 실명 대신 닉네임
    };
}

/**
 * ❌ 나쁜 예: 불필요한 정보 수집 (절대 금지!)
 */
function collectUserDataBad(formData) {
    return {
        name: formData.name,            // ❌ 실명 수집 최소화
        ssn: formData.ssn,              // ❌ 주민등록번호 절대 수집 금지!
        phone: formData.phone,          // ❌ 불필요한 연락처
        email: formData.email,          // ❌ 불필요한 이메일
        address: formData.address       // ❌ 불필요한 주소
    };
}


// ============================================
// 2. 데이터 저장 방식
// ============================================

/**
 * ✅ 좋은 예: sessionStorage 사용 (브라우저 닫으면 자동 삭제)
 */
function saveUserDataGood(userData) {
    // 세션 스토리지에 저장 (브라우저 닫으면 자동 삭제)
    sessionStorage.setItem('sajuData', JSON.stringify(userData));
    
    // 30분 후 자동 삭제
    setTimeout(() => {
        sessionStorage.removeItem('sajuData');
        console.log('✅ 사용자 데이터가 자동으로 삭제되었습니다.');
    }, 30 * 60 * 1000);  // 30분
}

/**
 * ❌ 나쁜 예: localStorage 사용 (영구 저장됨)
 */
function saveUserDataBad(userData) {
    // localStorage는 브라우저를 닫아도 계속 남아있음 (보안 위험!)
    localStorage.setItem('sajuData', JSON.stringify(userData));  // ❌
}


// ============================================
// 3. 데이터 암호화 (선택 사항)
// ============================================

/**
 * Base64 인코딩 (간단한 암호화)
 */
function encodeUserData(userData) {
    const jsonString = JSON.stringify(userData);
    return btoa(unescape(encodeURIComponent(jsonString)));
}

/**
 * Base64 디코딩
 */
function decodeUserData(encodedData) {
    const jsonString = decodeURIComponent(escape(atob(encodedData)));
    return JSON.parse(jsonString);
}

/**
 * ✅ 사용 예시
 */
function secureStorageExample() {
    const userData = {
        birthDate: '1990-01-01',
        birthTime: '14:30',
        gender: 'M'
    };
    
    // 암호화하여 저장
    const encoded = encodeUserData(userData);
    sessionStorage.setItem('sajuData', encoded);
    
    // 복호화하여 불러오기
    const storedData = sessionStorage.getItem('sajuData');
    if (storedData) {
        const decoded = decodeUserData(storedData);
        console.log('📊 사용자 데이터:', decoded);
    }
}


// ============================================
// 4. 데이터 자동 삭제
// ============================================

/**
 * 페이지 이탈 시 데이터 자동 삭제
 */
window.addEventListener('beforeunload', function() {
    // 페이지를 떠날 때 모든 세션 데이터 삭제
    sessionStorage.clear();
    console.log('✅ 사용자 데이터가 삭제되었습니다.');
});

/**
 * 일정 시간 후 자동 삭제
 */
function autoDeleteData(minutes = 30) {
    setTimeout(() => {
        sessionStorage.clear();
        alert('⏰ 개인정보 보호를 위해 입력하신 정보가 자동으로 삭제되었습니다.');
    }, minutes * 60 * 1000);
}

// 30분 후 자동 삭제 시작
autoDeleteData(30);


// ============================================
// 5. 폼 입력 검증 (필수!)
// ============================================

/**
 * 생년월일 검증
 */
function validateBirthDate(birthDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(birthDate)) {
        return { valid: false, error: '올바른 날짜 형식이 아닙니다 (YYYY-MM-DD)' };
    }
    
    const date = new Date(birthDate);
    const now = new Date();
    
    if (date > now) {
        return { valid: false, error: '미래 날짜는 입력할 수 없습니다' };
    }
    
    if (date < new Date('1900-01-01')) {
        return { valid: false, error: '1900년 이후 날짜만 입력 가능합니다' };
    }
    
    return { valid: true };
}

/**
 * 출생시간 검증
 */
function validateBirthTime(birthTime) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!regex.test(birthTime)) {
        return { valid: false, error: '올바른 시간 형식이 아닙니다 (HH:MM)' };
    }
    return { valid: true };
}

/**
 * 성별 검증
 */
function validateGender(gender) {
    if (!['M', 'F'].includes(gender)) {
        return { valid: false, error: '성별을 선택해주세요' };
    }
    return { valid: true };
}

/**
 * 전체 폼 검증
 */
function validateForm(formData) {
    const errors = [];
    
    const birthDateCheck = validateBirthDate(formData.birthDate);
    if (!birthDateCheck.valid) errors.push(birthDateCheck.error);
    
    const birthTimeCheck = validateBirthTime(formData.birthTime);
    if (!birthTimeCheck.valid) errors.push(birthTimeCheck.error);
    
    const genderCheck = validateGender(formData.gender);
    if (!genderCheck.valid) errors.push(genderCheck.error);
    
    return {
        valid: errors.length === 0,
        errors: errors
    };
}


// ============================================
// 6. XSS 방지 (크로스 사이트 스크립팅)
// ============================================

/**
 * HTML 특수문자 이스케이프
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    return text.replace(/[&<>"'\/]/g, char => map[char]);
}

/**
 * ✅ 사용 예시: 사용자 입력을 화면에 표시할 때
 */
function displayUserInput(nickname) {
    const safe = escapeHtml(nickname);
    document.getElementById('result').innerHTML = `안녕하세요, ${safe}님!`;
}


// ============================================
// 7. 개인정보 수집 동의 (필수!)
// ============================================

/**
 * 개인정보 수집 동의 확인
 */
function checkPrivacyConsent() {
    const consentCheckbox = document.getElementById('privacyConsent');
    
    if (!consentCheckbox.checked) {
        alert('⚠️ 개인정보 수집 및 이용에 동의해주세요.');
        return false;
    }
    
    return true;
}

/**
 * 폼 제출 시 동의 확인
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // 1. 개인정보 동의 확인
    if (!checkPrivacyConsent()) {
        return false;
    }
    
    // 2. 폼 데이터 수집
    const formData = {
        birthDate: document.getElementById('birthDate').value,
        birthTime: document.getElementById('birthTime').value,
        gender: document.getElementById('gender').value,
        nickname: document.getElementById('nickname').value
    };
    
    // 3. 유효성 검증
    const validation = validateForm(formData);
    if (!validation.valid) {
        alert('❌ 입력 오류:\n' + validation.errors.join('\n'));
        return false;
    }
    
    // 4. 데이터 수집 최소화
    const userData = collectUserDataGood(formData);
    
    // 5. 안전하게 저장
    saveUserDataGood(userData);
    
    // 6. 사주 계산 진행
    calculateSaju(userData);
    
    return true;
}


// ============================================
// 8. HTTPS 확인 (필수!)
// ============================================

/**
 * HTTPS 연결 확인
 */
function checkSecureConnection() {
    if (location.protocol !== 'https:') {
        console.warn('⚠️ 경고: HTTPS 연결이 아닙니다. 개인정보 보호를 위해 HTTPS를 사용하세요!');
        
        // 프로덕션 환경에서는 HTTPS로 리다이렉트
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
            location.href = 'https://' + location.host + location.pathname;
        }
    }
}

// 페이지 로드 시 HTTPS 확인
checkSecureConnection();


// ============================================
// 9. 콘솔 로그 제거 (프로덕션)
// ============================================

/**
 * 프로덕션 환경에서 콘솔 로그 비활성화
 */
if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.debug = function() {};
}


// ============================================
// 10. 사용 예시: 전체 통합
// ============================================

/**
 * 📋 사주 입력 폼 초기화
 */
function initSajuForm() {
    const form = document.getElementById('sajuForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // 30분 후 자동 데이터 삭제
        autoDeleteData(30);
        
        // HTTPS 확인
        checkSecureConnection();
    }
}

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', initSajuForm);


// ============================================
// 11. 보안 체크리스트
// ============================================

/**
 * 배포 전 보안 체크리스트
 */
const securityChecklist = {
    dataCollection: {
        minimized: true,          // ✅ 최소한의 정보만 수집
        noSSN: true,              // ✅ 주민등록번호 수집 안 함
        noPhone: true,            // ✅ 전화번호 수집 안 함
        noEmail: true             // ✅ 이메일 수집 안 함
    },
    dataStorage: {
        useSessionStorage: true,  // ✅ sessionStorage 사용
        noLocalStorage: true,     // ✅ localStorage 사용 안 함
        autoDelete: true,         // ✅ 자동 삭제 구현
        encryption: false         // ⚠️ 선택 사항 (Base64 인코딩)
    },
    validation: {
        inputValidation: true,    // ✅ 입력 검증 구현
        xssProtection: true,      // ✅ XSS 방지 구현
        privacyConsent: true      // ✅ 개인정보 동의 구현
    },
    connection: {
        httpsOnly: true,          // ✅ HTTPS 필수
        sslCertificate: true      // ✅ SSL 인증서 설치
    },
    production: {
        noConsoleLogs: true,      // ✅ 콘솔 로그 제거
        minified: false           // ⚠️ 선택 사항 (코드 압축)
    }
};

console.log('🔒 보안 체크리스트:', securityChecklist);


// ============================================
// 📝 사용 가이드
// ============================================

/**
 * HTML 예시:
 * 
 * <form id="sajuForm">
 *     <input type="date" id="birthDate" required>
 *     <input type="time" id="birthTime" required>
 *     <select id="gender" required>
 *         <option value="M">남성</option>
 *         <option value="F">여성</option>
 *     </select>
 *     <input type="text" id="nickname" placeholder="닉네임 (선택)">
 *     
 *     <label>
 *         <input type="checkbox" id="privacyConsent" required>
 *         개인정보 수집 및 이용에 동의합니다 (필수)
 *     </label>
 *     
 *     <button type="submit">사주 보기</button>
 * </form>
 * 
 * <script src="security-guide.js"></script>
 */
