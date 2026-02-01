/**
 * 관리자 페이지 JavaScript
 */

// 현재 페이지
let currentPage = 'dashboard';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCharts();
    initTables();
    initModals();
    initTabs();
    loadDashboardData();
});

// 네비게이션 초기화
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('pageTitle');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            const pageName = item.dataset.page;
            
            // 활성 상태 변경
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // 페이지 전환
            pages.forEach(page => page.classList.remove('active'));
            document.getElementById(pageName).classList.add('active');
            
            // 제목 변경
            const titles = {
                'dashboard': '대시보드',
                'users': '회원 관리',
                'orders': '주문/결제 관리',
                'consultations': 'AI 상담 관리',
                'content': '콘텐츠 관리',
                'statistics': '통계 및 리포트',
                'settings': '시스템 설정'
            };
            pageTitle.textContent = titles[pageName];
            
            currentPage = pageName;
            
            // 페이지별 데이터 로드
            loadPageData(pageName);
        });
    });
    
    // 모바일 메뉴 토글
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    mobileMenuToggle?.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
    
    sidebarToggle?.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// 차트 초기화
function initCharts() {
    // 방문자 차트
    const visitorsCtx = document.getElementById('visitorsChart');
    if (visitorsCtx) {
        new Chart(visitorsCtx, {
            type: 'line',
            data: {
                labels: ['월', '화', '수', '목', '금', '토', '일'],
                datasets: [{
                    label: '방문자',
                    data: [1200, 1900, 1500, 2100, 1800, 2400, 1847],
                    borderColor: '#c41e3a',
                    backgroundColor: 'rgba(196, 30, 58, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // 매출 차트
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'doughnut',
            data: {
                labels: ['상세 사주팔자', 'AI 상담', '택일', '프리미엄 구독', '기타'],
                datasets: [{
                    data: [2500000, 1800000, 1500000, 2000000, 742000],
                    backgroundColor: [
                        '#c41e3a',
                        '#667eea',
                        '#48c6ef',
                        '#fa709a',
                        '#fed6e3'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // 월별 통계 차트
    const monthlyStatsCtx = document.getElementById('monthlyStatsChart');
    if (monthlyStatsCtx) {
        new Chart(monthlyStatsCtx, {
            type: 'bar',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                datasets: [
                    {
                        label: '신규 가입자',
                        data: [450, 520, 680, 590, 720, 850],
                        backgroundColor: '#667eea'
                    },
                    {
                        label: '매출 (만원)',
                        data: [580, 620, 750, 680, 820, 854],
                        backgroundColor: '#c41e3a'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // 서비스 이용률 차트
    const serviceUsageCtx = document.getElementById('serviceUsageChart');
    if (serviceUsageCtx) {
        new Chart(serviceUsageCtx, {
            type: 'pie',
            data: {
                labels: ['사주팔자', 'AI 상담', '택일', '기타'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: ['#c41e3a', '#667eea', '#48c6ef', '#fed6e3']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true
            }
        });
    }
    
    // 전환율 차트
    const conversionCtx = document.getElementById('conversionChart');
    if (conversionCtx) {
        new Chart(conversionCtx, {
            type: 'line',
            data: {
                labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
                datasets: [{
                    label: '전환율 (%)',
                    data: [12.5, 14.2, 15.8, 16.5, 17.2, 18.9],
                    borderColor: '#4caf50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25
                    }
                }
            }
        });
    }
}

// 테이블 초기화
function initTables() {
    loadUsersTable();
    loadOrdersTable();
    loadConsultationsTable();
    loadNoticesTable();
    loadPromotionsTable();
}

// 회원 테이블 로드
function loadUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    // 샘플 데이터
    const users = [
        { id: 1, name: '김철수', email: 'kim@example.com', phone: '010-1234-5678', type: 'premium', joinDate: '2024-01-15', lastLogin: '2024-12-09', status: 'active' },
        { id: 2, name: '이영희', email: 'lee@example.com', phone: '010-2345-6789', type: 'free', joinDate: '2024-02-20', lastLogin: '2024-12-10', status: 'active' },
        { id: 3, name: '박민수', email: 'park@example.com', phone: '010-3456-7890', type: 'premium', joinDate: '2024-03-10', lastLogin: '2024-12-08', status: 'active' },
        { id: 4, name: '최지훈', email: 'choi@example.com', phone: '010-4567-8901', type: 'free', joinDate: '2024-04-05', lastLogin: '2024-12-07', status: 'suspended' },
        { id: 5, name: '정수진', email: 'jung@example.com', phone: '010-5678-9012', type: 'premium', joinDate: '2024-05-12', lastLogin: '2024-12-10', status: 'active' }
    ];
    
    tbody.innerHTML = users.map(user => `
        <tr>
            <td><input type="checkbox" value="${user.id}"></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>
                ${user.type === 'premium' 
                    ? '<span class="badge badge-success"><i class="fas fa-crown"></i> 프리미엄</span>' 
                    : '<span class="badge badge-info">무료</span>'}
            </td>
            <td>${user.joinDate}</td>
            <td>${user.lastLogin}</td>
            <td>
                ${user.status === 'active' 
                    ? '<span class="badge badge-success">정상</span>' 
                    : '<span class="badge badge-danger">정지</span>'}
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewUser(${user.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 주문 테이블 로드
function loadOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    
    const orders = [
        { id: 'ORD20241210001', user: '김철수', product: '상세 사주팔자 해석', amount: 4900, method: '카드', date: '2024-12-10 14:23', status: 'completed' },
        { id: 'ORD20241210002', user: '이영희', product: '월간 프리미엄', amount: 9900, method: '계좌이체', date: '2024-12-10 12:15', status: 'completed' },
        { id: 'ORD20241209001', user: '박민수', product: '이사 택일', amount: 5900, method: '카드', date: '2024-12-09 18:45', status: 'pending' },
        { id: 'ORD20241209002', user: '최지훈', product: '연애운', amount: 3900, method: '카드', date: '2024-12-09 10:20', status: 'refunded' },
        { id: 'ORD20241208001', user: '정수진', product: '연간 프리미엄', amount: 99000, method: '카드', date: '2024-12-08 16:30', status: 'completed' }
    ];
    
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.user}</td>
            <td>${order.product}</td>
            <td>₩${order.amount.toLocaleString()}</td>
            <td>${order.method}</td>
            <td>${order.date}</td>
            <td>
                ${order.status === 'completed' ? '<span class="badge badge-success">완료</span>' :
                  order.status === 'pending' ? '<span class="badge badge-warning">대기</span>' :
                  order.status === 'refunded' ? '<span class="badge badge-danger">환불</span>' : ''}
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 상담 테이블 로드
function loadConsultationsTable() {
    const tbody = document.getElementById('consultationsTableBody');
    if (!tbody) return;
    
    const consultations = [
        { user: '김철수', topic: '직업', questions: 8, startTime: '2024-12-10 14:30', duration: '25분', rating: 5 },
        { user: '이영희', topic: '연애', questions: 5, startTime: '2024-12-10 13:15', duration: '18분', rating: 4 },
        { user: '박민수', topic: '재물', questions: 12, startTime: '2024-12-10 11:45', duration: '32분', rating: 5 },
        { user: '최지훈', topic: '건강', questions: 6, startTime: '2024-12-09 16:20', duration: '22분', rating: 4 },
        { user: '정수진', topic: '운세', questions: 10, startTime: '2024-12-09 10:30', duration: '28분', rating: 5 }
    ];
    
    tbody.innerHTML = consultations.map((con, idx) => `
        <tr>
            <td>${con.user}</td>
            <td><span class="badge badge-info">${con.topic}</span></td>
            <td>${con.questions}개</td>
            <td>${con.startTime}</td>
            <td>${con.duration}</td>
            <td>${'⭐'.repeat(con.rating)}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewConsultation(${idx})">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 공지사항 테이블 로드
function loadNoticesTable() {
    const tbody = document.getElementById('noticesTableBody');
    if (!tbody) return;
    
    const notices = [
        { id: 1, title: '2026 병오년 운세 서비스 오픈', author: '관리자', date: '2024-12-01', views: 1234 },
        { id: 2, title: '연말연시 할인 이벤트 안내', author: '관리자', date: '2024-11-25', views: 856 },
        { id: 3, title: 'AI 상담 기능 업데이트', author: '관리자', date: '2024-11-20', views: 523 }
    ];
    
    tbody.innerHTML = notices.map(notice => `
        <tr>
            <td>${notice.id}</td>
            <td>${notice.title}</td>
            <td>${notice.author}</td>
            <td>${notice.date}</td>
            <td>${notice.views}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editNotice(${notice.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteNotice(${notice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 프로모션 테이블 로드
function loadPromotionsTable() {
    const tbody = document.getElementById('promotionsTableBody');
    if (!tbody) return;
    
    const promotions = [
        { code: 'NEWYEAR2026', discount: '30%', startDate: '2024-12-25', endDate: '2025-01-07', used: '45/100', status: 'active' },
        { code: 'PREMIUM20', discount: '20%', startDate: '2024-12-01', endDate: '2024-12-31', used: '78/200', status: 'active' },
        { code: 'FIRST50', discount: '50%', startDate: '2024-11-01', endDate: '2024-11-30', used: '150/150', status: 'expired' }
    ];
    
    tbody.innerHTML = promotions.map(promo => `
        <tr>
            <td><code>${promo.code}</code></td>
            <td><strong>${promo.discount}</strong></td>
            <td>${promo.startDate}</td>
            <td>${promo.endDate}</td>
            <td>${promo.used}</td>
            <td>
                ${promo.status === 'active' 
                    ? '<span class="badge badge-success">활성</span>' 
                    : '<span class="badge badge-danger">만료</span>'}
            </td>
            <td>
                <div class="action-btns">
                    <button class="action-btn edit" onclick="editPromotion('${promo.code}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deletePromotion('${promo.code}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// 모달 초기화
function initModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// 탭 초기화
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabName) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 페이지별 데이터 로드
function loadPageData(pageName) {
    switch(pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'users':
            loadUsersTable();
            break;
        case 'orders':
            loadOrdersTable();
            break;
        case 'consultations':
            loadConsultationsTable();
            break;
        case 'content':
            loadNoticesTable();
            loadPromotionsTable();
            break;
    }
}

// 대시보드 데이터 로드
function loadDashboardData() {
    // 실제로는 API에서 데이터를 가져옴
    console.log('대시보드 데이터 로드됨');
}

// 회원 관련 함수
function viewUser(id) {
    alert(`회원 상세 정보 보기: ${id}`);
}

function editUser(id) {
    alert(`회원 정보 수정: ${id}`);
}

function deleteUser(id) {
    if (confirm('정말 이 회원을 삭제하시겠습니까?')) {
        alert(`회원 삭제됨: ${id}`);
    }
}

// 주문 관련 함수
function viewOrder(id) {
    alert(`주문 상세 정보: ${id}`);
}

// 상담 관련 함수
function viewConsultation(id) {
    alert(`상담 내역 보기: ${id}`);
}

// 공지사항 관련 함수
function editNotice(id) {
    alert(`공지사항 수정: ${id}`);
}

function deleteNotice(id) {
    if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
        alert(`공지사항 삭제됨: ${id}`);
    }
}

// 프로모션 관련 함수
function editPromotion(code) {
    alert(`프로모션 수정: ${code}`);
}

function deletePromotion(code) {
    if (confirm('정말 이 프로모션을 삭제하시겠습니까?')) {
        alert(`프로모션 삭제됨: ${code}`);
    }
}

// 엑셀 내보내기
document.getElementById('exportUsersBtn')?.addEventListener('click', () => {
    alert('회원 데이터를 엑셀로 내보냅니다.');
});

document.getElementById('exportOrdersBtn')?.addEventListener('click', () => {
    alert('주문 데이터를 엑셀로 내보냅니다.');
});

document.getElementById('exportConsultationsBtn')?.addEventListener('click', () => {
    alert('상담 데이터를 엑셀로 내보냅니다.');
});

console.log('✅ 관리자 페이지 로드 완료');
