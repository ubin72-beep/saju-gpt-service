// 카카오 구독자 관리 스크립트
// LocalStorage 우선, API 백업 전략

let allSubscribers = [];
let filteredSubscribers = [];
let currentPage = 1;
const itemsPerPage = 10;
let subscribersChart = null;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 카카오 구독자 관리 시스템 초기화');
    initializeSidebar();
    loadSubscribers();
    renderChart();
});

// 사이드바 토글
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}

// 구독자 데이터 로드
async function loadSubscribers() {
    try {
        console.log('📥 구독자 데이터 로드 시작...');
        
        // 1순위: LocalStorage에서 로드
        const localData = localStorage.getItem('kakaoSubscribers');
        if (localData) {
            allSubscribers = JSON.parse(localData);
            console.log('✅ LocalStorage 로드 완료:', allSubscribers.length + '명');
        }
        
        // 2순위: API에서 로드 (백업)
        try {
            const response = await fetch('/tables/kakao_subscribers?limit=1000');
            if (response.ok) {
                const apiData = await response.json();
                console.log('✅ API 로드 완료:', apiData.data.length + '명');
                
                // LocalStorage와 API 데이터 병합 (중복 제거)
                const apiSubscribers = apiData.data.map(item => ({
                    id: item.id,
                    name: item.name,
                    phone: item.phone,
                    birth_year: item.birth_year,
                    zodiac: item.zodiac,
                    status: item.status || 'active',
                    subscription_start: item.subscription_start,
                    subscribedAt: item.created_at || item.subscription_start,
                    last_sent: item.last_sent,
                    free_until: item.free_until,
                    consent: item.consent,
                    api_synced: true
                }));
                
                // 중복 제거 후 병합
                const phoneSet = new Set(allSubscribers.map(s => s.phone));
                const newSubscribers = apiSubscribers.filter(s => !phoneSet.has(s.phone));
                
                if (newSubscribers.length > 0) {
                    allSubscribers = [...allSubscribers, ...newSubscribers];
                    localStorage.setItem('kakaoSubscribers', JSON.stringify(allSubscribers));
                    console.log('🔄 데이터 병합 완료:', newSubscribers.length + '명 추가');
                }
            }
        } catch (apiError) {
            console.warn('⚠️ API 로드 실패 (LocalStorage로 계속):', apiError.message);
        }
        
        // 날짜순 정렬 (최신순)
        allSubscribers.sort((a, b) => {
            const dateA = new Date(a.subscribedAt || a.subscription_start);
            const dateB = new Date(b.subscribedAt || b.subscription_start);
            return dateB - dateA;
        });
        
        filteredSubscribers = [...allSubscribers];
        
        updateStats();
        renderTable();
        renderChart();
        
    } catch (error) {
        console.error('❌ 구독자 로드 실패:', error);
        alert('구독자 데이터 로드에 실패했습니다.');
    }
}

// 통계 업데이트
function updateStats() {
    const total = allSubscribers.length;
    const active = allSubscribers.filter(s => s.status === 'active').length;
    
    // 오늘 신규 (오늘 00:00:00 이후)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = allSubscribers.filter(s => {
        const subDate = new Date(s.subscribedAt || s.subscription_start);
        return subDate >= today;
    }).length;
    
    // 무료 기간 (free_until이 미래인 사람)
    const now = new Date();
    const freeCount = allSubscribers.filter(s => {
        const freeUntil = new Date(s.free_until);
        return freeUntil > now;
    }).length;
    
    document.getElementById('totalSubscribers').textContent = total;
    document.getElementById('activeSubscribers').textContent = active;
    document.getElementById('todaySubscribers').textContent = todayCount;
    document.getElementById('freeSubscribers').textContent = freeCount;
}

