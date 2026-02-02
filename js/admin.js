// AI 사주 천년지기 - 관리자 페이지 스크립트
// 작성일: 2026-02-01
// 업데이트: 백엔드 API 연동 추가

// ==========================================
// API 설정
// ==========================================

// config.js를 먼저 로드해야 합니다
// <script src="../js/config.js"></script>

// ==========================================
// 페이지 초기화
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
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
  // admin-auth.js의 인증 시스템 사용
  if (typeof isAdminLoggedIn === 'function' && typeof getCurrentAdmin === 'function') {
    if (!isAdminLoggedIn()) {
      // admin-auth.js의 checkAdminAccess()가 이미 처리함
      return;
    }
    
    const admin = getCurrentAdmin();
    if (admin) {
      console.log('✅ 관리자 인증 확인:', admin.name, `(${admin.role})`);
      updateAdminInfo(admin);
    }
  } else {
    // admin-auth.js가 로드되지 않은 경우 (fallback)
    console.warn('⚠️ admin-auth.js가 로드되지 않았습니다.');
    
    // 일반 인증 시스템 체크 (백업)
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
      alert('로그인이 필요합니다.');
      window.location.href = 'admin-login.html';
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      
      // 관리자 권한 확인
      if (userData.role !== 'admin' && userData.role !== 'super_admin') {
        alert('관리자 권한이 필요합니다.');
        window.location.href = 'index.html';
        return;
      }
      
      console.log('✅ 관리자 인증 확인 (일반):', userData.name, `(${userData.role})`);
      updateAdminInfo(userData);
      
    } catch (error) {
      console.error('사용자 정보 파싱 오류:', error);
      localStorage.clear();
      window.location.href = 'admin-login.html';
    }
  }
}

function updateAdminInfo(adminData) {
  // 관리자 이름 표시
  const adminNameElements = document.querySelectorAll('.admin-name');
  adminNameElements.forEach(el => {
    el.textContent = adminData.name || '관리자';
  });
  
  // 프로필 아바타 업데이트 (있으면)
  const profileAvatars = document.querySelectorAll('.profile-avatar');
  profileAvatars.forEach(el => {
    const initials = (adminData.name || '관리자').substring(0, 2);
    el.textContent = initials;
  });
}

// ==========================================
// 대시보드 통계 로드 (그래프 없음, 숫자 카드만)
// ==========================================

async function loadAdminStats() {
  try {
    showLoading('통계 데이터 로딩 중...');
    
    const response = await AdminAPI.getStats();
    
    if (response.success) {
      const { mainStats, additionalStats, recentActivity } = response.data;
      
      // 메인 통계 카드 업데이트 (4개 카드)
      updateMainStats(mainStats);
      
      // 추가 통계 업데이트
      updateAdditionalStats(additionalStats);
      
      // 최근 활동 업데이트
      updateRecentActivity(recentActivity);
      
      hideLoading();
      
      console.log('✅ 통계 데이터 로드 완료');
    }
    
  } catch (error) {
    console.error('❌ 통계 로드 실패:', error);
    hideLoading();
    
    // 에러 시 샘플 데이터 표시 (개발용)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.log('⚠️ 개발 모드: 샘플 데이터 사용');
      loadSampleData();
    } else {
      showError('통계 데이터를 불러오는데 실패했습니다.');
    }
  }
}

// ==========================================
// 메인 통계 카드 업데이트 (그래프 없음)
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
  // 숫자 업데이트
  const valueElement = document.getElementById(elementId);
  if (valueElement) {
    // 매출인 경우 포맷팅된 값 사용
    if (statData.formatted) {
      valueElement.textContent = statData.formatted;
    } else {
      valueElement.textContent = statData.value.toLocaleString();
    }
  }
  
  // 증감율 업데이트
  const changeElement = document.getElementById(`${elementId}-change`);
  if (changeElement) {
    changeElement.textContent = statData.change;
    
    // 트렌드에 따라 색상 변경
    if (statData.trend === 'up') {
      changeElement.className = 'stat-change positive';
    } else {
      changeElement.className = 'stat-change negative';
    }
  }
}

// ==========================================
// 추가 통계 업데이트
// ==========================================

