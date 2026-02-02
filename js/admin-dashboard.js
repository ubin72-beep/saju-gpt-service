/**
 * AI 사주 천년지기 - 관리자 대시보드 스크립트 (API 연동)
 * 
 * 이 스크립트는 관리자 대시보드의 통계 데이터를 로드하고 표시합니다.
 * auth-api.js의 헬퍼 함수를 사용합니다.
 */

// DOMContentLoaded 이벤트
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Admin Dashboard 초기화 시작');
    
    checkAdminAuth();
    loadDashboardStats();
    setupNavigation();
    setupLogout();
    
    console.log('✅ Admin Dashboard 로드 완료');
});

/**
 * 관리자 인증 확인
 */
function checkAdminAuth() {
    // isLoggedIn과 isAdmin 함수는 auth-api.js에서 제공
    if (!isLoggedIn()) {
        alert('로그인이 필요합니다');
        window.location.href = 'login.html';
        return;
    }
    
    if (!isAdmin()) {
        alert('관리자 권한이 필요합니다');
        window.location.href = 'index.html';
        return;
    }
    
    // 관리자 정보 표시
    const currentUser = getCurrentUser();
    if (currentUser) {
        const adminNameElements = document.querySelectorAll('.admin-name');
        adminNameElements.forEach(el => {
            el.textContent = currentUser.name || '관리자';
        });
    }
}

/**
 * 대시보드 통계 로드
 */
function loadDashboardStats() {
    console.log('📊 대시보드 통계 로딩 중...');
    
    // admin.js의 loadAdminStats()가 처리하므로 여기서는 로그만 남김
    console.log('ℹ️ 통계 로드는 admin.js의 loadAdminStats()에서 처리됩니다');
    
    /* 백엔드 배포 시 활성화
    apiCall('/admin/stats', 'GET')
        .then(response => {
            if (response.success) {
                updateStatCards(response.data);
                updateRecentUsers(response.data.recentUsers);
            } else {
                console.error('통계 로드 실패:', response.message);
                alert('통계 데이터를 불러오는데 실패했습니다');
            }
        })
        .catch(error => {
            console.error('통계 로드 에러:', error);
        });
    */
}

/**
 * 통계 카드 업데이트
 */
function updateStatCards(data) {
    // 총 회원 수
    const totalUsersEl = document.querySelector('[data-stat="totalUsers"]');
    if (totalUsersEl && data.totalUsers !== undefined) {
        totalUsersEl.textContent = formatNumber(data.totalUsers);
    }
    
    // 오늘 방문자
    const todayUsersEl = document.querySelector('[data-stat="todayUsers"]');
    if (todayUsersEl && data.todayUsers !== undefined) {
        todayUsersEl.textContent = formatNumber(data.todayUsers);
    }
    
    // 이번 달 매출
    const monthlyRevenueEl = document.querySelector('[data-stat="monthlyRevenue"]');
    if (monthlyRevenueEl && data.monthlyRevenue !== undefined) {
        monthlyRevenueEl.textContent = formatCurrency(data.monthlyRevenue);
    }
    
    // 프리미엄 회원
    const premiumMembersEl = document.querySelector('[data-stat="premiumMembers"]');
    if (premiumMembersEl && data.premiumMembers !== undefined) {
        premiumMembersEl.textContent = formatNumber(data.premiumMembers);
    }
}

/**
 * 최근 가입 회원 업데이트
 */
function updateRecentUsers(users) {
    const container = document.getElementById('recentUsersContainer');
    if (!container || !users || users.length === 0) return;
    
    container.innerHTML = users.map(user => `
        <div class="recent-user-item">
            <div class="user-avatar">${user.name.charAt(0)}</div>
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <div class="user-date">${formatDate(user.createdAt)}</div>
        </div>
    `).join('');
}

/**
 * 최근 주문 업데이트
 */
function updateRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody || !orders || orders.length === 0) return;
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.orderNumber}</td>
            <td>${order.userName}</td>
            <td>${order.serviceName}</td>
            <td>${formatCurrency(order.amount)}</td>
            <td><span class="badge badge-${order.status}">${getStatusLabel(order.status)}</span></td>
            <td>${formatDate(order.createdAt)}</td>
        </tr>
    `).join('');
}

/**
 * 내비게이션 설정
 * 주석 처리: 별도 페이지 방식으로 변경됨 (admin.html, admin-users.html 등)
 */
function setupNavigation() {
    // SPA 방식 제거 - 각 페이지는 독립적인 HTML 파일
    // 링크 클릭을 막지 않음 - 브라우저 기본 동작 허용
    
    // 사이드바 토글만 유지
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
}

/**
 * 로그아웃 설정
 */
function setupLogout() {
    const logoutBtn = document.querySelector('a[href="#"][data-action="logout"]');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

/**
 * 로그아웃 처리
 */
function handleLogout() {
    if (confirm('로그아웃하시겠습니까?')) {
        // auth-api.js의 logout 함수 사용 또는 localStorage 직접 삭제
        if (typeof logout === 'function') {
            logout();
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
        window.location.href = 'login.html';
    }
}

/**
 * 유틸리티 함수들
 */

function formatNumber(num) {
    if (num === undefined || num === null) return '0';
    return new Intl.NumberFormat('ko-KR').format(num);
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null) return '₩0';
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getStatusLabel(status) {
    const labels = {
        'pending': '대기중',
        'processing': '처리중',
        'completed': '완료',
        'cancelled': '취소'
    };
    return labels[status] || status;
}

/**
 * 현재 사용자 정보 가져오기
 */
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    if (!userStr) return null;
    
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('사용자 정보 파싱 실패:', e);
        return null;
    }
}

/**
 * 로그인 여부 확인
 */
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

/**
 * 관리자 권한 확인
 */
function isAdmin() {
    const user = getCurrentUser();
    return user && (user.role === 'admin' || user.role === 'super_admin');
}
