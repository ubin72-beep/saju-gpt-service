/**
 * 다크 모드 & 고급 UI 인터랙션
 * 2026 병오년 만세력
 */

// ========================================
// 🌙 다크 모드 시스템
// ========================================
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        // 시스템 테마 자동 감지
        if (!localStorage.getItem('theme')) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.theme = prefersDark ? 'dark' : 'light';
        }
        
        this.applyTheme();
        this.createToggleButton();
        this.watchSystemTheme();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        
        // 메타 테마 컬러 업데이트
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.content = this.theme === 'dark' ? '#0f0f0f' : '#ffffff';
        }
    }

    toggle() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        
        // 애니메이션 효과
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    }

    createToggleButton() {
        const navbar = document.querySelector('.navbar .container');
        if (!navbar) return;

        const existingToggle = document.querySelector('.theme-toggle');
        if (existingToggle) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'theme-toggle';
        toggleBtn.setAttribute('aria-label', '다크 모드 토글');
        toggleBtn.innerHTML = `
            <div class="theme-toggle-slider">
                <i class="fas fa-${this.theme === 'dark' ? 'moon' : 'sun'}"></i>
            </div>
        `;

        // 네비게이션 액션 영역에 추가
        const navActions = navbar.querySelector('.nav-actions') || navbar;
        navActions.appendChild(toggleBtn);

        toggleBtn.addEventListener('click', () => {
            this.toggle();
            const icon = toggleBtn.querySelector('i');
            icon.className = `fas fa-${this.theme === 'dark' ? 'moon' : 'sun'}`;
        });
    }

    watchSystemTheme() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
            }
        });
    }
}

// ========================================
// ✨ 스크롤 기반 애니메이션
// ========================================
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, options);

        // 모든 애니메이션 요소 관찰
        document.querySelectorAll('.scroll-reveal, .stagger-item').forEach(el => {
            this.observer.observe(el);
        });
    }

    refresh() {
        // 동적으로 추가된 요소 재관찰
        document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ========================================
// 🎨 고급 카드 3D 효과
// ========================================
function initCard3DEffect() {
    const cards = document.querySelectorAll('.card-3d, .glass-card, .service-card-advanced');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ========================================
// 🌊 Parallax 스크롤 효과
// ========================================
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    });
}

// ========================================
// 💫 부드러운 스크롤
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========================================
// 🎭 로딩 스켈레톤 제거
// ========================================
function removeSkeletons() {
    setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(skeleton => {
            skeleton.classList.remove('skeleton');
            skeleton.classList.add('fade-in');
        });
    }, 500);
}

// ========================================
// 🔔 실시간 알림 시스템
// ========================================
class NotificationSystem {
    constructor() {
        this.container = null;
        this.notifications = [
            { icon: '🎉', text: '김*진님이 프리미엄 구독을 시작했습니다', time: '방금 전' },
            { icon: '⭐', text: '이*희님이 사주팔자를 조회했습니다', time: '1분 전' },
            { icon: '💰', text: '박*수님이 궁합 분석을 구매했습니다', time: '3분 전' },
            { icon: '🎯', text: '최*영님이 토정비결을 이용했습니다', time: '5분 전' },
            { icon: '✨', text: '정*민님이 AI 상담을 시작했습니다', time: '7분 전' }
        ];
        this.init();
    }

    init() {
        this.createContainer();
        this.startNotifications();
    }

    createContainer() {
        if (document.querySelector('.live-notifications')) return;
        
        this.container = document.createElement('div');
        this.container.className = 'live-notifications';
        document.body.appendChild(this.container);
    }

    showNotification(notification) {
        const notif = document.createElement('div');
        notif.className = 'live-notification';
        notif.innerHTML = `
            <span class="notification-icon">${notification.icon}</span>
            <div class="notification-content">
                <div class="notification-text">${notification.text}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
        `;
        
        this.container.appendChild(notif);
        
        // 등장 애니메이션
        setTimeout(() => {
            notif.style.transform = 'translateX(0)';
            notif.style.opacity = '1';
        }, 100);
        
        // 5초 후 제거
        setTimeout(() => {
            notif.style.transform = 'translateX(400px)';
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 500);
        }, 5000);
    }

    startNotifications() {
        let index = 0;
        
        // 10초마다 알림 표시
        setInterval(() => {
            if (this.container && this.container.children.length < 3) {
                this.showNotification(this.notifications[index]);
                index = (index + 1) % this.notifications.length;
            }
        }, 10000);
        
        // 첫 알림은 3초 후
        setTimeout(() => {
            this.showNotification(this.notifications[0]);
        }, 3000);
    }
}

// ========================================
// 🚀 초기화
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // 다크 모드 초기화
    const themeManager = new ThemeManager();
    
    // 스크롤 애니메이션 초기화
    const scrollAnimations = new ScrollAnimations();
    
    // 3D 카드 효과
    initCard3DEffect();
    
    // Parallax 효과
    initParallaxEffect();
    
    // 부드러운 스크롤
    initSmoothScroll();
    
    // 스켈레톤 제거
    removeSkeletons();
    
    // 실시간 알림 (메인 페이지에서만)
    if (document.body.classList.contains('home-page') || window.location.pathname === '/index.html' || window.location.pathname === '/') {
        new NotificationSystem();
    }
    
    // 스크롤 애니메이션 클래스 자동 추가
    document.querySelectorAll('.service-card, .feature-item, .review-card').forEach((el, index) => {
        if (!el.classList.contains('stagger-item')) {
            el.classList.add('scroll-reveal');
            el.style.transitionDelay = `${index * 0.1}s`;
        }
    });
    
    console.log('🎨 Advanced UI initialized');
});

// ========================================
// 📱 반응형 처리
// ========================================
window.addEventListener('resize', () => {
    // 모바일에서는 3D 효과 비활성화
    if (window.innerWidth < 768) {
        document.querySelectorAll('.card-3d, .glass-card').forEach(card => {
            card.style.transform = 'none';
        });
    }
});