function updateAdditionalStats(stats) {
  // 이번 달 신규 회원
  const newUsersElement = document.getElementById('new-users-month');
  if (newUsersElement) {
    newUsersElement.textContent = stats.newUsersThisMonth.value.toLocaleString();
  }
  
  // 총 사주 분석 건수
  const totalSajuElement = document.getElementById('total-saju');
  if (totalSajuElement) {
    totalSajuElement.textContent = stats.totalSajuAnalysis.value.toLocaleString();
  }
  
  // 이번 달 사주 분석
  const monthSajuElement = document.getElementById('month-saju');
  if (monthSajuElement) {
    monthSajuElement.textContent = stats.thisMonthSaju.value.toLocaleString();
  }
}

// ==========================================
// 최근 활동 업데이트 (리스트 형식)
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
  if (!container) return;
  
  if (users.length === 0) {
    container.innerHTML = '<p class="no-data">최근 가입 회원이 없습니다.</p>';
    return;
  }
  
  const html = users.map(user => `
    <div class="user-item">
      <div class="user-info">
        <strong>${user.name}</strong>
        <span class="user-email">${user.email}</span>
      </div>
      <div class="user-meta">
        <span class="user-plan badge ${user.plan}">${getPlanLabel(user.plan)}</span>
        <span class="user-date">${formatDate(user.joinedAt)}</span>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function updateRecentSubscriptions(subscriptions) {
  const container = document.getElementById('recent-subscriptions-list');
  if (!container) return;
  
  if (subscriptions.length === 0) {
    container.innerHTML = '<p class="no-data">최근 구독이 없습니다.</p>';
    return;
  }
  
  const html = subscriptions.map(sub => `
    <div class="subscription-item">
      <div class="subscription-info">
        <strong>${sub.userName}</strong>
        <span class="subscription-plan">${getPlanLabel(sub.plan)}</span>
      </div>
      <div class="subscription-meta">
        <span class="subscription-amount">₩${sub.amount.toLocaleString()}</span>
        <span class="subscription-status badge ${sub.status}">${sub.status}</span>
        <span class="subscription-date">${formatDate(sub.createdAt)}</span>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

function updatePopularServices(services) {
  const container = document.getElementById('popular-services-list');
  if (!container) return;
  
  if (services.length === 0) {
    container.innerHTML = '<p class="no-data">데이터가 없습니다.</p>';
    return;
  }
  
  const html = services.map(service => `
    <div class="service-item">
      <div class="service-name">${getServiceLabel(service.type)}</div>
      <div class="service-count">${service.count.toLocaleString()}건</div>
    </div>
  `).join('');
  
  container.innerHTML = html;
}

// ==========================================
// 회원 관리 페이지
// ==========================================

async function loadUsersPage(page = 1, search = '') {
  try {
    showLoading('회원 목록 로딩 중...');
    
    const response = await AdminAPI.getUsers(page, 20);
    
    if (response.success) {
      renderUsersTable(response.data.users);
      renderPagination(response.data.pagination, 'users');
      hideLoading();
    }
    
  } catch (error) {
    console.error('❌ 회원 목록 로드 실패:', error);
    hideLoading();
    showError('회원 목록을 불러오는데 실패했습니다.');
  }
}

function renderUsersTable(users) {
  const tbody = document.getElementById('users-table-body');
  if (!tbody) return;
  
  if (users.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="no-data">회원이 없습니다.</td></tr>';
    return;
  }
  
  const html = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td><span class="badge ${user.plan}">${getPlanLabel(user.plan)}</span></td>
      <td>${formatDate(user.joinedAt)}</td>
      <td>${formatDate(user.lastLogin)}</td>
      <td>
        <span class="status-badge ${user.status === '활성' ? 'active' : 'inactive'}">${user.status}</span>
      </td>
      <td>
        <button onclick="viewUserDetail('${user.id}')" class="btn-sm btn-primary">상세</button>
        <button onclick="editUser('${user.id}')" class="btn-sm btn-secondary">수정</button>
      </td>
    </tr>
  `).join('');
  
  tbody.innerHTML = html;
}

// ==========================================
// 주문 관리 페이지
// ==========================================

async function loadOrdersPage(page = 1, status = '전체') {
  try {
    showLoading('주문 목록 로딩 중...');
    
    const response = await AdminAPI.getOrders(page, 20);
    
    if (response.success) {
      renderOrdersTable(response.data.orders);
      renderPagination(response.data.pagination, 'orders');
      hideLoading();
    }
    
  } catch (error) {
    console.error('❌ 주문 목록 로드 실패:', error);
    hideLoading();
    showError('주문 목록을 불러오는데 실패했습니다.');
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('orders-table-body');
  if (!tbody) return;
  
  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="no-data">주문이 없습니다.</td></tr>';
    return;
  }
  
  const html = orders.map(order => `
    <tr>
      <td>${order.userName}</td>
      <td>${order.userEmail}</td>
      <td>${getPlanLabel(order.plan)}</td>
      <td>₩${order.finalAmount.toLocaleString()}</td>
      <td>${order.paymentMethod || '-'}</td>
      <td><span class="status-badge ${order.status}">${order.status}</span></td>
      <td>${formatDate(order.createdAt)}</td>
      <td>
        <button onclick="viewOrderDetail('${order.id}')" class="btn-sm btn-primary">상세</button>
      </td>
    </tr>
  `).join('');
  
  tbody.innerHTML = html;
}

// ==========================================
// 페이지네이션 렌더링
// ==========================================

function renderPagination(pagination, type) {
  const container = document.getElementById(`${type}-pagination`);
  if (!container) return;
  
  const { currentPage, totalPages } = pagination;
  
  let html = '<div class="pagination">';
  
  // 이전 버튼
  if (currentPage > 1) {
    html += `<button onclick="load${capitalize(type)}Page(${currentPage - 1})" class="btn-pagination">이전</button>`;
  }
  
  // 페이지 번호
  for (let i = 1; i <= Math.min(totalPages, 10); i++) {
    const activeClass = i === currentPage ? 'active' : '';
    html += `<button onclick="load${capitalize(type)}Page(${i})" class="btn-pagination ${activeClass}">${i}</button>`;
  }
  
  // 다음 버튼
  if (currentPage < totalPages) {
    html += `<button onclick="load${capitalize(type)}Page(${currentPage + 1})" class="btn-pagination">다음</button>`;
  }
  
  html += '</div>';
  
  container.innerHTML = html;
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

function getServiceLabel(type) {
  const labels = {
    'basic': '기본 사주',
    'detailed': '상세 사주',
    'premium': '프리미엄 종합 분석',
    'compatibility': '궁합',
    'yearly': '연운',
    'naming': '작명/개명'
  };
  return labels[type] || type;
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================
// UI 헬퍼 함수
// ==========================================

function showLoading(message = '로딩 중...') {
  const loader = document.getElementById('loading-indicator');
  if (loader) {
    loader.textContent = message;
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
  alert(message);
}

// ==========================================
// 이벤트 리스너 설정
// ==========================================

function setupEventListeners() {
  // 메뉴 클릭 이벤트
  const menuItems = document.querySelectorAll('.sidebar-menu a');
  menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
      // 페이지 전환 로직
      const page = this.getAttribute('data-page');
      if (page) {
        e.preventDefault();
        switchPage(page);
      }
    });
  });
  
  // 검색 이벤트
  const searchInput = document.getElementById('user-search');
  if (searchInput) {
    searchInput.addEventListener('keyup', debounce(function(e) {
      const search = e.target.value;
      loadUsersPage(1, search);
    }, 500));
  }
}

function switchPage(page) {
  // 페이지 전환 로직
  console.log('페이지 전환:', page);
  
  switch(page) {
    case 'dashboard':
      loadAdminStats();
      break;
    case 'users':
      loadUsersPage();
      break;
    case 'orders':
      loadOrdersPage();
      break;
    default:
      console.log('알 수 없는 페이지:', page);
  }
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ==========================================
// 샘플 데이터 (개발/테스트용)
// ==========================================

function loadSampleData() {
  const sampleStats = {
    totalUsers: { value: 12543, change: '+12.5%', trend: 'up', label: '총 회원 수' },
    todayVisitors: { value: 1847, change: '+8.3%', trend: 'up', label: '오늘 방문자' },
    monthlyRevenue: { value: 8542000, change: '+23.1%', trend: 'up', label: '이번 달 매출', formatted: '₩8,542,000' },
    premiumMembers: { value: 2156, change: '+15.7%', trend: 'up', label: '프리미엄 회원' }
  };
  
  updateMainStats(sampleStats);
  console.log('✅ 샘플 데이터 로드 완료');
}

console.log('✅ 관리자 페이지 스크립트 로드 완료');
