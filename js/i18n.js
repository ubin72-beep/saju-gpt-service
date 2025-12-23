  1	/**
     2	 * 🌍 글로벌 사주 천년지기 - 다국어 지원 시스템
     3	 * AI 사주를 전 세계로! K-사주의 세계화
     4	 */
     5	
     6	// 현재 언어 (기본: 한국어)
     7	let currentLanguage = localStorage.getItem('saju_language') || 'ko';
     8	
     9	// 지원 언어 목록
    10	const supportedLanguages = {
    11	    ko: { name: '한국어', flag: '🇰🇷', direction: 'ltr' },
    12	    en: { name: 'English', flag: '🇺🇸', direction: 'ltr' },
    13	    zh: { name: '中文', flag: '🇨🇳', direction: 'ltr' },
    14	    ja: { name: '日本語', flag: '🇯🇵', direction: 'ltr' }
    15	};
    16	
    17	// 번역 데이터베이스
    18	const translations = {
    19	    nav: {
    20	        home: { ko: '홈', en: 'Home', zh: '首页', ja: 'ホーム' },
    21	        services: { ko: '서비스', en: 'Services', zh: '服务', ja: 'サービス' },
    22	        aiChat: { ko: 'AI 상담', en: 'AI Consultation', zh: 'AI咨询', ja: 'AI相談' },
    23	        myInfo: { ko: '내 정보', en: 'My Info', zh: '我的信息', ja: 'マイページ' }
    24	    },
    25	    hero: {
    26	        badge: { ko: '60년 만의 특별한 해', en: 'Once in 60 Years', zh: '60年一遇的特殊年份', ja: '60年に一度の特別な年' },
    27	        yearName: {
    28	            ko: '병오년 <span class="hanja">丙午年</span>',
    29	            en: 'Byeong-O Year <span class="hanja">丙午年</span>',
    30	            zh: '丙午年 <span class="hanja">丙午年</span>',
    31	            ja: '丙午年 <span class="hanja">丙午年</span>'
    32	        },
    33	        subtitle: { ko: '붉은 불의 말띠 해', en: 'Year of the Red Fire Horse', zh: '红火马年', ja: '赤い火の馬年' },
    34	        description: {
    35	            ko: '1000년의 지혜와 함께하는 명리학의 만세력<br>정통 명리학과 AI 기술로 당신의 운명을 밝혀드립니다',
    36	            en: 'The 10,000-year calendar with 1000 years of wisdom<br>Discover your destiny with authentic astrology and AI technology',
    37	            zh: '拥有千年智慧的万年历<br>用正统命理学和AI技术揭示您的命运',
    38	            ja: '千年の知恵とともに歩む命理学の万歳暦<br>正統派命理学とAI技術であなたの運命を明らかにします'
    39	        },
    40	        freeSaju: { ko: '무료로 사주 보기', en: 'Free Saju Reading', zh: '免费查看四柱', ja: '無料で四柱推命' },
    41	        aiConsult: { ko: 'AI 상담 시작', en: 'Start AI Chat', zh: '开始AI咨询', ja: 'AI相談開始' }
    42	    },
    43	    trust: {
    44	        usersNow: { ko: '명이 지금 이용중', en: 'users now', zh: '人正在使用', ja: '人が利用中' },
    45	        todayComplete: { ko: '오늘 상담 완료', en: 'consultations today', zh: '今日咨询完成', ja: '今日の相談完了' },
    46	        satisfaction: { ko: '고객 만족도', en: 'customer satisfaction', zh: '客户满意度', ja: '顧客満足度' }
    47	    },
    48	    form: {
    49	        title: { ko: '사주팔자 무료 보기', en: 'Free Saju Reading', zh: '免费查看四柱八字', ja: '無料四柱推命' },
    50	        submit: { ko: '내 운세 확인하기', en: 'Check My Fortune', zh: '查看我的运势', ja: '私の運勢を確認' }
    51	    },
    52	    services: {
    53	        title: { ko: '프리미엄 서비스', en: 'Premium Services', zh: '高级服务', ja: 'プレミアムサービス' }
    54	    },
    55	    celebrity: {
    56	        title: { ko: '유명인 사주 보기', en: 'Celebrity Saju', zh: '名人四柱', ja: '有名人の四柱' }
    57	    },
    58	    review: {
    59	        title: { ko: '고객 후기', en: 'Customer Reviews', zh: '客户评价', ja: 'お客様の声' },
    60	        count: { ko: '12,847개의 리뷰', en: '12,847 Reviews', zh: '12,847条评论', ja: '12,847件のレビュー' }
    61	    },
    62	    faq: {
    63	        title: { ko: '자주 묻는 질문', en: 'FAQ', zh: '常见问题', ja: 'よくある質問' }
    64	    },
    65	    birthTimes: {
    66	        ja: { ko: '자시 (23:00-01:00)', en: 'Ja (23:00-01:00)', zh: '子时 (23:00-01:00)', ja: '子時 (23:00-01:00)' },
    67	        chuk: { ko: '축시 (01:00-03:00)', en: 'Chuk (01:00-03:00)', zh: '丑时 (01:00-03:00)', ja: '丑時 (01:00-03:00)' },
    68	        in: { ko: '인시 (03:00-05:00)', en: 'In (03:00-05:00)', zh: '寅时 (03:00-05:00)', ja: '寅時 (03:00-05:00)' },
    69	        myo: { ko: '묘시 (05:00-07:00)', en: 'Myo (05:00-07:00)', zh: '卯时 (05:00-07:00)', ja: '卯時 (05:00-07:00)' },
    70	        jin: { ko: '진시 (07:00-09:00)', en: 'Jin (07:00-09:00)', zh: '辰时 (07:00-09:00)', ja: '辰時 (07:00-09:00)' },
    71	        sa: { ko: '사시 (09:00-11:00)', en: 'Sa (09:00-11:00)', zh: '巳时 (09:00-11:00)', ja: '巳時 (09:00-11:00)' },
    72	        o: { ko: '오시 (11:00-13:00)', en: 'O (11:00-13:00)', zh: '午时 (11:00-13:00)', ja: '午時 (11:00-13:00)' },
    73	        mi: { ko: '미시 (13:00-15:00)', en: 'Mi (13:00-15:00)', zh: '未时 (13:00-15:00)', ja: '未時 (13:00-15:00)' },
    74	        sin: { ko: '신시 (15:00-17:00)', en: 'Sin (15:00-17:00)', zh: '申时 (15:00-17:00)', ja: '申時 (15:00-17:00)' },
    75	        yu: { ko: '유시 (17:00-19:00)', en: 'Yu (17:00-19:00)', zh: '酉时 (17:00-19:00)', ja: '酉時 (17:00-19:00)' },
    76	        sul: { ko: '술시 (19:00-21:00)', en: 'Sul (19:00-21:00)', zh: '戌时 (19:00-21:00)', ja: '戌時 (19:00-21:00)' },
    77	        hae: { ko: '해시 (21:00-23:00)', en: 'Hae (21:00-23:00)', zh: '亥时 (21:00-23:00)', ja: '亥時 (21:00-23:00)' }
    78	    },
    79	    serviceCards: {
    80	        compatibility: {
    81	            title: { ko: '궁합 분석', en: 'Compatibility Analysis', zh: '婚配分析', ja: '相性分析' },
    82	            description: { ko: '두 사람의 사주를 비교하여 궁합을 상세히 분석해드립니다', en: 'Detailed compatibility analysis by comparing two Saju charts', zh: '比较两人的四柱，详细分析婚配', ja: '二人の四柱を比較し、相性を詳細に分析します' }
    83	        },
    84	        tojeong: {
    85	            title: { ko: '토정비결 2026', en: 'Tojeong 2026', zh: '土亭秘诀 2026', ja: '土亭秘訣 2026' },
    86	            description: { ko: '2026년 병오년 신년운세를 토정비결로 확인하세요', en: 'Check your 2026 Fire Horse year fortune with Tojeong', zh: '用土亭秘诀查看2026年丙午年新年运势', ja: '土亭秘訣で2026年丙午年の新年運勢を確認' }
    87	        },
    88	        dream: {
    89	            title: { ko: 'AI 꿈해몽', en: 'AI Dream Analysis', zh: 'AI解梦', ja: 'AI夢占い' },
    90	            description: { ko: 'AI가 당신의 꿈을 분석하고 의미를 해석해드립니다', en: 'AI analyzes your dreams and interprets their meanings', zh: 'AI分析您的梦境并解释其意义', ja: 'AIがあなたの夢を分析し、意味を解釈します' }
    91	        },
    92	        naming: {
    93	            title: { ko: '작명/개명', en: 'Name Analysis', zh: '起名/改名', ja: '命名/改名' },
    94	            description: { ko: '사주에 맞는 최적의 이름을 추천해드립니다', en: 'Recommend the best name suited to your Saju', zh: '推荐适合您四柱的最佳名字', ja: 'あなたの四柱に最適な名前を推薦します' }
    95	        },
    96	        wealth: {
    97	            title: { ko: '재물운 그래프', en: 'Wealth Fortune Graph', zh: '财运图表', ja: '金運グラフ' },
    98	            description: { ko: '평생 재물운의 흐름을 그래프로 확인하세요', en: 'View your lifetime wealth fortune flow in a graph', zh: '用图表查看一生的财运流向', ja: '生涯の金運の流れをグラフで確認' }
    99	        },
   100	        career: {
   101	            title: { ko: '직업 적성 매칭', en: 'Career Aptitude Matching', zh: '职业性向匹配', ja: '職業適性マッチング' },
   102	            description: { ko: '사주로 보는 나에게 맞는 직업과 진로', en: 'Find the right career and path based on your Saju', zh: '根据四柱查看适合您的职业和方向', ja: '四柱から見るあなたに合った職業と進路' }
   103	        },
   104	        taekil: {
   105	            title: { ko: '이사/결혼 택일', en: 'Date Selection', zh: '搬家/结婚择日', ja: '引越し/結婚日選定' },
   106	            description: { ko: '중요한 날을 위한 최적의 날짜를 찾아드립니다', en: 'Find the optimal date for your important events', zh: '为重要日子选择最佳日期', ja: '重要な日のために最適な日付を選定します' }
   107	        },
   108	        premium: {
   109	            title: { ko: '프리미엄 분석', en: 'Premium Analysis', zh: '高级分析', ja: 'プレミアム分析' },
   110	            description: { ko: '전문가의 상세한 사주 분석 리포트 (PDF)', en: 'Expert detailed Saju analysis report (PDF)', zh: '专家详细四柱分析报告 (PDF)', ja: '専門家による詳細な四柱分析レポート (PDF)' }
   111	        },
   112	        aiChat: {
   113	            title: { ko: '24시간 AI 상담', en: '24/7 AI Consultation', zh: '24小时AI咨询', ja: '24時間AI相談' },
   114	            description: { ko: '언제든지 AI와 실시간으로 운세 상담', en: 'Real-time fortune consultation with AI anytime', zh: '随时与AI进行实时运势咨询', ja: 'いつでもAIとリアルタイムで運勢相談' }
   115	        }
   116	    },
   117	    faqItems: {
   118	        q1: {
   119	            question: { ko: 'Q. 정말 무료인가요?', en: 'Q. Is it really free?', zh: 'Q. 真的免费吗？', ja: 'Q. 本当に無料ですか？' },
   120	            answer: { ko: '네, 기본 사주 해석, 궁합 분석, 토정비결, 꿈해몽, AI 상담 등 대부분의 서비스가 완전 무료입니다. 프리미엄 분석과 일부 특수 서비스만 유료입니다.', en: 'Yes, most services including basic Saju reading, compatibility analysis, Tojeong, dream analysis, and AI consultation are completely free. Only premium analysis and some special services are paid.', zh: '是的，基本四柱解读、婚配分析、土亭秘诀、解梦、AI咨询等大部分服务完全免费。只有高级分析和部分特殊服务是付费的。', ja: 'はい、基本的な四柱推命、相性分析、土亭秘訣、夢占い、AI相談など、ほとんどのサービスは完全無料です。プレミアム分析と一部の特別サービスのみ有料です。' }
   121	        },
   122	        q2: {
   123	            question: { ko: 'Q. 출생 시간을 모르면 어떻게 하나요?', en: 'Q. What if I don\'t know my birth time?', zh: 'Q. 如果不知道出生时间怎么办？', ja: 'Q. 生まれた時刻が分からない場合は？' },
   124	            answer: { ko: '출생 시간을 모르셔도 괜찮습니다. 생년월일만으로도 충분히 상세한 사주 분석이 가능합니다. 다만 시주(時柱)를 포함한 더 정밀한 분석을 원하시면 출생 시간을 입력해주세요.', en: 'It\'s okay if you don\'t know your birth time. Detailed Saju analysis is possible with just your birth date. However, if you want more precise analysis including the hour pillar, please enter your birth time.', zh: '不知道出生时间也没关系。仅凭出生日期就可以进行详细的四柱分析。但是，如果您想要包括时柱在内的更精确分析，请输入出生时间。', ja: '生まれた時刻が分からなくても大丈夫です。生年月日だけでも十分詳細な四柱推命が可能です。ただし、時柱を含むより精密な分析をご希望の場合は、生まれた時刻を入力してください。' }
   125	        },
   126	        q3: {
   127	            question: { ko: 'Q. AI 사주 해석이 정확한가요?', en: 'Q. Is AI Saju interpretation accurate?', zh: 'Q. AI四柱解读准确吗？', ja: 'Q. AI四柱推命は正確ですか？' },
   128	            answer: { ko: '저희 AI는 1000년 전통 명리학 데이터와 수만 건의 실제 사례를 학습했습니다. 98.7%의 높은 고객 만족도가 이를 증명합니다. 전통 명리학 이론을 기반으로 하되, AI의 빠른 처리 능력으로 더욱 상세한 분석을 제공합니다.', en: 'Our AI has learned from 1000 years of traditional astrology data and tens of thousands of real cases. A high customer satisfaction rate of 98.7% proves this. Based on traditional astrology theory, we provide even more detailed analysis with AI\'s fast processing capabilities.', zh: '我们的AI学习了1000年传统命理学数据和数万个真实案例。98.7%的高客户满意度证明了这一点。基于传统命理学理论，通过AI的快速处理能力提供更详细的分析。', ja: '当社のAIは、1000年の伝統的な命理学データと数万件の実際の事例を学習しました。98.7%の高い顧客満足度がこれを証明しています。伝統的な命理学理論を基に、AIの高速処理能力でより詳細な分析を提供します。' }
   129	        },
   130	        q4: {
   131	            question: { ko: 'Q. 개인정보는 안전한가요?', en: 'Q. Is my personal information safe?', zh: 'Q. 个人信息安全吗？', ja: 'Q. 個人情報は安全ですか？' },
   132	            answer: { ko: '고객님의 개인정보는 철저히 보호됩니다. 입력하신 정보는 암호화되어 저장되며, 사주 해석 목적 외에는 절대 사용되지 않습니다. 또한 제3자에게 제공되지 않습니다.', en: 'Your personal information is thoroughly protected. The information you enter is encrypted and stored, and is never used for purposes other than Saju interpretation. It is also not provided to third parties.', zh: '您的个人信息得到严格保护。您输入的信息会被加密存储，绝不会用于四柱解读以外的目的。也不会提供给第三方。', ja: 'お客様の個人情報は徹底的に保護されます。入力された情報は暗号化されて保存され、四柱推命の目的以外には絶対に使用されません。また、第三者に提供されることもありません。' }
   133	        },
   134	        q5: {
   135	            question: { ko: 'Q. 프리미엄 서비스는 어떤 차이가 있나요?', en: 'Q. What\'s the difference with premium services?', zh: 'Q. 高级服务有什么区别？', ja: 'Q. プレミアムサービスはどう違いますか？' },
   136	            answer: { ko: '프리미엄 서비스는 전문 명리학자의 검토를 거친 상세 분석 리포트를 PDF로 제공합니다. 일반 분석보다 3~5배 더 상세하며, 구체적인 조언과 시기별 운세 그래프가 포함됩니다.', en: 'Premium services provide a detailed analysis report reviewed by professional astrologers in PDF format. It is 3-5 times more detailed than regular analysis and includes specific advice and fortune graphs by period.', zh: '高级服务提供经过专业命理学家审核的详细分析报告（PDF格式）。比普通分析详细3-5倍，包含具体建议和各时期运势图表。', ja: 'プレミアムサービスは、専門の命理学者のレビューを経た詳細な分析レポートをPDF形式で提供します。一般的な分析より3〜5倍詳しく、具体的なアドバイスと時期別の運勢グラフが含まれます。' }
   137	        }
   138	    },
   139	    priceLabels: {
   140	        free: { ko: '무료', en: 'Free', zh: '免费', ja: '無料' }
   141	    }
   142	};
   143	
   144	// 번역 함수
   145	function t(key) {
   146	    const keys = key.split('.');
   147	    let value = translations;
   148	    for (const k of keys) {
   149	        value = value[k];
   150	        if (!value) return key;
   151	    }
   152	    return value[currentLanguage] || value['ko'] || key;
   153	}
   154	
   155	// 언어 변경
   156	function changeLanguage(lang) {
   157	    if (!supportedLanguages[lang]) {
   158	        console.error('Unsupported language:', lang);
   159	        return;
   160	    }
   161	    currentLanguage = lang;
   162	    localStorage.setItem('saju_language', lang);
   163	    updatePageLanguage();
   164	    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
   165	}
   166	
   167	// 페이지 언어 업데이트
   168	function updatePageLanguage() {
   169	    document.querySelectorAll('[data-i18n]').forEach(element => {
   170	        const key = element.getAttribute('data-i18n');
   171	        const translation = t(key);
   172	        if (element.hasAttribute('placeholder')) {
   173	            element.placeholder = translation;
   174	        } else {
   175	            element.textContent = translation;
   176	        }
   177	    });
   178	    document.querySelectorAll('[data-i18n-html]').forEach(element => {
   179	        const key = element.getAttribute('data-i18n-html');
   180	        const translation = t(key);
   181	        element.innerHTML = translation;
   182	    });
   183	    document.documentElement.lang = currentLanguage;
   184	    document.documentElement.dir = supportedLanguages[currentLanguage].direction;
   185	}
   186	
   187	// 언어 선택 UI 생성
   188	function createLanguageSwitcher() {
   189	    const switcher = document.createElement('div');
   190	    switcher.className = 'language-switcher';
   191	    switcher.innerHTML = `
   192	        <button class="lang-btn" id="langBtn">
   193	            <span class="lang-flag">${supportedLanguages[currentLanguage].flag}</span>
   194	            <span class="lang-name">${supportedLanguages[currentLanguage].name}</span>
   195	            <i class="fas fa-chevron-down"></i>
   196	        </button>
   197	        <div class="lang-dropdown" id="langDropdown">
   198	            ${Object.entries(supportedLanguages).map(([code, info]) => `
   199	                <button class="lang-option ${code === currentLanguage ? 'active' : ''}" data-lang="${code}">
   200	                    <span class="lang-flag">${info.flag}</span>
   201	                    <span class="lang-name">${info.name}</span>
   202	                    ${code === currentLanguage ? '<i class="fas fa-check"></i>' : ''}
   203	                </button>
   204	            `).join('')}
   205	        </div>
   206	    `;
   207	    return switcher;
   208	}
   209	
   210	// 초기화
   211	function initI18n() {
   212	    updatePageLanguage();
   213	    setTimeout(function() {
   214	        const container = document.getElementById('languageSwitcherContainer');
   215	        if (container) {
   216	            const existing = container.querySelector('.language-switcher');
   217	            if (existing) {
   218	                existing.remove();
   219	            }
   220	            const switcher = createLanguageSwitcher();
   221	            container.appendChild(switcher);
   222	            const langBtn = document.getElementById('langBtn');
   223	            const langDropdown = document.getElementById('langDropdown');
   224	            if (langBtn && langDropdown) {
   225	                langBtn.addEventListener('click', function(e) {
   226	                    e.stopPropagation();
   227	                    langDropdown.classList.toggle('active');
   228	                });
   229	                document.querySelectorAll('.lang-option').forEach(function(btn) {
   230	                    btn.addEventListener('click', function() {
   231	                        const lang = btn.getAttribute('data-lang');
   232	                        changeLanguage(lang);
   233	                        langDropdown.classList.remove('active');
   234	                    });
   235	                });
   236	                document.addEventListener('click', function(e) {
   237	                    if (!switcher.contains(e.target)) {
   238	                        langDropdown.classList.remove('active');
   239	                    }
   240	                });
   241	            }
   242	        } else {
   243	            console.warn('languageSwitcherContainer not found');
   244	        }
   245	    }, 100);
   246	}
   247	
   248	// DOMContentLoaded 시 자동 초기화
   249	if (document.readyState === 'loading') {
   250	    document.addEventListener('DOMContentLoaded', initI18n);
   251	} else {
   252	    initI18n();
   253	}
   254	
   255	// Export
   256	window.i18n = {
   257	    t: t,
   258	    changeLanguage: changeLanguage,
   259	    currentLanguage: function() { return currentLanguage; },
   260	    supportedLanguages: supportedLanguages,
   261	    updatePageLanguage: updatePageLanguage
   262	};
   263	
