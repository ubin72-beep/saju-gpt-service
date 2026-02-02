/**
 * AI 사주 천년지기 - 관리자 대시보드 스크립트 (API 연동)
 */

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async function() {
    // 관리자 인증 확인
    checkAdminAuth();
    
    // 대시보드 데이터 로드
    await loadDashboardStats();
    
    // 내비게이션 이벤트 설정
    setupNavigation();
    
    // 로그아웃 버튼 이벤트
    setupLogout();
});

/**
 * 관리자 인증 확인
 */
function checkAdminAuth() {
    // auth-api.js의 함수 사용
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
    const user = getCurrentUser();
    const userInfoElement = document.querySelector('.user-info h4');
    if (userInfoElement) {
        userInfoElement.textContent = user.name || '관리자';
    }
}

/**
 * 대시보드 통계 로드
 */
async function loadDashboardStats() {
    try {
        // API 호출 (auth-api.js의 apiCall 함수 사용)
        const data = await apiCall('/admin/stats', {
            method: 'GET'
        });
        
        if (!data) return;
        
        // 통계 데이터 업데이트
        updateStatCards(data.stats);
        updateRecentUsers(data.recentUsers);
        
    } catch (error) {
        console.error('통계 로드 오류:', error);
        alert('통계 데이터를 불러오는데 실패했습니다');
    }
}

/**
 * 통계 카드 업데이트
 */
function updateStatCards(stats) {
    // 총 사용자 수
    const totalUsersCard = document.querySelector('.stat-card .stat-number');
    if (totalUsersCard) {
        totalUsersCard.textContent = formatNumber(stats.totalUsers);
    }
    
    // 오늘 가입자
    const todayUsersCard = document.querySelectorAll('.stat-card .stat-number')[1];
    if (todayUsersCard) {
        todayUsersCard.textContent = '+' + formatNumber(stats.todayUsers);
    }
    
    // 이번 달 매출
    const monthlyRevenueCard = document.querySelectorAll('.stat-card .stat-number')[2];
    if (monthlyRevenueCard) {
        monthlyRevenueCard.textContent = '₩' + formatNumber(stats.monthlyRevenue);
    }
    
    // 프리미엄 사용자
    const premiumUsersCard = document.querySelectorAll('.stat-card .stat-number')[3];
    if (premiumUsersCard) {
        premiumUsersCard.textContent = formatNumber(stats.premiumUsers);
    }
}

/**
 * 최근 가입자 업데이트
 */
function updateRecentUsers(users) {
    const usersTable = document.getElementById('usersTable');
    if (!usersTable) return;
    
    usersTable.innerHTML = users.map((user, index) => `
        <tr>
            <td><input type="checkbox"></td>
            <td>${index + 1}</td>
            <td>${escapeHtml(user.name)}</td>
            <td>${escapeHtml(user.email)}</td>
            <td>
                <span class="badge ${user.isPremium ? 'badge-success' : 'badge-secondary'}">
                    ${user.isPremium ? '프리미엄' : '무료'}
                </span>
            </td>
            <td>${formatDate(user.createdAt)}</td>
            <td>₩0</td>
            <td>
                <span class="badge badge-success">활성</span>
            </td>
            <td>
                <button class="btn-icon" title="상세보기">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon" title="수정">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon" title="삭제">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * 내비게이션 설정
 */
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.admin-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 모든 내비게이션 아이템에서 active 제거
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // 클릭한 아이템에 active 추가
            this.classList.add('active');
            
            // 모든 섹션 숨기기
            sections.forEach(section => section.style.display = 'none');
            
            // 해당 섹션 표시
            const sectionId = this.getAttribute('data-section') + 'Section';
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });
    
    // 사이드바 토글
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
            if (confirm('로그아웃 하시겠습니까?')) {
                logout(); // auth-api.js의 logout 함수 사용
            }
        });
    }
}

/**
 * 유틸리티 함수
 */

// 숫자 포맷팅
function formatNumber(num) {
    return new Intl.NumberFormat('ko-KR').format(num);
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// HTML 이스케이프
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 차트 초기화 (Chart.js 사용)
function initCharts() {
    // 매출 차트
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                datasets: [{
                    label: '월별 매출',
                    data: [500000, 750000, 1200000, 1800000, 2500000, 3000000],
                    borderColor: '#c41e3a',
                    backgroundColor: 'rgba(196, 30, 58, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}
