// 카카오 구독자 관리 JavaScript

// 전역 변수
let allSubscribers = [];
let currentPage = 1;
const itemsPerPage = 10;

// 데이터 로드
async function loadSubscribers() {
    try {
        // 1. LocalStorage에서 로드
        const localData = JSON.parse(localStorage.getItem('kakaoSubscribers') || '[]');
        
        // 2. API에서 로드 시도
        try {
            const response = await fetch('/tables/kakao_subscribers?limit=1000');
            if (response.ok) {
                const apiData = await response.json();
                allSubscribers = apiData.data || [];
                console.log('✅ API에서 로드:', allSubscribers.length, '명');
            } else {
                throw new Error('API 응답 오류');
            }
        } catch (apiError) {
            console.warn('⚠️ API 로드 실패, LocalStorage 사용:', apiError);
            allSubscribers = localData;
        }

        // 3. 데이터 통합 (중복 제거)
        if (localData.length > 0) {
            const phoneSet = new Set(allSubscribers.map(s => s.phone));
            const newFromLocal = localData.filter(s => !phoneSet.has(s.phone));
            allSubscribers = [...allSubscribers, ...newFromLocal];
        }

        updateStatistics();
        renderTable();
        renderZodiacChart();

    } catch (error) {
        console.error('❌ 데이터 로드 실패:', error);
        allSubscribers = [];
        document.getElementById('emptyState').style.display = 'block';
    }
}

// 통계 업데이트
function updateStatistics() {
    const total = allSubscribers.length;
    const active = allSubscribers.filter(s => s.status === 'active').length;
    
    const today = new Date().toISOString().split('T')[0];
    const todayNew = allSubscribers.filter(s => {
        const subDate = new Date(s.subscription_start || s.subscribedAt).toISOString().split('T')[0];
        return subDate === today;
    }).length;

    document.getElementById('totalSubscribers').textContent = total;
    document.getElementById('activeSubscribers').textContent = active;
    document.getElementById('todaySubscribers').textContent = todayNew;
    document.getElementById('sentToday').textContent = '0'; // 실제 발송 시스템 연동 필요
}

