/**
 * AI 사주 천년지기 - 관리자 대시보드 스크립트
 * 작성일: 2026-02-01
 * 업데이트: 백엔드 API 연동 추가
 * 
 * 참고: config.js가 먼저 로드되어야 합니다
 */

// ==========================================
// API 설정
// ==========================================

// API_BASE_URL은 config.js에서 정의됨
console.log('✅ API 설정 로드 완료');
console.log('📡 Base URL:', typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : '미설정');

// ==========================================
// 페이지 초기화
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ 관리자 페이지 초기화 시작');
  
  // 관리자 인증 확인
  checkAdminAuth();
  
  // 대시보드 통계 로드
  loadAdminStats();
  
  // 이벤트 리스너 설정
  setupEventListeners();
});

// ==========================================
// 관리자 인증 확인
// ==========================================

function checkAdminAuth() {
  console.log('🔐 관리자 인증 확인 중...');
  
  // admin-auth.js의 함수 사용 (우선)
  if (typeof isAdminLoggedIn === 'function' && typeof getCurrentAdmin === 'function') {
    if (!isAdminLoggedIn()) {
      console.log('❌ 관리자 로그인 필요');
      window.location.href = 'admin-login.html';
      return;
    }
    
    const adminData = getCurrentAdmin();
    if (adminData) {
      console.log('✅ 관리자 인증 확인:', adminData.name, `(${adminData.role})`);
      updateAdminInfo(adminData);
    }
    return;
  }
  
  // 백업: localStorage 기반 인증 (admin-auth.js가 없을 경우)
  const authToken = localStorage.getItem('authToken');
  const currentUser = localStorage.getItem('currentUser');
  
  if (!authToken || !currentUser) {
    console.log('❌ 인증 토큰이 없습니다. 로그인 페이지로 이동합니다.');
    alert('로그인이 필요합니다.');
    window.location.href = 'login.html';
    return;
  }
  
  try {
    const user = JSON.parse(currentUser);
    
    // 관리자 권한 확인
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      console.log('❌ 관리자 권한이 없습니다.');
      alert('관리자 권한이 필요합니다.');
      window.location.href = 'index.html';
      return;
    }
    
    console.log('✅ 관리자 인증 성공:', user.name);
    updateAdminInfo(user);
  } catch (error) {
    console.error('❌ 사용자 정보 파싱 실패:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

// ==========================================
// 관리자 정보 업데이트
// ==========================================

function updateAdminInfo(adminData) {
  // 관리자 이름 표시
  const adminNameElements = document.querySelectorAll('.admin-name');
  adminNameElements.forEach(el => {
    el.textContent = adminData.name || '관리자';
  });
  
  // 프로필 아바타 업데이트
  const avatarElements = document.querySelectorAll('.profile-avatar');
  avatarElements.forEach(el => {
    const initial = (adminData.name || '관리자').charAt(0);
    el.textContent = initial;
  });
}

// ==========================================
// 대시보드 통계 로드
// ==========================================

function loadAdminStats() {
  console.log('⚠️ 백엔드 미배포: 샘플 데이터 사용');
  
  // 샘플 데이터 로드
  loadSampleData();
  
  /* 백엔드 배포 시 활성화
  showLoading();
  
  AdminAPI.getStats()
    .then(response => {
      if (response.success) {
        console.log('✅ 대시보드 통계 로드 성공');
        
        // 메인 통계 업데이트
        updateMainStats(response.data.mainStats);
        
        // 추가 통계 업데이트
        updateAdditionalStats(response.data.additionalStats);
        
        // 최근 활동 업데이트
        updateRecentActivity(response.data.recentActivity);
        
        hideLoading();
      } else {
        throw new Error(response.message || '통계 데이터 로드 실패');
      }
    })
    .catch(error => {
      console.error('❌ 통계 데이터 로드 실패:', error);
      // 개발 환경에서는 샘플 데이터 사용
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('⚠️ 개발 환경: 샘플 데이터 로드');
        loadSampleData();
      } else {
        showError('통계 데이터를 불러오는데 실패했습니다.');
      }
      hideLoading();
    });
  */
}

// ==========================================
// 메인 통계 업데이트
// ==========================================

function updateMainStats(stats) {
  // 총 회원 수
  updateStatCard('total-users', stats.totalUsers);
  
  // 오늘 방문자
  updateStatCard('today-visitors', stats.todayVisitors);
  
  // 이번 달 매출
  updateStatCard('monthly-revenue', stats.monthlyRevenue);
  
  // 프리미엄 회원
  updateStatCard('premium-members', stats.premiumMembers);
}

function updateStatCard(elementId, statData) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  // 값 업데이트
  const valueElement = element.querySelector('.stat-value');
  if (valueElement) {
    // formatted 값이 있으면 사용, 없으면 value 사용
    valueElement.textContent = statData.formatted || statData.value || '0';
  }
  
  // 변화율 업데이트
  const changeElement = element.querySelector('.stat-change');
  if (changeElement && statData.change) {
    changeElement.textContent = statData.change;
    
    // 증감에 따른 색상 변경
    if (statData.trend === 'up') {
      changeElement.classList.add('positive');
      changeElement.classList.remove('negative');
    } else if (statData.trend === 'down') {
      changeElement.classList.add('negative');
      changeElement.classList.remove('positive');
    }
  }
}

// ==========================================
// 추가 통계 업데이트
// ==========================================

function updateAdditionalStats(stats) {
  // 이번 달 신규 회원
  const newUsersElement = document.getElementById('new-users-this-month');
  if (newUsersElement) {
    newUsersElement.textContent = stats.newUsersThisMonth || '0';
  }
  
  // 전체 사주 분석
  const totalSajuElement = document.getElementById('total-saju-analysis');
  if (totalSajuElement) {
    totalSajuElement.textContent = stats.totalSajuAnalysis || '0';
  }
  
  // 이번 달 사주 분석
  const thisMonthSajuElement = document.getElementById('this-month-saju');
  if (thisMonthSajuElement) {
    thisMonthSajuElement.textContent = stats.thisMonthSaju || '0';
  }
}

// ==========================================
// 최근 활동 업데이트
// ==========================================

function updateRecentActivity(activity) {
  // 최근 가입 회원
  updateRecentUsers(activity.recentUsers);
  
  // 최근 구독
  updateRecentSubscriptions(activity.recentSubscriptions);
  
  // 인기 서비스
  updatePopularServices(activity.popularServices);
}

function updateRecentUsers(users) {
  const container = document.getElementById('recent-users-list');
  if (!container || !users || users.length === 0) return;
  
  container.innerHTML = users.map(user => `
    <div class="recent-item">
      <div class="recent-item-info">
        <strong>${user.name}</strong>
        <span>${user.email}</span>
      </div>
      <div class="recent-item-date">${formatDate(user.joinedAt)}</div>
    </div>
  `).join('');
}

function updateRecentSubscriptions(subscriptions) {
  const container = document.getElementById('recent-subscriptions-list');
  if (!container || !subscriptions || subscriptions.length === 0) return;
  
  container.innerHTML = subscriptions.map(sub => `
    <div class="recent-item">
      <div class="recent-item-info">
        <strong>${sub.userName}</strong>
        <span class="badge ${sub.plan === 'premium' ? 'primary' : 'warning'}">
          ${getPlanLabel(sub.plan)}
        </span>
      </div>
      <div class="recent-item-date">${formatDate(sub.subscribedAt)}</div>
    </div>
  `).join('');
}

function updatePopularServices(services) {
  const container = document.getElementById('popular-services-list');
  if (!container || !services || services.length === 0) return;
  
  container.innerHTML = services.map(service => `
    <div class="recent-item">
      <div class="recent-item-info">
        <strong>${getServiceLabel(service.serviceType)}</strong>
        <span>${service.count}회 이용</span>
      </div>
      <div class="recent-item-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${service.percentage}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// ==========================================
// 회원 관리 페이지
// ==========================================

function loadUsersPage(page = 1, search = '') {
  console.log('👥 회원 목록 로드:', { page, search });
  
  showLoading();
  
  AdminAPI.getUsers(page, 20, search)
    .then(response => {
      if (response.success) {
        renderUsersTable(response.data.users);
        renderPagination(response.data.pagination, 'users');
        hideLoading();
      } else {
        throw new Error(response.message || '회원 목록 로드 실패');
      }
    })
    .catch(error => {
      console.error('❌ 회원 목록 로드 실패:', error);
      showError('회원 목록을 불러오는데 실패했습니다.');
      hideLoading();
    });
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  if (!tbody || !users || users.length === 0) return;
  
  tbody.innerHTML = users.map(user => `
    <tr>
      <td><input type="checkbox" class="user-checkbox" data-id="${user.id}"></td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${getPlanBadgeClass(user.plan)}">${getPlanLabel(user.plan)}</span></td>
      <td>${formatDate(user.joinedAt)}</td>
      <td>${user.lastLogin ? formatDate(user.lastLogin) : '-'}</td>
      <td><span class="badge ${user.status === 'active' ? 'success' : 'danger'}">${user.status === 'active' ? '활성' : '비활성'}</span></td>
      <td>
        <button class="action-btn view" onclick="viewUser('${user.id}')">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn edit" onclick="editUser('${user.id}')">
          <i class="fas fa-edit"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// 주문 관리 페이지
// ==========================================

function loadOrdersPage(page = 1) {
  console.log('🛒 주문 목록 로드:', { page });
  
  showLoading();
  
  AdminAPI.getOrders(page, 20)
    .then(response => {
      if (response.success) {
        renderOrdersTable(response.data.orders);
        renderPagination(response.data.pagination, 'orders');
        hideLoading();
      } else {
        throw new Error(response.message || '주문 목록 로드 실패');
      }
    })
    .catch(error => {
      console.error('❌ 주문 목록 로드 실패:', error);
      showError('주문 목록을 불러오는데 실패했습니다.');
      hideLoading();
    });
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody || !orders || orders.length === 0) return;
  
  tbody.innerHTML = orders.map(order => `
    <tr>
      <td>${order.orderNumber}</td>
      <td>${order.userName}</td>
      <td>${getServiceLabel(order.serviceType)}</td>
      <td>${formatCurrency(order.finalAmount)}</td>
      <td>${order.paymentMethod}</td>
      <td><span class="badge ${getOrderStatusBadgeClass(order.status)}">${getOrderStatusLabel(order.status)}</span></td>
      <td>${formatDate(order.createdAt)}</td>
      <td>
        <button class="action-btn view" onclick="viewOrder('${order.id}')">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// ==========================================
// 페이지네이션
// ==========================================

function renderPagination(pagination, type) {
  const container = document.getElementById('pagination');
  if (!container || !pagination) return;
  
  const { page, totalPages, hasNext, hasPrev } = pagination;
  
  let html = '';
  
  // 이전 버튼
  html += `<button class="pagination-btn" ${!hasPrev ? 'disabled' : ''} onclick="loadDashboardPage(${page - 1}, '${type}')">
    <i class="fas fa-chevron-left"></i>
  </button>`;
  
  // 페이지 번호
  const startPage = Math.max(1, page - 4);
  const endPage = Math.min(totalPages, startPage + 9);
  
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="pagination-btn ${i === page ? 'active' : ''}" onclick="loadDashboardPage(${i}, '${type}')">${i}</button>`;
  }
  
  // 다음 버튼
  html += `<button class="pagination-btn" ${!hasNext ? 'disabled' : ''} onclick="loadDashboardPage(${page + 1}, '${type}')">
    <i class="fas fa-chevron-right"></i>
  </button>`;
  
  container.innerHTML = html;
}

function loadDashboardPage(page, type) {
  if (type === 'users') {
    loadUsersPage(page);
  } else if (type === 'orders') {
    loadOrdersPage(page);
  }
}

// ==========================================
// 유틸리티 함수
// ==========================================

function getPlanLabel(plan) {
  const labels = {
    'free': '무료',
    'monthly': '월간',
    'annual': '연간',
    'premium': '프리미엄'
  };
  return labels[plan] || plan;
}

function getPlanBadgeClass(plan) {
  const classes = {
    'free': '',
    'monthly': 'warning',
    'annual': 'warning',
    'premium': 'primary'
  };
  return classes[plan] || '';
}

function getServiceLabel(serviceType) {
  const labels = {
    'saju': '사주 분석',
    'tarot': '타로 상담',
    'dream': '꿈 해몽',
    'naming': '작명',
    'compatibility': '궁합'
  };
  return labels[serviceType] || serviceType;
}

function getOrderStatusLabel(status) {
  const labels = {
    'pending': '대기',
    'completed': '완료',
    'cancelled': '취소',
    'refunded': '환불'
  };
  return labels[status] || status;
}

function getOrderStatusBadgeClass(status) {
  const classes = {
    'pending': 'warning',
    'completed': 'success',
    'cancelled': 'danger',
    'refunded': 'info'
  };
  return classes[status] || '';
}

function formatDate(dateString) {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// UI 헬퍼 함수
// ==========================================

function showLoading() {
  const loader = document.getElementById('loading-indicator');
  if (loader) {
    loader.style.display = 'block';
  }
}

function hideLoading() {
  const loader = document.getElementById('loading-indicator');
  if (loader) {
    loader.style.display = 'none';
  }
}

function showError(message) {
  // 에러 토스트 또는 알림 표시
  console.error('❌', message);
  alert(message);
}

// ==========================================
// 이벤트 리스너
// ==========================================

function setupEventListeners() {
  // 메뉴 클릭 이벤트 - SPA 방식 제거 (별도 페이지 방식 사용)
  // 더 이상 필요 없음 - HTML의 <a href="..."> 링크가 직접 작동
  
  // 검색 이벤트
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    searchInput.addEventListener('keyup', debounce(function(e) {
      const search = e.target.value;
      loadUsersPage(1, search);
    }, 500));
  }
}

// switchPage 함수 제거됨 - 별도 페이지 방식으로 변경됨
// 각 페이지는 독립적인 HTML 파일로 존재: admin.html, admin-users.html 등

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==========================================
// 샘플 데이터 (개발용)
// ==========================================

function loadSampleData() {
  console.log('📊 샘플 데이터 로드 중...');
  
  const sampleStats = {
    totalUsers: {
      value: 12543,
      change: '+12.5%',
      trend: 'up'
    },
    todayVisitors: {
      value: 1847,
      change: '+8.3%',
      trend: 'up'
    },
    monthlyRevenue: {
      value: 8542000,
      formatted: '₩8,542,000',
      change: '+23.1%',
      trend: 'up'
    },
    premiumMembers: {
      value: 2156,
      change: '+15.7%',
      trend: 'up'
    }
  };
  
  updateMainStats(sampleStats);
  
  console.log('✅ 샘플 데이터 로드 완료');
}

// ==========================================
// 스크립트 로드 완료
// ==========================================

console.log('✅ 관리자 페이지 스크립트 로드 완료');
