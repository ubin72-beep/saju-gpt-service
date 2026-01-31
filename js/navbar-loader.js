/**
 * 네비게이션 바 로더
 * 모든 페이지에서 공통으로 사용하는 네비게이션을 로드합니다.
 */

// 네비게이션 로드 함수
async function loadNavbar() {
    try {
        const response = await fetch('/components/navbar.html');
        
        if (!response.ok) {
            throw new Error(`네비게이션 로드 실패: ${response.status}`);
        }
        
        const navbarHTML = await response.text();
        
        // navbar-placeholder가 있으면 그곳에 삽입
        const placeholder = document.getElementById('navbar-placeholder');
        if (placeholder) {
            placeholder.innerHTML = navbarHTML;
        } else {
            // placeholder가 없으면 body 최상단에 삽입
            document.body.insertAdjacentHTML('afterbegin', navbarHTML);
        }
        
        // 네비게이션 로드 후 이벤트 리스너 등록
        initNavbarEvents();
        
        console.log('✅ 네비게이션 로드 완료');
    } catch (error) {
        console.error('❌ 네비게이션 로드 실패:', error);
    }
}

// 네비게이션 이벤트 초기화
function initNavbarEvents() {
    // 햄버거 메뉴 이벤트
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // 모바일 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
        
        // 모바일 서브메뉴 토글
        const mobileSubmenuTitle = document.querySelector('.mobile-submenu-title');
        if (mobileSubmenuTitle) {
            mobileSubmenuTitle.addEventListener('click', function() {
                this.parentElement.classList.toggle('active');
            });
        }
    }
    
    // 언어 선택기 이벤트
    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            langDropdown.classList.toggle('active');
        });
        
        // 언어 선택
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                const flag = this.querySelector('.lang-flag').textContent;
                const langName = this.textContent.trim();
                
                // 현재 언어 업데이트
                document.getElementById('currentFlag').textContent = flag;
                document.getElementById('currentLang').textContent = langName.replace('✓', '').trim();
                
                // active 클래스 변경
                langOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // 드롭다운 닫기
                langDropdown.classList.remove('active');
                
                console.log(`언어 변경: ${lang}`);
            });
        });
        
        // 드롭다운 외부 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
    }
    
    // 현재 페이지 활성화 표시
    highlightCurrentPage();
}

// 현재 페이지 활성화 표시
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 네비게이션 메뉴 링크들
    const navLinks = document.querySelectorAll('.nav-menu a, .mobile-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.color = '#d4af37';
            link.style.fontWeight = '700';
        }
    });
}

// 페이지 로드 시 자동 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
