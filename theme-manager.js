 1	/**
     2	 * 다크 모드 & 고급 UI 인터랙션
     3	 * 2026 병오년 만세력
     4	 */
     5	
     6	// ========================================
     7	// 🌙 다크 모드 시스템
     8	// ========================================
     9	class ThemeManager {
    10	    constructor() {
    11	        this.theme = localStorage.getItem('theme') || 'light';
    12	        this.init();
    13	    }
    14	
    15	    init() {
    16	        // 시스템 테마 자동 감지
    17	        if (!localStorage.getItem('theme')) {
    18	            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    19	            this.theme = prefersDark ? 'dark' : 'light';
    20	        }
    21	        
    22	        this.applyTheme();
    23	        this.createToggleButton();
    24	        this.watchSystemTheme();
    25	    }
    26	
    27	    applyTheme() {
    28	        document.documentElement.setAttribute('data-theme', this.theme);
    29	        localStorage.setItem('theme', this.theme);
    30	        
    31	        // 메타 테마 컬러 업데이트
    32	        const metaTheme = document.querySelector('meta[name="theme-color"]');
    33	        if (metaTheme) {
    34	            metaTheme.content = this.theme === 'dark' ? '#0f0f0f' : '#ffffff';
    35	        }
    36	    }
    37	
    38	    toggle() {
    39	        this.theme = this.theme === 'light' ? 'dark' : 'light';
    40	        this.applyTheme();
    41	        
    42	        // 애니메이션 효과
    43	        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    44	    }
    45	
    46	    createToggleButton() {
    47	        const navbar = document.querySelector('.navbar .container');
    48	        if (!navbar) return;
    49	
    50	        const existingToggle = document.querySelector('.theme-toggle');
    51	        if (existingToggle) return;
    52	
    53	        const toggleBtn = document.createElement('button');
    54	        toggleBtn.className = 'theme-toggle';
    55	        toggleBtn.setAttribute('aria-label', '다크 모드 토글');
    56	        toggleBtn.innerHTML = `
    57	            <div class="theme-toggle-slider">
    58	                <i class="fas fa-${this.theme === 'dark' ? 'moon' : 'sun'}"></i>
    59	            </div>
    60	        `;
    61	
    62	        // 네비게이션 액션 영역에 추가
    63	        const navActions = navbar.querySelector('.nav-actions') || navbar;
    64	        navActions.appendChild(toggleBtn);
    65	
    66	        toggleBtn.addEventListener('click', () => {
    67	            this.toggle();
    68	            const icon = toggleBtn.querySelector('i');
    69	            icon.className = `fas fa-${this.theme === 'dark' ? 'moon' : 'sun'}`;
    70	        });
    71	    }
    72	
    73	    watchSystemTheme() {
    74	        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    75	            if (!localStorage.getItem('theme')) {
    76	                this.theme = e.matches ? 'dark' : 'light';
    77	                this.applyTheme();
    78	            }
    79	        });
    80	    }
    81	}
    82	
    83	// ========================================
    84	// ✨ 스크롤 기반 애니메이션
    85	// ========================================
    86	class ScrollAnimations {
    87	    constructor() {
    88	        this.observer = null;
    89	        this.init();
    90	    }
    91	
    92	    init() {
    93	        const options = {
    94	            root: null,
    95	            rootMargin: '0px',
    96	            threshold: 0.1
    97	        };
    98	
    99	        this.observer = new IntersectionObserver((entries) => {
   100	            entries.forEach(entry => {
   101	                if (entry.isIntersecting) {
   102	                    entry.target.classList.add('revealed');
   103	                }
   104	            });
   105	        }, options);
   106	
   107	        // 모든 애니메이션 요소 관찰
   108	        document.querySelectorAll('.scroll-reveal, .stagger-item').forEach(el => {
   109	            this.observer.observe(el);
   110	        });
   111	    }
   112	
   113	    refresh() {
   114	        // 동적으로 추가된 요소 재관찰
   115	        document.querySelectorAll('.scroll-reveal:not(.revealed)').forEach(el => {
   116	            this.observer.observe(el);
   117	        });
   118	    }
   119	}
   120	
   121	// ========================================
   122	// 🎨 고급 카드 3D 효과
   123	// ========================================
   124	function initCard3DEffect() {
   125	    const cards = document.querySelectorAll('.card-3d, .glass-card, .service-card-advanced');
   126	    
   127	    cards.forEach(card => {
   128	        card.addEventListener('mousemove', (e) => {
   129	            const rect = card.getBoundingClientRect();
   130	            const x = e.clientX - rect.left;
   131	            const y = e.clientY - rect.top;
   132	            
   133	            const centerX = rect.width / 2;
   134	            const centerY = rect.height / 2;
   135	            
   136	            const rotateX = (y - centerY) / 10;
   137	            const rotateY = (centerX - x) / 10;
   138	            
   139	            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
   140	        });
   141	        
   142	        card.addEventListener('mouseleave', () => {
   143	            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
   144	        });
   145	    });
   146	}
   147	
   148	// ========================================
   149	// 🌊 Parallax 스크롤 효과
   150	// ========================================
   151	function initParallaxEffect() {
   152	    const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-section');
   153	    
   154	    window.addEventListener('scroll', () => {
   155	        const scrolled = window.pageYOffset;
   156	        
   157	        parallaxElements.forEach(el => {
   158	            const speed = el.dataset.speed || 0.5;
   159	            const yPos = -(scrolled * speed);
   160	            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
   161	        });
   162	    });
   163	}
   164	
   165	// ========================================
   166	// 💫 부드러운 스크롤
   167	// ========================================
   168	function initSmoothScroll() {
   169	    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   170	        anchor.addEventListener('click', function (e) {
   171	            const href = this.getAttribute('href');
   172	            if (href === '#' || !href) return;
   173	            
   174	            e.preventDefault();
   175	            const target = document.querySelector(href);
   176	            
   177	            if (target) {
   178	                target.scrollIntoView({
   179	                    behavior: 'smooth',
   180	                    block: 'start'
   181	                });
   182	            }
   183	        });
   184	    });
   185	}
   186	
   187	// ========================================
   188	// 🎭 로딩 스켈레톤 제거
   189	// ========================================
   190	function removeSkeletons() {
   191	    setTimeout(() => {
   192	        document.querySelectorAll('.skeleton').forEach(skeleton => {
   193	            skeleton.classList.remove('skeleton');
   194	            skeleton.classList.add('fade-in');
   195	        });
   196	    }, 500);
   197	}
   198	
   199	// ========================================
   200	// 🔔 실시간 알림 시스템
   201	// ========================================
   202	class NotificationSystem {
   203	    constructor() {
   204	        this.container = null;
   205	        this.notifications = [
   206	            { icon: '🎉', text: '김*진님이 프리미엄 구독을 시작했습니다', time: '방금 전' },
   207	            { icon: '⭐', text: '이*희님이 사주팔자를 조회했습니다', time: '1분 전' },
   208	            { icon: '💰', text: '박*수님이 궁합 분석을 구매했습니다', time: '3분 전' },
   209	            { icon: '🎯', text: '최*영님이 토정비결을 이용했습니다', time: '5분 전' },
   210	            { icon: '✨', text: '정*민님이 AI 상담을 시작했습니다', time: '7분 전' }
   211	        ];
   212	        this.init();
   213	    }
   214	
   215	    init() {
   216	        this.createContainer();
   217	        this.startNotifications();
   218	    }
   219	
   220	    createContainer() {
   221	        if (document.querySelector('.live-notifications')) return;
   222	        
   223	        this.container = document.createElement('div');
   224	        this.container.className = 'live-notifications';
   225	        document.body.appendChild(this.container);
   226	    }
   227	
   228	    showNotification(notification) {
   229	        const notif = document.createElement('div');
   230	        notif.className = 'live-notification';
   231	        notif.innerHTML = `
   232	            <span class="notification-icon">${notification.icon}</span>
   233	            <div class="notification-content">
   234	                <div class="notification-text">${notification.text}</div>
   235	                <div class="notification-time">${notification.time}</div>
   236	            </div>
   237	        `;
   238	        
   239	        this.container.appendChild(notif);
   240	        
   241	        // 등장 애니메이션
   242	        setTimeout(() => {
   243	            notif.style.transform = 'translateX(0)';
   244	            notif.style.opacity = '1';
   245	        }, 100);
   246	        
   247	        // 5초 후 제거
   248	        setTimeout(() => {
   249	            notif.style.transform = 'translateX(400px)';
   250	            notif.style.opacity = '0';
   251	            setTimeout(() => notif.remove(), 500);
   252	        }, 5000);
   253	    }
   254	
   255	    startNotifications() {
   256	        let index = 0;
   257	        
   258	        // 10초마다 알림 표시
   259	        setInterval(() => {
   260	            if (this.container && this.container.children.length < 3) {
   261	                this.showNotification(this.notifications[index]);
   262	                index = (index + 1) % this.notifications.length;
   263	            }
   264	        }, 10000);
   265	        
   266	        // 첫 알림은 3초 후
   267	        setTimeout(() => {
   268	            this.showNotification(this.notifications[0]);
   269	        }, 3000);
   270	    }
   271	}
   272	
   273	// ========================================
   274	// 🚀 초기화
   275	// ========================================
   276	document.addEventListener('DOMContentLoaded', () => {
   277	    // 다크 모드 초기화
   278	    const themeManager = new ThemeManager();
   279	    
   280	    // 스크롤 애니메이션 초기화
   281	    const scrollAnimations = new ScrollAnimations();
   282	    
   283	    // 3D 카드 효과
   284	    initCard3DEffect();
   285	    
   286	    // Parallax 효과
   287	    initParallaxEffect();
   288	    
   289	    // 부드러운 스크롤
   290	    initSmoothScroll();
   291	    
   292	    // 스켈레톤 제거
   293	    removeSkeletons();
   294	    
   295	    // 실시간 알림 (메인 페이지에서만)
   296	    if (document.body.classList.contains('home-page') || window.location.pathname === '/index.html' || window.location.pathname === '/') {
   297	        new NotificationSystem();
   298	    }
   299	    
   300	    // 스크롤 애니메이션 클래스 자동 추가
   301	    document.querySelectorAll('.service-card, .feature-item, .review-card').forEach((el, index) => {
   302	        if (!el.classList.contains('stagger-item')) {
   303	            el.classList.add('scroll-reveal');
   304	            el.style.transitionDelay = `${index * 0.1}s`;
   305	        }
   306	    });
   307	    
   308	    console.log('🎨 Advanced UI initialized');
   309	});
   310	
   311	// ========================================
   312	// 📱 반응형 처리
   313	// ========================================
   314	window.addEventListener('resize', () => {
   315	    // 모바일에서는 3D 효과 비활성화
   316	    if (window.innerWidth < 768) {
   317	        document.querySelectorAll('.card-3d, .glass-card').forEach(card => {
   318	            card.style.transform = 'none';
   319	        });
   320	    }
   321	});
   322	
