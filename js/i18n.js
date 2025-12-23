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
    19	    // 🏠 메인 페이지
    20	    nav: {
    21	        home: {
    22	            ko: '홈',
    23	            en: 'Home',
    24	            zh: '首页',
    25	            ja: 'ホーム'
    26	        },
    27	        services: {
    28	            ko: '서비스',
    29	            en: 'Services',
    30	            zh: '服务',
    31	            ja: 'サービス'
    32	        },
    33	        pricing: {
    34	            ko: '가격표',
    35	            en: 'Pricing',
    36	            zh: '价格',
    37	            ja: '料金'
    38	        },
    39	        aiChat: {
    40	            ko: 'AI 상담',
    41	            en: 'AI Consultation',
    42	            zh: 'AI咨询',
    43	            ja: 'AI相談'
    44	        },
    45	        login: {
    46	            ko: '로그인',
    47	            en: 'Login',
    48	            zh: '登录',
    49	            ja: 'ログイン'
    50	        },
    51	        myInfo: {
    52	            ko: '내 정보',
    53	            en: 'My Info',
    54	            zh: '我的信息',
    55	            ja: 'マイページ'
    56	        }
    57	    },
    58	
    59	    // 🎯 히어로 섹션
    60	    hero: {
    61	        badge: {
    62	            ko: '60년 만의 특별한 해',
    63	            en: 'Once in 60 Years',
    64	            zh: '60年一遇的特殊年份',
    65	            ja: '60年に一度の特別な年'
    66	        },
    67	        year2026: {
    68	            ko: '2026 병오년 丙午年',
    69	            en: '2026 Year of Fire Horse',
    70	            zh: '2026年丙午年',
    71	            ja: '2026年丙午年'
    72	        },
    73	        yearName: {
    74	            ko: '병오년 <span class="hanja">丙午年</span>',
    75	            en: 'Byeong-O Year <span class="hanja">丙午年</span>',
    76	            zh: '丙午年 <span class="hanja">丙午年</span>',
    77	            ja: '丙午年 <span class="hanja">丙午年</span>'
    78	        },
    79	        subtitle: {
    80	            ko: '붉은 불의 말띠 해',
    81	            en: 'Year of the Red Fire Horse',
    82	            zh: '红火马年',
    83	            ja: '赤い火の馬年'
    84	        },
    85	        description: {
    86	            ko: '1000년의 지혜와 함께하는 명리학의 만세력<br>정통 명리학과 AI 기술로 당신의 운명을 밝혀드립니다',
    87	            en: 'The 10,000-year calendar with 1000 years of wisdom<br>Discover your destiny with authentic astrology and AI technology',
    88	            zh: '拥有千年智慧的万年历<br>用正统命理学和AI技术揭示您的命运',
    89	            ja: '千年の知恵とともに歩む命理学の万歳暦<br>正統派命理学とAI技術であなたの運命を明らかにします'
    90	        },
    91	        freeSaju: {
    92	            ko: '무료로 사주 보기',
    93	            en: 'Free Saju Reading',
    94	            zh: '免费查看四柱',
    95	            ja: '無料で四柱推命'
    96	        },
    97	        aiConsult: {
    98	            ko: 'AI 상담 시작',
    99	            en: 'Start AI Chat',
   100	            zh: '开始AI咨询',
   101	            ja: 'AI相談開始'
   102	        }
   103	    },
   104	
   105	    // 📊 통계
   106	    stats: {
   107	        users: {
   108	            ko: '누적 사용자',
   109	            en: 'Total Users',
   110	            zh: '累计用户',
   111	            ja: '累計ユーザー'
   112	        },
   113	        rating: {
   114	            ko: '평균 평점',
   115	            en: 'Average Rating',
   116	            zh: '平均评分',
   117	            ja: '平均評価'
   118	        },
   119	        support: {
   120	            ko: 'AI 상담 가능',
   121	            en: 'AI Support Available',
   122	            zh: 'AI咨询可用',
   123	            ja: 'AI相談可能'
   124	        }
   125	    },
   126	
   127	    // 🔥 신뢰 지표
   128	    trust: {
   129	        usersNow: {
   130	            ko: '명이 지금 이용중',
   131	            en: 'users now',
   132	            zh: '人正在使用',
   133	            ja: '人が利用中'
   134	        },
   135	        todayComplete: {
   136	            ko: '오늘 상담 완료',
   137	            en: 'consultations today',
   138	            zh: '今日咨询完成',
   139	            ja: '今日の相談完了'
   140	        },
   141	        satisfaction: {
   142	            ko: '고객 만족도',
   143	            en: 'customer satisfaction',
   144	            zh: '客户满意度',
   145	            ja: '顧客満足度'
   146	        }
   147	    },
   148	
   149	    // 📋 폼
   150	    form: {
   151	        title: {
   152	            ko: '사주팔자 무료 보기',
   153	            en: 'Free Saju Reading',
   154	            zh: '免费查看四柱八字',
   155	            ja: '無料四柱推命'
   156	        },
   157	        submit: {
   158	            ko: '내 운세 확인하기',
   159	            en: 'Check My Fortune',
   160	            zh: '查看我的运势',
   161	            ja: '私の運勢を確認'
   162	        }
   163	    },
   164	
   165	    // 🎴 서비스
   166	    services: {
   167	        title: {
   168	            ko: '프리미엄 서비스',
   169	            en: 'Premium Services',
   170	            zh: '高级服务',
   171	            ja: 'プレミアムサービス'
   172	        }
   173	    },
   174	
   175	    // 🎬 유명인
   176	    celebrity: {
   177	        title: {
   178	            ko: '유명인 사주 보기',
   179	            en: 'Celebrity Saju',
   180	            zh: '名人四柱',
   181	            ja: '有名人の四柱'
   182	        }
   183	    },
   184	
   185	    // ⭐ 리뷰
   186	    review: {
   187	        title: {
   188	            ko: '고객 후기',
   189	            en: 'Customer Reviews',
   190	            zh: '客户评价',
   191	            ja: 'お客様の声'
   192	        },
   193	        count: {
   194	            ko: '12,847개의 리뷰',
   195	            en: '12,847 Reviews',
   196	            zh: '12,847条评论',
   197	            ja: '12,847件のレビュー'
   198	        }
   199	    },
   200	
   201	    // ❓ FAQ
   202	    faq: {
   203	        title: {
   204	            ko: '자주 묻는 질문',
   205	            en: 'FAQ',
   206	            zh: '常见问题',
   207	            ja: 'よくある質問'
   208	        }
   209	    },
   210	
   211	    // 🎴 오행 (Five Elements)
   212	    elements: {
   213	        wood: {
   214	            ko: '목 (木)',
   215	            en: 'Wood',
   216	            zh: '木',
   217	            ja: '木'
   218	        },
   219	        fire: {
   220	            ko: '화 (火)',
   221	            en: 'Fire',
   222	            zh: '火',
   223	            ja: '火'
   224	        },
   225	        earth: {
   226	            ko: '토 (土)',
   227	            en: 'Earth',
   228	            zh: '土',
   229	            ja: '土'
   230	        },
   231	        metal: {
   232	            ko: '금 (金)',
   233	            en: 'Metal',
   234	            zh: '金',
   235	            ja: '金'
   236	        },
   237	        water: {
   238	            ko: '수 (水)',
   239	            en: 'Water',
   240	            zh: '水',
   241	            ja: '水'
   242	        }
   243	    },
   244	
   245	    // ⏰ 시간대 (12지지)
   246	    birthTimes: {
   247	        ja: {
   248	            ko: '자시 (23:00-01:00)',
   249	            en: 'Ja (23:00-01:00)',
   250	            zh: '子时 (23:00-01:00)',
   251	            ja: '子時 (23:00-01:00)'
   252	        },
   253	        chuk: {
   254	            ko: '축시 (01:00-03:00)',
   255	            en: 'Chuk (01:00-03:00)',
   256	            zh: '丑时 (01:00-03:00)',
   257	            ja: '丑時 (01:00-03:00)'
   258	        },
   259	        in: {
   260	            ko: '인시 (03:00-05:00)',
   261	            en: 'In (03:00-05:00)',
   262	            zh: '寅时 (03:00-05:00)',
   263	            ja: '寅時 (03:00-05:00)'
   264	        },
   265	        myo: {
   266	            ko: '묘시 (05:00-07:00)',
   267	            en: 'Myo (05:00-07:00)',
   268	            zh: '卯时 (05:00-07:00)',
   269	            ja: '卯時 (05:00-07:00)'
   270	        },
   271	        jin: {
   272	            ko: '진시 (07:00-09:00)',
   273	            en: 'Jin (07:00-09:00)',
   274	            zh: '辰时 (07:00-09:00)',
   275	            ja: '辰時 (07:00-09:00)'
   276	        },
   277	        sa: {
   278	            ko: '사시 (09:00-11:00)',
   279	            en: 'Sa (09:00-11:00)',
   280	            zh: '巳时 (09:00-11:00)',
   281	            ja: '巳時 (09:00-11:00)'
   282	        },
   283	        o: {
   284	            ko: '오시 (11:00-13:00)',
   285	            en: 'O (11:00-13:00)',
   286	            zh: '午时 (11:00-13:00)',
   287	            ja: '午時 (11:00-13:00)'
   288	        },
   289	        mi: {
   290	            ko: '미시 (13:00-15:00)',
   291	            en: 'Mi (13:00-15:00)',
   292	            zh: '未时 (13:00-15:00)',
   293	            ja: '未時 (13:00-15:00)'
   294	        },
   295	        sin: {
   296	            ko: '신시 (15:00-17:00)',
   297	            en: 'Sin (15:00-17:00)',
   298	            zh: '申时 (15:00-17:00)',
   299	            ja: '申時 (15:00-17:00)'
   300	        },
   301	        yu: {
   302	            ko: '유시 (17:00-19:00)',
   303	            en: 'Yu (17:00-19:00)',
   304	            zh: '酉时 (17:00-19:00)',
   305	            ja: '酉時 (17:00-19:00)'
   306	        },
   307	        sul: {
   308	            ko: '술시 (19:00-21:00)',
   309	            en: 'Sul (19:00-21:00)',
   310	            zh: '戌时 (19:00-21:00)',
   311	            ja: '戌時 (19:00-21:00)'
   312	        },
   313	        hae: {
   314	            ko: '해시 (21:00-23:00)',
   315	            en: 'Hae (21:00-23:00)',
   316	            zh: '亥时 (21:00-23:00)',
   317	            ja: '亥時 (21:00-23:00)'
   318	        }
   319	    },
   320	
   321	    // 🎴 서비스 카드
   322	    serviceCards: {
   323	        compatibility: {
   324	            title: {
   325	                ko: '궁합 분석',
   326	                en: 'Compatibility Analysis',
   327	                zh: '婚配分析',
   328	                ja: '相性分析'
   329	            },
   330	            description: {
   331	                ko: '두 사람의 사주를 비교하여 궁합을 상세히 분석해드립니다',
   332	                en: 'Detailed compatibility analysis by comparing two Saju charts',
   333	                zh: '比较两人的四柱，详细分析婚配',
   334	                ja: '二人の四柱を比較し、相性を詳細に分析します'
   335	            }
   336	        },
   337	        tojeong: {
   338	            title: {
   339	                ko: '토정비결 2026',
   340	                en: 'Tojeong 2026',
   341	                zh: '土亭秘诀 2026',
   342	                ja: '土亭秘訣 2026'
   343	            },
   344	            description: {
   345	                ko: '2026년 병오년 신년운세를 토정비결로 확인하세요',
   346	                en: 'Check your 2026 Fire Horse year fortune with Tojeong',
   347	                zh: '用土亭秘诀查看2026年丙午年新年运势',
   348	                ja: '土亭秘訣で2026年丙午年の新年運勢を確認'
   349	            }
   350	        },
   351	        dream: {
   352	            title: {
   353	                ko: 'AI 꿈해몽',
   354	                en: 'AI Dream Analysis',
   355	                zh: 'AI解梦',
   356	                ja: 'AI夢占い'
   357	            },
   358	            description: {
   359	                ko: 'AI가 당신의 꿈을 분석하고 의미를 해석해드립니다',
   360	                en: 'AI analyzes your dreams and interprets their meanings',
   361	                zh: 'AI分析您的梦境并解释其意义',
   362	                ja: 'AIがあなたの夢を分析し、意味を解釈します'
   363	            }
   364	        },
   365	        naming: {
   366	            title: {
   367	                ko: '작명/개명',
   368	                en: 'Name Analysis',
   369	                zh: '起名/改名',
   370	                ja: '命名/改名'
   371	            },
   372	            description: {
   373	                ko: '사주에 맞는 최적의 이름을 추천해드립니다',
   374	                en: 'Recommend the best name suited to your Saju',
   375	                zh: '推荐适合您四柱的最佳名字',
   376	                ja: 'あなたの四柱に最適な名前を推薦します'
   377	            }
   378	        },
   379	        wealth: {
   380	            title: {
   381	                ko: '재물운 그래프',
   382	                en: 'Wealth Fortune Graph',
   383	                zh: '财运图表',
   384	                ja: '金運グラフ'
   385	            },
   386	            description: {
   387	                ko: '평생 재물운의 흐름을 그래프로 확인하세요',
   388	                en: 'View your lifetime wealth fortune flow in a graph',
   389	                zh: '用图表查看一生的财运流向',
   390	                ja: '生涯の金運の流れをグラフで確認'
   391	            }
   392	        },
   393	        career: {
   394	            title: {
   395	                ko: '직업 적성 매칭',
   396	                en: 'Career Aptitude Matching',
   397	                zh: '职业性向匹配',
   398	                ja: '職業適性マッチング'
   399	            },
   400	            description: {
   401	                ko: '사주로 보는 나에게 맞는 직업과 진로',
   402	                en: 'Find the right career and path based on your Saju',
   403	                zh: '根据四柱查看适合您的职业和方向',
   404	                ja: '四柱から見るあなたに合った職業と進路'
   405	            }
   406	        },
   407	        taekil: {
   408	            title: {
   409	                ko: '이사/결혼 택일',
   410	                en: 'Date Selection',
   411	                zh: '搬家/结婚择日',
   412	                ja: '引越し/結婚日選定'
   413	            },
   414	            description: {
   415	                ko: '중요한 날을 위한 최적의 날짜를 찾아드립니다',
   416	                en: 'Find the optimal date for your important events',
   417	                zh: '为重要日子选择最佳日期',
   418	                ja: '重要な日のために最適な日付を選定します'
   419	            }
   420	        },
   421	        premium: {
   422	            title: {
   423	                ko: '프리미엄 분석',
   424	                en: 'Premium Analysis',
   425	                zh: '高级分析',
   426	                ja: 'プレミアム分析'
   427	            },
   428	            description: {
   429	                ko: '전문가의 상세한 사주 분석 리포트 (PDF)',
   430	                en: 'Expert detailed Saju analysis report (PDF)',
   431	                zh: '专家详细四柱分析报告 (PDF)',
   432	                ja: '専門家による詳細な四柱分析レポート (PDF)'
   433	            }
   434	        },
   435	        aiChat: {
   436	            title: {
   437	                ko: '24시간 AI 상담',
   438	                en: '24/7 AI Consultation',
   439	                zh: '24小时AI咨询',
   440	                ja: '24時間AI相談'
   441	            },
   442	            description: {
   443	                ko: '언제든지 AI와 실시간으로 운세 상담',
   444	                en: 'Real-time fortune consultation with AI anytime',
   445	                zh: '随时与AI进行实时运势咨询',
   446	                ja: 'いつでもAIとリアルタイムで運勢相談'
   447	            }
   448	        }
   449	    },
   450	
   451	    // 🔮 사주 용어
   452	    sajuTerms: {
   453	        yearPillar: {
   454	            ko: '년주',
   455	            en: 'Year Pillar',
   456	            zh: '年柱',
   457	            ja: '年柱'
   458	        },
   459	        monthPillar: {
   460	            ko: '월주',
   461	            en: 'Month Pillar',
   462	            zh: '月柱',
   463	            ja: '月柱'
   464	        },
   465	        dayPillar: {
   466	            ko: '일주',
   467	            en: 'Day Pillar',
   468	            zh: '日柱',
   469	            ja: '日柱'
   470	        },
   471	        hourPillar: {
   472	            ko: '시주',
   473	            en: 'Hour Pillar',
   474	            zh: '时柱',
   475	            ja: '時柱'
   476	        },
   477	        heaven: {
   478	            ko: '천간',
   479	            en: 'Heavenly Stem',
   480	            zh: '天干',
   481	            ja: '天干'
   482	        },
   483	        earth: {
   484	            ko: '지지',
   485	            en: 'Earthly Branch',
   486	            zh: '地支',
   487	            ja: '地支'
   488	        }
   489	    },
   490	
   491	    // 📅 입력 폼
   492	    inputForm: {
   493	        title: {
   494	            ko: '사주팔자 입력',
   495	            en: 'Enter Birth Information',
   496	            zh: '输入四柱八字',
   497	            ja: '四柱八字入力'
   498	        },
   499	        name: {
   500	            ko: '이름',
   501	            en: 'Name',
   502	            zh: '姓名',
   503	            ja: '名前'
   504	        },
   505	        namePlaceholder: {
   506	            ko: '홍길동',
   507	            en: 'Your Name',
   508	            zh: '您的姓名',
   509	            ja: 'お名前'
   510	        },
   511	        gender: {
   512	            ko: '성별',
   513	            en: 'Gender',
   514	            zh: '性别',
   515	            ja: '性別'
   516	        },
   517	        male: {
   518	            ko: '남성',
   519	            en: 'Male',
   520	            zh: '男',
   521	            ja: '男性'
   522	        },
   523	        female: {
   524	            ko: '여성',
   525	            en: 'Female',
   526	            zh: '女',
   527	            ja: '女性'
   528	        },
   529	        birthDate: {
   530	            ko: '생년월일',
   531	            en: 'Birth Date',
   532	            zh: '出生日期',
   533	            ja: '生年月日'
   534	        },
   535	        birthTime: {
   536	            ko: '태어난 시간',
   537	            en: 'Birth Time',
   538	            zh: '出生时间',
   539	            ja: '生まれた時刻'
   540	        },
   541	        unknown: {
   542	            ko: '모름',
   543	            en: 'Unknown',
   544	            zh: '不知道',
   545	            ja: '不明'
   546	        },
   547	        calendarType: {
   548	            ko: '양력/음력',
   549	            en: 'Calendar Type',
   550	            zh: '阳历/阴历',
   551	            ja: '陽暦/陰暦'
   552	        },
   553	        solar: {
   554	            ko: '양력',
   555	            en: 'Solar',
   556	            zh: '阳历',
   557	            ja: '陽暦'
   558	        },
   559	        lunar: {
   560	            ko: '음력',
   561	            en: 'Lunar',
   562	            zh: '阴历',
   563	            ja: '陰暦'
   564	        },
   565	        calculate: {
   566	            ko: '사주 보기',
   567	            en: 'Calculate',
   568	            zh: '查看四柱',
   569	            ja: '四柱を見る'
   570	        }
   571	    },
   572	
   573	    // 📊 결과 페이지
   574	    result: {
   575	        title: {
   576	            ko: '사주팔자 결과',
   577	            en: 'Saju Reading Result',
   578	            zh: '四柱八字结果',
   579	            ja: '四柱推命結果'
   580	        },
   581	        fortune2026: {
   582	            ko: '2026년 병오년 운세',
   583	            en: '2026 Fire Horse Fortune',
   584	            zh: '2026年丙午年运势',
   585	            ja: '2026年丙午年運勢'
   586	        },
   587	        elementsAnalysis: {
   588	            ko: '오행 분석',
   589	            en: 'Five Elements Analysis',
   590	            zh: '五行分析',
   591	            ja: '五行分析'
   592	        },
   593	        personality: {
   594	            ko: '성격 분석',
   595	            en: 'Personality Analysis',
   596	            zh: '性格分析',
   597	            ja: '性格分析'
   598	        },
   599	        compatibility: {
   600	            ko: '궁합 분석',
   601	            en: 'Compatibility Analysis',
   602	            zh: '婚配分析',
   603	            ja: '相性分析'
   604	        },
   605	        career: {
   606	            ko: '직업 운',
   607	            en: 'Career Fortune',
   608	            zh: '事业运',
   609	            ja: '仕事運'
   610	        },
   611	        wealth: {
   612	            ko: '재물 운',
   613	            en: 'Wealth Fortune',
   614	            zh: '财运',
   615	            ja: '金運'
   616	        },
   617	        health: {
   618	            ko: '건강 운',
   619	            en: 'Health Fortune',
   620	            zh: '健康运',
   621	            ja: '健康運'
   622	        },
   623	        love: {
   624	            ko: '연애 운',
   625	            en: 'Love Fortune',
   626	            zh: '爱情运',
   627	            ja: '恋愛運'
   628	        }
   629	    },
   630	
   631	    // 🤖 AI 상담
   632	    aiChat: {
   633	        title: {
   634	            ko: 'AI 사주 상담',
   635	            en: 'AI Saju Consultation',
   636	            zh: 'AI四柱咨询',
   637	            ja: 'AI四柱相談'
   638	        },
   639	        inputPlaceholder: {
   640	            ko: '궁금한 것을 물어보세요...',
   641	            en: 'Ask your question...',
   642	            zh: '请输入您的问题...',
   643	            ja: '質問を入力してください...'
   644	        },
   645	        send: {
   646	            ko: '전송',
   647	            en: 'Send',
   648	            zh: '发送',
   649	            ja: '送信'
   650	        },
   651	        thinking: {
   652	            ko: 'AI가 생각 중...',
   653	            en: 'AI is thinking...',
   654	            zh: 'AI思考中...',
   655	            ja: 'AI考え中...'
   656	        }
   657	    },
   658	
   659	    // 💰 가격표
   660	    pricing: {
   661	        free: {
   662	            ko: '무료',
   663	            en: 'Free',
   664	            zh: '免费',
   665	            ja: '無料'
   666	        },
   667	        premium: {
   668	            ko: '프리미엄',
   669	            en: 'Premium',
   670	            zh: '高级版',
   671	            ja: 'プレミアム'
   672	        },
   673	        perMonth: {
   674	            ko: '/월',
   675	            en: '/month',
   676	            zh: '/月',
   677	            ja: '/月'
   678	        },
   679	        perYear: {
   680	            ko: '/년',
   681	            en: '/year',
   682	            zh: '/年',
   683	            ja: '/年'
   684	        },
   685	        subscribe: {
   686	            ko: '구독하기',
   687	            en: 'Subscribe',
   688	            zh: '订阅',
   689	            ja: '購読する'
   690	        }
   691	    },
   692	
   693	    // 🔔 알림
   694	    notifications: {
   695	        dailyFortune: {
   696	            ko: '오늘의 운세가 도착했습니다!',
   697	            en: 'Your daily fortune has arrived!',
   698	            zh: '今日运势已到达！',
   699	            ja: '本日の運勢が届きました！'
   700	        },
   701	        newFeature: {
   702	            ko: '새로운 기능이 추가되었습니다',
   703	            en: 'New feature added',
   704	            zh: '新功能已添加',
   705	            ja: '新機能が追加されました'
   706	        },
   707	        premiumExpiring: {
   708	            ko: '프리미엄 구독이 곧 만료됩니다',
   709	            en: 'Your premium subscription is expiring soon',
   710	            zh: '您的高级订阅即将到期',
   711	            ja: 'プレミアムサブスクリプションがまもなく終了します'
   712	        }
   713	    },
   714	
   715	    // ⚙️ 설정
   716	    settings: {
   717	        language: {
   718	            ko: '언어 설정',
   719	            en: 'Language Settings',
   720	            zh: '语言设置',
   721	            ja: '言語設定'
   722	        },
   723	        notifications: {
   724	            ko: '알림 설정',
   725	            en: 'Notification Settings',
   726	            zh: '通知设置',
   727	            ja: '通知設定'
   728	        },
   729	        dailyFortune: {
   730	            ko: '매일 아침 운세 알림',
   731	            en: 'Daily morning fortune notification',
   732	            zh: '每日早晨运势通知',
   733	            ja: '毎朝の運勢通知'
   734	        },
   735	        time: {
   736	            ko: '시간',
   737	            en: 'Time',
   738	            zh: '时间',
   739	            ja: '時間'
   740	        },
   741	        save: {
   742	            ko: '저장',
   743	            en: 'Save',
   744	            zh: '保存',
   745	            ja: '保存'
   746	        }
   747	    },
   748	
   749	    // ⭐ FAQ
   750	    faqItems: {
   751	        q1: {
   752	            question: {
   753	                ko: 'Q. 정말 무료인가요?',
   754	                en: 'Q. Is it really free?',
   755	                zh: 'Q. 真的免费吗？',
   756	                ja: 'Q. 本当に無料ですか？'
   757	            },
   758	            answer: {
   759	                ko: '네, 기본 사주 해석, 궁합 분석, 토정비결, 꿈해몽, AI 상담 등 대부분의 서비스가 완전 무료입니다. 프리미엄 분석과 일부 특수 서비스만 유료입니다.',
   760	                en: 'Yes, most services including basic Saju reading, compatibility analysis, Tojeong, dream analysis, and AI consultation are completely free. Only premium analysis and some special services are paid.',
   761	                zh: '是的，基本四柱解读、婚配分析、土亭秘诀、解梦、AI咨询等大部分服务完全免费。只有高级分析和部分特殊服务是付费的。',
   762	                ja: 'はい、基本的な四柱推命、相性分析、土亭秘訣、夢占い、AI相談など、ほとんどのサービスは完全無料です。プレミアム分析と一部の特別サービスのみ有料です。'
   763	            }
   764	        },
   765	        q2: {
   766	            question: {
   767	                ko: 'Q. 출생 시간을 모르면 어떻게 하나요?',
   768	                en: 'Q. What if I don\'t know my birth time?',
   769	                zh: 'Q. 如果不知道出生时间怎么办？',
   770	                ja: 'Q. 生まれた時刻が分からない場合は？'
   771	            },
   772	            answer: {
   773	                ko: '출생 시간을 모르셔도 괜찮습니다. 생년월일만으로도 충분히 상세한 사주 분석이 가능합니다. 다만 시주(時柱)를 포함한 더 정밀한 분석을 원하시면 출생 시간을 입력해주세요.',
   774	                en: 'It\'s okay if you don\'t know your birth time. Detailed Saju analysis is possible with just your birth date. However, if you want more precise analysis including the hour pillar, please enter your birth time.',
   775	                zh: '不知道出生时间也没关系。仅凭出生日期就可以进行详细的四柱分析。但是，如果您想要包括时柱在内的更精确分析，请输入出生时间。',
   776	                ja: '生まれた時刻が分からなくても大丈夫です。生年月日だけでも十分詳細な四柱推命が可能です。ただし、時柱を含むより精密な分析をご希望の場合は、生まれた時刻を入力してください。'
   777	            }
   778	        },
   779	        q3: {
   780	            question: {
   781	                ko: 'Q. AI 사주 해석이 정확한가요?',
   782	                en: 'Q. Is AI Saju interpretation accurate?',
   783	                zh: 'Q. AI四柱解读准确吗？',
   784	                ja: 'Q. AI四柱推命は正確ですか？'
   785	            },
   786	            answer: {
   787	                ko: '저희 AI는 1000년 전통 명리학 데이터와 수만 건의 실제 사례를 학습했습니다. 98.7%의 높은 고객 만족도가 이를 증명합니다. 전통 명리학 이론을 기반으로 하되, AI의 빠른 처리 능력으로 더욱 상세한 분석을 제공합니다.',
   788	                en: 'Our AI has learned from 1000 years of traditional astrology data and tens of thousands of real cases. A high customer satisfaction rate of 98.7% proves this. Based on traditional astrology theory, we provide even more detailed analysis with AI\'s fast processing capabilities.',
   789	                zh: '我们的AI学习了1000年传统命理学数据和数万个真实案例。98.7%的高客户满意度证明了这一点。基于传统命理学理论，通过AI的快速处理能力提供更详细的分析。',
   790	                ja: '当社のAIは、1000年の伝統的な命理学データと数万件の実際の事例を学習しました。98.7%の高い顧客満足度がこれを証明しています。伝統的な命理学理論を基に、AIの高速処理能力でより詳細な分析を提供します。'
   791	            }
   792	        },
   793	        q4: {
   794	            question: {
   795	                ko: 'Q. 개인정보는 안전한가요?',
   796	                en: 'Q. Is my personal information safe?',
   797	                zh: 'Q. 个人信息安全吗？',
   798	                ja: 'Q. 個人情報は安全ですか？'
   799	            },
   800	            answer: {
   801	                ko: '고객님의 개인정보는 철저히 보호됩니다. 입력하신 정보는 암호화되어 저장되며, 사주 해석 목적 외에는 절대 사용되지 않습니다. 또한 제3자에게 제공되지 않습니다.',
   802	                en: 'Your personal information is thoroughly protected. The information you enter is encrypted and stored, and is never used for purposes other than Saju interpretation. It is also not provided to third parties.',
   803	                zh: '您的个人信息得到严格保护。您输入的信息会被加密存储，绝不会用于四柱解读以外的目的。也不会提供给第三方。',
   804	                ja: 'お客様の個人情報は徹底的に保護されます。入力された情報は暗号化されて保存され、四柱推命の目的以外には絶対に使用されません。また、第三者に提供されることもありません。'
   805	            }
   806	        },
   807	        q5: {
   808	            question: {
   809	                ko: 'Q. 프리미엄 서비스는 어떤 차이가 있나요?',
   810	                en: 'Q. What\'s the difference with premium services?',
   811	                zh: 'Q. 高级服务有什么区别？',
   812	                ja: 'Q. プレミアムサービスはどう違いますか？'
   813	            },
   814	            answer: {
   815	                ko: '프리미엄 서비스는 전문 명리학자의 검토를 거친 상세 분석 리포트를 PDF로 제공합니다. 일반 분석보다 3~5배 더 상세하며, 구체적인 조언과 시기별 운세 그래프가 포함됩니다.',
   816	                en: 'Premium services provide a detailed analysis report reviewed by professional astrologers in PDF format. It is 3-5 times more detailed than regular analysis and includes specific advice and fortune graphs by period.',
   817	                zh: '高级服务提供经过专业命理学家审核的详细分析报告（PDF格式）。比普通分析详细3-5倍，包含具体建议和各时期运势图表。',
   818	                ja: 'プレミアムサービスは、専門の命理学者のレビューを経た詳細な分析レポートをPDF形式で提供します。一般的な分析より3〜5倍詳しく、具体的なアドバイスと時期別の運勢グラフが含まれます。'
   819	            }
   820	        }
   821	    },
   822	
   823	    // 💰 가격 표시
   824	    priceLabels: {
   825	        free: {
   826	            ko: '무료',
   827	            en: 'Free',
   828	            zh: '免费',
   829	            ja: '無料'
   830	        }
   831	    },
   832	
   833	    // ✅ 버튼/액션
   834	    actions: {
   835	        confirm: {
   836	            ko: '확인',
   837	            en: 'Confirm',
   838	            zh: '确认',
   839	            ja: '確認'
   840	        },
   841	        cancel: {
   842	            ko: '취소',
   843	            en: 'Cancel',
   844	            zh: '取消',
   845	            ja: 'キャンセル'
   846	        },
   847	        close: {
   848	            ko: '닫기',
   849	            en: 'Close',
   850	            zh: '关闭',
   851	            ja: '閉じる'
   852	        },
   853	        more: {
   854	            ko: '더보기',
   855	            en: 'More',
   856	            zh: '更多',
   857	            ja: 'もっと見る'
   858	        },
   859	        share: {
   860	            ko: '공유하기',
   861	            en: 'Share',
   862	            zh: '分享',
   863	            ja: '共有'
   864	        },
   865	        download: {
   866	            ko: '다운로드',
   867	            en: 'Download',
   868	            zh: '下载',
   869	            ja: 'ダウンロード'
   870	        }
   871	    }
   872	};
   873	
   874	// 🌐 번역 함수
   875	function t(key) {
   876	    const keys = key.split('.');
   877	    let value = translations;
   878	    
   879	    for (const k of keys) {
   880	        value = value[k];
   881	        if (!value) return key; // 번역 없으면 키 반환
   882	    }
   883	    
   884	    return value[currentLanguage] || value['ko'] || key;
   885	}
   886	
   887	// 🔄 언어 변경
   888	function changeLanguage(lang) {
   889	    if (!supportedLanguages[lang]) {
   890	        console.error('Unsupported language:', lang);
   891	        return;
   892	    }
   893	    
   894	    currentLanguage = lang;
   895	    localStorage.setItem('saju_language', lang);
   896	    
   897	    // 페이지 새로고침 없이 실시간 번역
   898	    updatePageLanguage();
   899	    
   900	    // 이벤트 발생
   901	    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
   902	}
   903	
   904	// 📄 페이지 언어 업데이트
   905	function updatePageLanguage() {
   906	    // data-i18n 속성을 가진 모든 요소 찾기
   907	    document.querySelectorAll('[data-i18n]').forEach(element => {
   908	        const key = element.getAttribute('data-i18n');
   909	        const translation = t(key);
   910	        
   911	        // placeholder인 경우
   912	        if (element.hasAttribute('placeholder')) {
   913	            element.placeholder = translation;
   914	        } else {
   915	            element.textContent = translation;
   916	        }
   917	    });
   918	    
   919	    // data-i18n-html 속성을 가진 모든 요소 찾기 (HTML 포함)
   920	    document.querySelectorAll('[data-i18n-html]').forEach(element => {
   921	        const key = element.getAttribute('data-i18n-html');
   922	        const translation = t(key);
   923	        element.innerHTML = translation;
   924	    });
   925	    
   926	    // HTML lang 속성 변경
   927	    document.documentElement.lang = currentLanguage;
   928	    
   929	    // RTL 언어 지원 (아랍어 등)
   930	    document.documentElement.dir = supportedLanguages[currentLanguage].direction;
   931	}
   932	
   933	// 🎨 언어 선택 UI 생성
   934	function createLanguageSwitcher() {
   935	    const switcher = document.createElement('div');
   936	    switcher.className = 'language-switcher';
   937	    switcher.innerHTML = `
   938	        <button class="lang-btn" id="langBtn">
   939	            <span class="lang-flag">${supportedLanguages[currentLanguage].flag}</span>
   940	            <span class="lang-name">${supportedLanguages[currentLanguage].name}</span>
   941	            <i class="fas fa-chevron-down"></i>
   942	        </button>
   943	        <div class="lang-dropdown" id="langDropdown">
   944	            ${Object.entries(supportedLanguages).map(([code, info]) => `
   945	                <button class="lang-option ${code === currentLanguage ? 'active' : ''}" data-lang="${code}">
   946	                    <span class="lang-flag">${info.flag}</span>
   947	                    <span class="lang-name">${info.name}</span>
   948	                    ${code === currentLanguage ? '<i class="fas fa-check"></i>' : ''}
   949	                </button>
   950	            `).join('')}
   951	        </div>
   952	    `;
   953	    
   954	    return switcher;
   955	}
   956	
   957	// 🎯 초기화
   958	function initI18n() {
   959	    // 페이지 로드 시 언어 적용
   960	    updatePageLanguage();
   961	    
   962	    // 언어 선택기 추가
   963	    const container = document.getElementById('languageSwitcherContainer') || document.querySelector('.nav-container');
   964	    if (container) {
   965	        const switcher = createLanguageSwitcher();
   966	        
   967	        // 이미 존재하는지 확인
   968	        const existing = container.querySelector('.language-switcher');
   969	        if (existing) {
   970	            existing.remove();
   971	        }
   972	        
   973	        container.appendChild(switcher);
   974	        
   975	        // 드롭다운 토글
   976	        const langBtn = document.getElementById('langBtn');
   977	        const langDropdown = document.getElementById('langDropdown');
   978	        
   979	        langBtn?.addEventListener('click', (e) => {
   980	            e.stopPropagation();
   981	            langDropdown.classList.toggle('active');
   982	        });
   983	        
   984	        // 언어 선택
   985	        document.querySelectorAll('.lang-option').forEach(btn => {
   986	            btn.addEventListener('click', () => {
   987	                const lang = btn.getAttribute('data-lang');
   988	                changeLanguage(lang);
   989	                langDropdown.classList.remove('active');
   990	            });
   991	        });
   992	        
   993	        // 외부 클릭 시 닫기
   994	        document.addEventListener('click', (e) => {
   995	            if (!switcher.contains(e.target)) {
   996	                langDropdown?.classList.remove('active');
   997	            }
   998	        });
   999	    }
  1000	}
  1001	
  1002	// 🚀 DOMContentLoaded 시 자동 초기화
  1003	if (document.readyState === 'loading') {
  1004	    document.addEventListener('DOMContentLoaded', initI18n);
  1005	} else {
  1006	    initI18n();
  1007	}
  1008	
  1009	// Export
  1010	window.i18n = {
  1011	    t,
  1012	    changeLanguage,
  1013	    currentLanguage: () => currentLanguage,
  1014	    supportedLanguages,
  1015	    updatePageLanguage
  1016	};
  1017	