// 띠별 차트 렌더링
function renderZodiacChart() {
    const zodiacCount = {};
    const zodiacs = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
    
    zodiacs.forEach(z => zodiacCount[z] = 0);
    allSubscribers.forEach(s => {
        if (s.zodiac) zodiacCount[s.zodiac]++;
    });

    const ctx = document.getElementById('zodiacChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: zodiacs,
            datasets: [{
                label: '구독자 수',
                data: zodiacs.map(z => zodiacCount[z]),
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filtered = allSubscribers.filter(subscriber => {
        const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm) ||
                            subscriber.phone.includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filtered.length === 0) {
        document.getElementById('subscribersTable').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
        document.getElementById('pagination').style.display = 'none';
        return;
    }

    document.getElementById('subscribersTable').style.display = 'table';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('pagination').style.display = 'flex';

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filtered.slice(startIndex, endIndex);

    const tbody = document.getElementById('subscribersTableBody');
    tbody.innerHTML = '';

    pageData.forEach((subscriber, index) => {
        const row = document.createElement('tr');
        const globalIndex = startIndex + index + 1;
        
        const subscriptionDate = new Date(subscriber.subscription_start || subscriber.subscribedAt);
        const freeUntil = new Date(subscriber.free_until || Date.now() + 30 * 24 * 60 * 60 * 1000);
        const daysLeft = Math.ceil((freeUntil - new Date()) / (1000 * 60 * 60 * 24));

        const statusClass = subscriber.status === 'active' ? 'status-active' :
                          subscriber.status === 'paused' ? 'status-paused' : 'status-cancelled';
        const statusText = subscriber.status === 'active' ? '활성' :
                         subscriber.status === 'paused' ? '일시중지' : '해지';

        row.innerHTML = `
            <td>${globalIndex}</td>
            <td><strong>${subscriber.name}</strong></td>
            <td>${formatPhone(subscriber.phone)}</td>
            <td>${subscriber.birth_year}년</td>
            <td>${subscriber.zodiac}</td>
            <td>${formatDate(subscriptionDate)}</td>
            <td>${daysLeft > 0 ? `${daysLeft}일 남음` : '종료'}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-action btn-view" onclick="viewDetail('${subscriber.id || subscriber.phone}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-action btn-pause" onclick="toggleStatus('${subscriber.id || subscriber.phone}')">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="deleteSubscriber('${subscriber.id || subscriber.phone}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    renderPagination(totalPages);
}

// 페이지네이션 렌더링
function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // 이전 버튼
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1);
    pagination.appendChild(prevBtn);

    // 페이지 번호
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.onclick = () => changePage(i);
            pagination.appendChild(pageBtn);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const dots = document.createElement('span');
            dots.textContent = '...';
            dots.style.padding = '8px';
            pagination.appendChild(dots);
        }
    }

    // 다음 버튼
    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1);
    pagination.appendChild(nextBtn);
}

// 페이지 변경
function changePage(page) {
    currentPage = page;
    renderTable();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 상세보기
function viewDetail(id) {
    const subscriber = allSubscribers.find(s => (s.id || s.phone) === id);
    if (!subscriber) return;

    const freeUntil = new Date(subscriber.free_until || Date.now() + 30 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.ceil((freeUntil - new Date()) / (1000 * 60 * 60 * 24));

    document.getElementById('modalBody').innerHTML = `
        <div class="detail-row">
            <div class="detail-label">이름</div>
            <div class="detail-value"><strong>${subscriber.name}</strong></div>
        </div>
        <div class="detail-row">
            <div class="detail-label">전화번호</div>
            <div class="detail-value">${formatPhone(subscriber.phone)}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">생년</div>
            <div class="detail-value">${subscriber.birth_year}년</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">띠</div>
            <div class="detail-value">${subscriber.zodiac}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">가입일</div>
            <div class="detail-value">${formatDateTime(new Date(subscriber.subscription_start || subscriber.subscribedAt))}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">무료 기간</div>
            <div class="detail-value">${formatDateTime(freeUntil)} (${daysLeft > 0 ? `${daysLeft}일 남음` : '종료'})</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">마지막 발송</div>
            <div class="detail-value">${subscriber.last_sent ? formatDateTime(new Date(subscriber.last_sent)) : '발송 전'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">상태</div>
            <div class="detail-value">
                <span class="status-badge ${subscriber.status === 'active' ? 'status-active' : subscriber.status === 'paused' ? 'status-paused' : 'status-cancelled'}">
                    ${subscriber.status === 'active' ? '활성' : subscriber.status === 'paused' ? '일시중지' : '해지'}
                </span>
            </div>
        </div>
        <div class="detail-row">
            <div class="detail-label">개인정보 동의</div>
            <div class="detail-value">${subscriber.consent ? '✅ 동의함' : '❌ 미동의'}</div>
        </div>
        <div class="detail-row">
            <div class="detail-label">구독자 ID</div>
            <div class="detail-value"><code>${subscriber.id || 'N/A'}</code></div>
        </div>
    `;

    document.getElementById('detailModal').classList.add('show');
}

// 모달 닫기
function closeModal() {
    document.getElementById('detailModal').classList.remove('show');
}

// 상태 토글
async function toggleStatus(id) {
    const subscriber = allSubscribers.find(s => (s.id || s.phone) === id);
    if (!subscriber) return;

    const newStatus = subscriber.status === 'active' ? 'paused' : 'active';
    const confirmMsg = newStatus === 'paused' 
        ? `${subscriber.name}님의 구독을 일시중지하시겠습니까?`
        : `${subscriber.name}님의 구독을 재개하시겠습니까?`;

    if (!confirm(confirmMsg)) return;

    subscriber.status = newStatus;

    // LocalStorage 업데이트
    const localData = JSON.parse(localStorage.getItem('kakaoSubscribers') || '[]');
    const index = localData.findIndex(s => s.phone === subscriber.phone);
    if (index !== -1) {
        localData[index].status = newStatus;
        localStorage.setItem('kakaoSubscribers', JSON.stringify(localData));
    }

    // API 업데이트 시도
    if (subscriber.id && !subscriber.id.startsWith('SUB_')) {
        try {
            await fetch(`/tables/kakao_subscribers/${subscriber.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.warn('API 업데이트 실패:', error);
        }
    }

    alert(`${subscriber.name}님의 상태가 변경되었습니다.`);
    loadSubscribers();
}

// 구독자 삭제
async function deleteSubscriber(id) {
    const subscriber = allSubscribers.find(s => (s.id || s.phone) === id);
    if (!subscriber) return;

    if (!confirm(`${subscriber.name}님을 정말 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;

    // LocalStorage에서 삭제
    let localData = JSON.parse(localStorage.getItem('kakaoSubscribers') || '[]');
    localData = localData.filter(s => s.phone !== subscriber.phone);
    localStorage.setItem('kakaoSubscribers', JSON.stringify(localData));

    // API에서 삭제 시도
    if (subscriber.id && !subscriber.id.startsWith('SUB_')) {
        try {
            await fetch(`/tables/kakao_subscribers/${subscriber.id}`, {
                method: 'DELETE'
            });
        } catch (error) {
            console.warn('API 삭제 실패:', error);
        }
    }

    alert(`${subscriber.name}님이 삭제되었습니다.`);
    loadSubscribers();
}

// CSV 내보내기
function exportToCSV() {
    if (allSubscribers.length === 0) {
        alert('내보낼 데이터가 없습니다.');
        return;
    }

    const headers = ['번호', '이름', '전화번호', '생년', '띠', '가입일', '무료기간종료', '상태'];
    const rows = allSubscribers.map((s, i) => [
        i + 1,
        s.name,
        formatPhone(s.phone),
        s.birth_year,
        s.zodiac,
        formatDate(new Date(s.subscription_start || s.subscribedAt)),
        formatDate(new Date(s.free_until || Date.now() + 30 * 24 * 60 * 60 * 1000)),
        s.status === 'active' ? '활성' : s.status === 'paused' ? '일시중지' : '해지'
    ]);

    let csvContent = '\uFEFF'; // BOM for Excel
    csvContent += headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `카카오구독자_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// 유틸리티 함수
function formatPhone(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.length === 11) {
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
    }
    return phone;
}

function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// 검색 및 필터 이벤트
document.getElementById('searchInput').addEventListener('input', () => {
    currentPage = 1;
    renderTable();
});

document.getElementById('statusFilter').addEventListener('change', () => {
    currentPage = 1;
    renderTable();
});

// 사이드바 토글
document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('adminSidebar').classList.toggle('collapsed');
});

// 모달 외부 클릭 시 닫기
document.getElementById('detailModal').addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeModal();
    }
});

// 초기 로드
document.addEventListener('DOMContentLoaded', () => {
    loadSubscribers();
    console.log('✅ 카카오 구독자 관리 페이지 로드 완료');
});