// 차트 렌더링
function renderChart() {
    const ctx = document.getElementById('subscribersChart');
    if (!ctx) return;
    
    // 날짜별 구독자 수 계산 (최근 7일)
    const dates = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const count = allSubscribers.filter(s => {
            const subDate = new Date(s.subscribedAt || s.subscription_start);
            return subDate >= date && subDate < nextDate;
        }).length;
        
        dates.push((date.getMonth() + 1) + '/' + date.getDate());
        counts.push(count);
    }
    
    // 기존 차트 제거
    if (subscribersChart) {
        subscribersChart.destroy();
    }
    
    // 새 차트 생성
    subscribersChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: '일별 신규 구독자',
                data: counts,
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                title: {
                    display: true,
                    text: '📈 최근 7일 구독자 추이',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// 테이블 렌더링
function renderTable() {
    const tbody = document.getElementById('subscribersTableBody');
    const emptyState = document.getElementById('emptyState');
    
    if (filteredSubscribers.length === 0) {
        tbody.innerHTML = '';
        emptyState.style.display = 'block';
        document.querySelector('.pagination').style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    document.querySelector('.pagination').style.display = 'flex';
    
    // 페이지네이션 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredSubscribers.slice(startIndex, endIndex);
    
    // 테이블 내용 생성
    tbody.innerHTML = pageData.map((sub, index) => {
        const statusClass = sub.status === 'active' ? 'status-active' : 
                           sub.status === 'inactive' ? 'status-inactive' : 'status-paused';
        const statusText = sub.status === 'active' ? '활성' : 
                          sub.status === 'inactive' ? '비활성' : '일시중지';
        
        const subscribedDate = new Date(sub.subscribedAt || sub.subscription_start).toLocaleDateString('ko-KR');
        const freeUntilDate = new Date(sub.free_until).toLocaleDateString('ko-KR');
        
        // 전화번호 마스킹
        const maskedPhone = sub.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
        
        return `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>${sub.name}</td>
                <td>${maskedPhone}</td>
                <td>${sub.birth_year}년</td>
                <td>${sub.zodiac}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${subscribedDate}</td>
                <td>${freeUntilDate}</td>
                <td class="action-buttons">
                    <button class="btn-action btn-edit" onclick="editSubscriber('${sub.id}')">
                        <i class="fas fa-edit"></i> 수정
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteSubscriber('${sub.id}')">
                        <i class="fas fa-trash"></i> 삭제
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    renderPagination();
}

// 페이지네이션 렌더링
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '';
    
    // 이전 버튼
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<span>...</span>';
        }
    }
    
    // 다음 버튼
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    pagination.innerHTML = html;
}

// 페이지 변경
function changePage(page) {
    const totalPages = Math.ceil(filteredSubscribers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderTable();
}

// 필터링
function filterSubscribers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const zodiacFilter = document.getElementById('zodiacFilter').value;
    
    filteredSubscribers = allSubscribers.filter(sub => {
        const matchSearch = searchTerm === '' || 
            sub.name.toLowerCase().includes(searchTerm) ||
            sub.phone.includes(searchTerm);
        
        const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
        const matchZodiac = zodiacFilter === 'all' || sub.zodiac === zodiacFilter;
        
        return matchSearch && matchStatus && matchZodiac;
    });
    
    currentPage = 1;
    renderTable();
    updateStats();
}

// 구독자 수정
async function editSubscriber(id) {
    const subscriber = allSubscribers.find(s => s.id === id);
    if (!subscriber) return;
    
    const newStatus = prompt(`상태 변경 (현재: ${subscriber.status})\n\n입력: active (활성), inactive (비활성), paused (일시중지)`, subscriber.status);
    
    if (!newStatus || !['active', 'inactive', 'paused'].includes(newStatus)) {
        alert('올바른 상태를 입력해주세요.');
        return;
    }
    
    // LocalStorage 업데이트
    subscriber.status = newStatus;
    localStorage.setItem('kakaoSubscribers', JSON.stringify(allSubscribers));
    
    // API 업데이트 (선택사항)
    if (subscriber.api_synced) {
        try {
            const response = await fetch(`/tables/kakao_subscribers/${subscriber.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (response.ok) {
                console.log('✅ API 업데이트 완료');
            }
        } catch (error) {
            console.warn('⚠️ API 업데이트 실패:', error.message);
        }
    }
    
    alert('구독자 상태가 변경되었습니다!');
    loadSubscribers();
}

// 구독자 삭제
async function deleteSubscriber(id) {
    if (!confirm('정말로 이 구독자를 삭제하시겠습니까?')) return;
    
    const subscriber = allSubscribers.find(s => s.id === id);
    
    // LocalStorage에서 삭제
    allSubscribers = allSubscribers.filter(s => s.id !== id);
    localStorage.setItem('kakaoSubscribers', JSON.stringify(allSubscribers));
    
    // API에서 삭제 (선택사항)
    if (subscriber && subscriber.api_synced) {
        try {
            await fetch(`/tables/kakao_subscribers/${id}`, {
                method: 'DELETE'
            });
            console.log('✅ API 삭제 완료');
        } catch (error) {
            console.warn('⚠️ API 삭제 실패:', error.message);
        }
    }
    
    alert('구독자가 삭제되었습니다.');
    loadSubscribers();
}

// CSV 내보내기
function exportToCSV() {
    if (filteredSubscribers.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }
    
    // CSV 헤더
    let csv = 'ID,이름,전화번호,생년,띠,상태,구독일,무료기간종료일\n';
    
    // CSV 데이터
    filteredSubscribers.forEach((sub, index) => {
        const subscribedDate = new Date(sub.subscribedAt || sub.subscription_start).toISOString().split('T')[0];
        const freeUntilDate = new Date(sub.free_until).toISOString().split('T')[0];
        
        csv += `${index + 1},"${sub.name}","${sub.phone}",${sub.birth_year},"${sub.zodiac}","${sub.status}","${subscribedDate}","${freeUntilDate}"\n`;
    });
    
    // CSV 파일 다운로드
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `kakao_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`${filteredSubscribers.length}명의 구독자 데이터를 CSV 파일로 저장했습니다!`);
}
