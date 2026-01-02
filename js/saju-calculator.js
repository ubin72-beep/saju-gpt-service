    1	/**
     2	 * 사주팔자 계산 시스템
     3	 * 천간지지, 오행, 십신 등을 계산합니다
     4	 */
     5	
     6	// ===== 천간 (天干) =====
     7	const CHEONGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
     8	const CHEONGAN_NAMES = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
     9	
    10	// ===== 간지 파싱 함수 =====
    11	function parsePillar(ganZhi, pillarName) {
    12	    const gan = ganZhi[0];
    13	    const ji = ganZhi[1];
    14	    
    15	    const ganIndex = CHEONGAN.indexOf(gan);
    16	    const jiIndex = JIJI.indexOf(ji);
    17	    
    18	    console.log(`  ${pillarName}: ${ganZhi} (${CHEONGAN_NAMES[ganIndex]}${JIJI_NAMES[jiIndex]})`);
    19	    
    20	    return {
    21	        cheongan: gan,
    22	        jiji: ji,
    23	        cheongName: CHEONGAN_NAMES[ganIndex],
    24	        jijiName: JIJI_NAMES[jiIndex],
    25	        element: ELEMENTS[gan] + ELEMENTS[ji],
    26	        yinyang: YINYANG[gan] + YINYANG[ji]
    27	    };
    28	}
    29	
    30	// ===== 지지 (地支) =====
    31	const JIJI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    32	const JIJI_NAMES = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];
    33	
    34	// ===== 오행 (五行) =====
    35	const ELEMENTS = {
    36	    '甲': '木', '乙': '木',
    37	    '丙': '火', '丁': '火',
    38	    '戊': '土', '己': '土',
    39	    '庚': '金', '辛': '金',
    40	    '壬': '水', '癸': '水',
    41	    '子': '水', '丑': '土', '寅': '木', '卯': '木', 
    42	    '辰': '土', '巳': '火', '午': '火', '未': '土',
    43	    '申': '金', '酉': '金', '戌': '土', '亥': '水'
    44	};
    45	
    46	const ELEMENT_NAMES = {
    47	    '木': '목', '火': '화', '土': '토', '金': '금', '水': '수'
    48	};
    49	
    50	// ===== 음양 =====
    51	const YINYANG = {
    52	    '甲': '양', '乙': '음',
    53	    '丙': '양', '丁': '음',
    54	    '戊': '양', '己': '음',
    55	    '庚': '양', '辛': '음',
    56	    '壬': '양', '癸': '음',
    57	    '子': '양', '丑': '음', '寅': '양', '卯': '음',
    58	    '辰': '양', '巳': '음', '午': '양', '未': '음',
    59	    '申': '양', '酉': '음', '戌': '양', '亥': '음'
    60	};
    61	
    62	// ===== 메인 계산 함수 =====
    63	function calculateSaju(input) {
    64	    try {
    65	        let birthDate = new Date(input.birthDate);
    66	        const birthHour = parseInt(input.birthHour);
    67	        
    68	        // 유효성 검사
    69	        if (isNaN(birthDate.getTime()) || isNaN(birthHour)) {
    70	            throw new Error('올바른 날짜와 시간을 입력해주세요.');
    71	        }
    72	        
    73	        console.log('📅 입력된 날짜:', input.birthDate, '음력 여부:', input.calendar);
    74	        
    75	        // 음력을 양력으로 변환
    76	        if (input.calendar === 'lunar') {
    77	            console.log('🌙 음력 → 양력 변환 시작...');
    78	            const lunarYear = birthDate.getFullYear();
    79	            const lunarMonth = birthDate.getMonth() + 1;
    80	            const lunarDay = birthDate.getDate();
    81	            
    82	            console.log(`📅 입력된 음력: ${lunarYear}년 ${lunarMonth}월 ${lunarDay}일`);
    83	            
    84	            try {
    85	                // lunar-javascript 라이브러리 사용
    86	                if (typeof Lunar !== 'undefined') {
    87	                    const lunar = Lunar.fromYmd(lunarYear, lunarMonth, lunarDay);
    88	                    const solar = lunar.getSolar();
    89	                    
    90	                    const solarYear = solar.getYear();
    91	                    const solarMonth = solar.getMonth();
    92	                    const solarDay = solar.getDay();
    93	                    
    94	                    birthDate = new Date(solarYear, solarMonth - 1, solarDay);
    95	                    
    96	                    console.log(`✅ 음력 → 양력 변환 완료:`);
    97	                    console.log(`   음력: ${lunarYear}-${String(lunarMonth).padStart(2,'0')}-${String(lunarDay).padStart(2,'0')}`);
    98	                    console.log(`   양력: ${solarYear}-${String(solarMonth).padStart(2,'0')}-${String(solarDay).padStart(2,'0')}`);
    99	                } else {
   100	                    console.warn('⚠️ Lunar 라이브러리가 로드되지 않았습니다. 음력 변환을 건너뜁니다.');
   101	                    console.warn('⚠️ 입력된 날짜를 양력으로 간주하고 계속 진행합니다.');
   102	                }
   103	            } catch (e) {
   104	                console.error('❌ 음력 변환 오류:', e);
   105	                console.warn('⚠️ 입력된 날짜를 양력으로 간주하고 계속 진행합니다.');
   106	            }
   107	        }
   108	        
   109	        const year = birthDate.getFullYear();
   110	        const month = birthDate.getMonth() + 1; // 0-11 → 1-12
   111	        const day = birthDate.getDate();
   112	        
   113	        console.log('📅 최종 계산 날짜 (양력):', year, '년', month, '월', day, '일');
   114	        
   115	        // Lunar 라이브러리를 사용하여 정확한 사주 계산
   116	        let yearPillar, monthPillar, dayPillar;
   117	        
   118	        if (typeof Lunar !== 'undefined' && typeof Solar !== 'undefined') {
   119	            try {
   120	                const solar = Solar.fromYmd(year, month, day);
   121	                const lunar = solar.getLunar();
   122	                
   123	                // 년주 (입춘 기준 자동 반영)
   124	                const yearGanZhi = lunar.getYearInGanZhi();
   125	                yearPillar = parsePillar(yearGanZhi, '년주');
   126	                
   127	                // 월주 (절기 기준 자동 반영)
   128	                const monthGanZhi = lunar.getMonthInGanZhi();
   129	                monthPillar = parsePillar(monthGanZhi, '월주');
   130	                
   131	                // 일주
   132	                const dayGanZhi = lunar.getDayInGanZhi();
   133	                dayPillar = parsePillar(dayGanZhi, '일주');
   134	                
   135	                console.log('✅ Lunar 라이브러리로 사주 계산 완료');
   136	                
   137	            } catch (e) {
   138	                console.warn('⚠️ Lunar 라이브러리 사주 계산 실패, 대체 방식 사용:', e);
   139	                // 대체 방식 사용
   140	                yearPillar = calculateYearPillarManual(year, month, day);
   141	                monthPillar = calculateMonthPillar(year, month, day);
   142	                dayPillar = calculateDayPillar(year, month, day);
   143	            }
   144	        } else {
   145	            console.warn('⚠️ Lunar 라이브러리 없음, 수동 계산 방식 사용');
   146	            // 대체 방식 사용
   147	            yearPillar = calculateYearPillarManual(year, month, day);
   148	            monthPillar = calculateMonthPillar(year, month, day);
   149	            dayPillar = calculateDayPillar(year, month, day);
   150	        }
   151	        
   152	        // 시주 계산
   153	        const hourPillar = calculateHourPillar(dayPillar.cheongan, birthHour);
   154	        
   155	        console.log('✅ 사주팔자 계산 완료:');
   156	        console.log('  년주:', yearPillar.cheongan + yearPillar.jiji, `(${yearPillar.cheongName}${yearPillar.jijiName})`);
   157	        console.log('  월주:', monthPillar.cheongan + monthPillar.jiji, `(${monthPillar.cheongName}${monthPillar.jijiName})`);
   158	        console.log('  일주:', dayPillar.cheongan + dayPillar.jiji, `(${dayPillar.cheongName}${dayPillar.jijiName})`);
   159	        console.log('  시주:', hourPillar.cheongan + hourPillar.jiji, `(${hourPillar.cheongName}${hourPillar.jijiName})`);
   160	        
   161	        // 오행 분석
   162	        const elements = analyzeElements(yearPillar, monthPillar, dayPillar, hourPillar);
   163	        
   164	        // 십신 분석
   165	        const sipsin = analyzeSipsin(dayPillar.cheongan, yearPillar, monthPillar, dayPillar, hourPillar);
   166	        
   167	        return {
   168	            input: input,
   169	            pillars: {
   170	                year: yearPillar.cheongan + yearPillar.jiji,
   171	                month: monthPillar.cheongan + monthPillar.jiji,
   172	                day: dayPillar.cheongan + dayPillar.jiji,
   173	                hour: hourPillar.cheongan + hourPillar.jiji
   174	            },
   175	            pillarDetails: {
   176	                year: yearPillar,
   177	                month: monthPillar,
   178	                day: dayPillar,
   179	                hour: hourPillar
   180	            },
   181	            elements: elements,
   182	            sipsin: sipsin,
   183	            dayMaster: dayPillar.cheongan, // 일간 (본인)
   184	            summary: generateSummary(input, yearPillar, monthPillar, dayPillar, hourPillar, elements)
   185	        };
   186	        
   187	    } catch (error) {
   188	        console.error('사주 계산 오류:', error);
   189	        return null;
   190	    }
   191	}
   192	
   193	// ===== 년주 수동 계산 (입춘 기준) =====
   194	function calculateYearPillarManual(year, month, day) {
   195	    // 입춘 기준으로 년도 조정
   196	    let sajuYear = year;
   197	    if (month === 1 || (month === 2 && day < 4)) {
   198	        sajuYear = year - 1; // 입춘 이전이면 전년도
   199	        console.log('⚠️ 입춘 이전이므로 사주 년도를 전년도로 조정:', sajuYear);
   200	    }
   201	    
   202	    // 1924년(갑자년)을 기준점으로 사용 (가장 가까운 갑자년)
   203	    const baseYear = 1924; // 1924년 = 甲子년
   204	    let offset = sajuYear - baseYear;
   205	    
   206	    // 음수 처리
   207	    while (offset < 0) {
   208	        offset += 60; // 60갑자 주기
   209	    }
   210	    
   211	    // 60갑자 주기로 정규화
   212	    offset = offset % 60;
   213	    
   214	    const cheongIndex = offset % 10;
   215	    const jijiIndex = offset % 12;
   216	    
   217	    console.log(`📅 년주 계산: ${sajuYear}년, offset=${offset}, 천간=${CHEONGAN[cheongIndex]}(${cheongIndex}), 지지=${JIJI[jijiIndex]}(${jijiIndex})`);
   218	    
   219	    return {
   220	        cheongan: CHEONGAN[cheongIndex],
   221	        jiji: JIJI[jijiIndex],
   222	        cheongName: CHEONGAN_NAMES[cheongIndex],
   223	        jijiName: JIJI_NAMES[jijiIndex],
   224	        element: ELEMENTS[CHEONGAN[cheongIndex]] + ELEMENTS[JIJI[jijiIndex]],
   225	        yinyang: YINYANG[CHEONGAN[cheongIndex]] + YINYANG[JIJI[jijiIndex]]
   226	    };
   227	}
   228	
   229	// ===== 월주 계산 =====
   230	function calculateMonthPillar(year, month, day) {
   231	    // 절기 기준으로 월 결정
   232	    // 입춘(立春)을 기준으로 새해가 시작
   233	    const solarMonth = getSolarMonth(year, month, day);
   234	    
   235	    const yearPillar = calculateYearPillarManual(year, month, day);
   236	    const yearCheongIndex = CHEONGAN.indexOf(yearPillar.cheongan);
   237	    
   238	    // 월지지 결정: 인월(1), 묘월(2), 진월(3), ...
   239	    // 1월(입춘~경칩) = 인월(寅, 2)
   240	    const monthJijiIndex = solarMonth + 1; // 1월 → 2(寅), 2월 → 3(卯)
   241	    
   242	    // 월간 계산 (년간에 따라 오호법 적용)
   243	    // 갑기년(甲己年): 병인월(丙寅)부터 시작
   244	    // 을경년(乙庚年): 무인월(戊寅)부터 시작
   245	    // 병신년(丙辛年): 경인월(庚寅)부터 시작
   246	    // 정임년(丁壬年): 임인월(壬寅)부터 시작
   247	    // 무계년(戊癸年): 갑인월(甲寅)부터 시작
   248	    
   249	    const startCheong = [2, 4, 6, 8, 0]; // 병, 무, 경, 임, 갑
   250	    const baseIndex = startCheong[yearCheongIndex % 5];
   251	    const monthCheongIndex = (baseIndex + (solarMonth * 2)) % 10;
   252	    
   253	    return {
   254	        cheongan: CHEONGAN[monthCheongIndex],
   255	        jiji: JIJI[monthJijiIndex],
   256	        cheongName: CHEONGAN_NAMES[monthCheongIndex],
   257	        jijiName: JIJI_NAMES[monthJijiIndex],
   258	        element: ELEMENTS[CHEONGAN[monthCheongIndex]] + ELEMENTS[JIJI[monthJijiIndex]],
   259	        yinyang: YINYANG[CHEONGAN[monthCheongIndex]] + YINYANG[JIJI[monthJijiIndex]]
   260	    };
   261	}
   262	
   263	// ===== 절기 기준 월 결정 =====
   264	function getSolarMonth(year, month, day) {
   265	    // 24절기 약식 계산
   266	    // 실제로는 천문학적 계산이 필요하지만, 여기서는 평균값 사용
   267	    
   268	    // 절기 날짜 (평균값, 실제로는 해마다 1-2일 차이)
   269	    const solarTerms = [
   270	        { month: 1, day: 6 },   // 1월: 소한(6일경)
   271	        { month: 2, day: 4 },   // 2월: 입춘(4일경) - 새해 시작
   272	        { month: 3, day: 6 },   // 3월: 경칩(6일경)
   273	        { month: 4, day: 5 },   // 4월: 청명(5일경)
   274	        { month: 5, day: 6 },   // 5월: 입하(6일경)
   275	        { month: 6, day: 6 },   // 6월: 망종(6일경)
   276	        { month: 7, day: 7 },   // 7월: 소서(7일경)
   277	        { month: 8, day: 8 },   // 8월: 입추(8일경)
   278	        { month: 9, day: 8 },   // 9월: 백로(8일경)
   279	        { month: 10, day: 8 },  // 10월: 한로(8일경)
   280	        { month: 11, day: 7 },  // 11월: 입동(7일경)
   281	        { month: 12, day: 7 }   // 12월: 대설(7일경)
   282	    ];
   283	    
   284	    // 입춘 이전이면 전년도 12월로 계산
   285	    if (month === 1 && day < 6) {
   286	        return 11; // 축월(丑月) - 전년도 12월
   287	    }
   288	    if (month === 2 && day < 4) {
   289	        return 11; // 축월(丑月) - 전년도 12월
   290	    }
   291	    
   292	    // 월 결정: 입춘(2월 4일경)부터 1월(인월)로 시작
   293	    let solarMonth = month - 2; // 2월 → 0(인월), 3월 → 1(묘월)
   294	    
   295	    if (month === 1) {
   296	        solarMonth = 11; // 축월(전년도 12월)
   297	    } else if (month === 2) {
   298	        solarMonth = day >= 4 ? 0 : 11; // 입춘 기준
   299	    }
   300	    
   301	    // 각 월의 절기일 확인하여 미세 조정
   302	    if (month >= 3 && month <= 12) {
   303	        const term = solarTerms[month - 1];
   304	        if (day < term.day) {
   305	            solarMonth -= 1;
   306	        }
   307	    }
   308	    
   309	    // 음수 방지
   310	    if (solarMonth < 0) solarMonth += 12;
   311	    
   312	    return solarMonth;
   313	}
   314	
   315	// ===== 일주 계산 =====
   316	function calculateDayPillar(year, month, day) {
   317	    // Lunar 라이브러리를 사용하여 정확한 일주 계산
   318	    if (typeof Lunar !== 'undefined') {
   319	        try {
   320	            const solar = Solar.fromYmd(year, month, day);
   321	            const lunar = solar.getLunar();
   322	            const ganZhi = lunar.getDayInGanZhi();
   323	            
   324	            // 간지 문자열 파싱 (예: "甲辰")
   325	            const gan = ganZhi[0];
   326	            const ji = ganZhi[1];
   327	            
   328	            const ganIndex = CHEONGAN.indexOf(gan);
   329	            const jiIndex = JIJI.indexOf(ji);
   330	            
   331	            if (ganIndex >= 0 && jiIndex >= 0) {
   332	                console.log(`✅ Lunar 라이브러리로 일주 계산: ${ganZhi}`);
   333	                
   334	                return {
   335	                    cheongan: gan,
   336	                    jiji: ji,
   337	                    cheongName: CHEONGAN_NAMES[ganIndex],
   338	                    jijiName: JIJI_NAMES[jiIndex],
   339	                    element: ELEMENTS[gan] + ELEMENTS[ji],
   340	                    yinyang: YINYANG[gan] + YINYANG[ji]
   341	                };
   342	            }
   343	        } catch (e) {
   344	            console.warn('⚠️ Lunar 라이브러리 일주 계산 실패, 대체 방식 사용:', e);
   345	        }
   346	    }
   347	    
   348	    // 대체 방식: 율리우스 적일 방식 (정확한 계산)
   349	    console.log('⚠️ Lunar 라이브러리 없음, 정확한 만세력 계산 방식 사용');
   350	    
   351	    // 기준일: 1900년 1월 1일 = 경진일(庚辰日)
   352	    // 주의: JavaScript Date는 0-based month를 사용
   353	    const baseDate = new Date(1900, 0, 1); // 1900-01-01
   354	    const targetDate = new Date(year, month - 1, day);
   355	    
   356	    // 두 날짜 사이의 일수 차이
   357	    const diffTime = targetDate.getTime() - baseDate.getTime();
   358	    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
   359	    
   360	    // 1900년 1월 1일은 경진일(庚辰: 천간 6(庚), 지지 4(辰))
   361	    const baseGanIndex = 6;  // 庚
   362	    const baseJiIndex = 4;   // 辰
   363	    
   364	    // 일수를 더해서 천간지지 계산
   365	    let ganIndex = (baseGanIndex + diffDays) % 10;
   366	    let jiIndex = (baseJiIndex + diffDays) % 12;
   367	    
   368	    // 음수 방지
   369	    if (ganIndex < 0) ganIndex += 10;
   370	    if (jiIndex < 0) jiIndex += 12;
   371	    
   372	    console.log(`📅 일주 계산: ${year}-${month}-${day}, diffDays=${diffDays}, 천간=${ganIndex}, 지지=${jiIndex}`);
   373	    
   374	    return {
   375	        cheongan: CHEONGAN[ganIndex],
   376	        jiji: JIJI[jiIndex],
   377	        cheongName: CHEONGAN_NAMES[ganIndex],
   378	        jijiName: JIJI_NAMES[jiIndex],
   379	        element: ELEMENTS[CHEONGAN[ganIndex]] + ELEMENTS[JIJI[jiIndex]],
   380	        yinyang: YINYANG[CHEONGAN[ganIndex]] + YINYANG[JIJI[jiIndex]]
   381	    };
   382	}
   383	
   384	// ===== 시주 계산 =====
   385	function calculateHourPillar(dayCheongan, hour) {
   386	    const dayCheongIndex = CHEONGAN.indexOf(dayCheongan);
   387	    
   388	    // 시간을 지지로 변환 (23-01시=子, 01-03시=丑, ...)
   389	    let hourJijiIndex;
   390	    if (hour >= 23 || hour < 1) hourJijiIndex = 0; // 子
   391	    else hourJijiIndex = Math.floor((hour + 1) / 2);
   392	    
   393	    // 시간의 천간 계산 (일간에 따라 변동)
   394	    const hourCheongIndex = ((dayCheongIndex % 5) * 2 + hourJijiIndex) % 10;
   395	    
   396	    return {
   397	        cheongan: CHEONGAN[hourCheongIndex],
   398	        jiji: JIJI[hourJijiIndex],
   399	        cheongName: CHEONGAN_NAMES[hourCheongIndex],
   400	        jijiName: JIJI_NAMES[hourJijiIndex],
   401	        element: ELEMENTS[CHEONGAN[hourCheongIndex]] + ELEMENTS[JIJI[hourJijiIndex]],
   402	        yinyang: YINYANG[CHEONGAN[hourCheongIndex]] + YINYANG[JIJI[hourJijiIndex]]
   403	    };
   404	}
   405	
   406	// ===== 오행 분석 =====
   407	function analyzeElements(year, month, day, hour) {
   408	    const elementCount = {
   409	        '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
   410	    };
   411	    
   412	    // 각 주의 천간과 지지 오행 카운트
   413	    [year, month, day, hour].forEach(pillar => {
   414	        const cheongElement = ELEMENTS[pillar.cheongan];
   415	        const jijiElement = ELEMENTS[pillar.jiji];
   416	        
   417	        elementCount[cheongElement] += 1.5; // 천간 가중치 높음
   418	        elementCount[jijiElement] += 1.0; // 지지
   419	    });
   420	    
   421	    // 백분율 계산
   422	    const total = Object.values(elementCount).reduce((a, b) => a + b, 0);
   423	    const percentages = {};
   424	    
   425	    Object.keys(elementCount).forEach(element => {
   426	        percentages[element] = Math.round((elementCount[element] / total) * 100);
   427	    });
   428	    
   429	    // 가장 강한/약한 오행
   430	    const sorted = Object.entries(percentages).sort((a, b) => b[1] - a[1]);
   431	    
   432	    return {
   433	        wood: percentages['木'],
   434	        fire: percentages['火'],
   435	        earth: percentages['土'],
   436	        metal: percentages['金'],
   437	        water: percentages['水'],
   438	        strongest: { element: sorted[0][0], percentage: sorted[0][1] },
   439	        weakest: { element: sorted[sorted.length - 1][0], percentage: sorted[sorted.length - 1][1] },
   440	        balance: calculateBalance(percentages)
   441	    };
   442	}
   443	
   444	// ===== 오행 균형도 계산 =====
   445	function calculateBalance(percentages) {
   446	    const values = Object.values(percentages);
   447	    const avg = values.reduce((a, b) => a + b, 0) / values.length;
   448	    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
   449	    const stdDev = Math.sqrt(variance);
   450	    
   451	    // 표준편차가 작을수록 균형잡힘 (0-100 점수로 변환)
   452	    const balanceScore = Math.max(0, 100 - stdDev * 5);
   453	    
   454	    return {
   455	        score: Math.round(balanceScore),
   456	        description: balanceScore > 70 ? '균형잡힘' : balanceScore > 40 ? '보통' : '불균형'
   457	    };
   458	}
   459	
   460	// ===== 십신 분석 =====
   461	function analyzeSipsin(dayMaster, year, month, day, hour) {
   462	    // 십신 관계 정의
   463	    const sipsinRelation = {
   464	        same: '비겁',      // 같은 오행
   465	        produce: '식상',   // 내가 생하는 오행
   466	        overcome: '재성',  // 내가 극하는 오행
   467	        controlled: '관성', // 나를 극하는 오행
   468	        nourish: '인성'    // 나를 생하는 오행
   469	    };
   470	    
   471	    const dayElement = ELEMENTS[dayMaster];
   472	    const sipsin = {};
   473	    
   474	    [
   475	        { name: 'year', pillar: year },
   476	        { name: 'month', pillar: month },
   477	        { name: 'day', pillar: day },
   478	        { name: 'hour', pillar: hour }
   479	    ].forEach(({ name, pillar }) => {
   480	        const cheongElement = ELEMENTS[pillar.cheongan];
   481	        const jijiElement = ELEMENTS[pillar.jiji];
   482	        
   483	        sipsin[name] = {
   484	            cheongan: getSipsinType(dayElement, cheongElement),
   485	            jiji: getSipsinType(dayElement, jijiElement)
   486	        };
   487	    });
   488	    
   489	    return sipsin;
   490	}
   491	
   492	// ===== 십신 타입 판별 =====
   493	function getSipsinType(dayElement, targetElement) {
   494	    // 오행 생극 관계
   495	    const produces = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
   496	    const overcomes = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
   497	    
   498	    if (dayElement === targetElement) {
   499	        return '비겁';
   500	    } else if (produces[dayElement] === targetElement) {
   501	        return '식상';
   502	    } else if (overcomes[dayElement] === targetElement) {
   503	        return '재성';
   504	    } else if (overcomes[targetElement] === dayElement) {
   505	        return '관성';
   506	    } else {
   507	        return '인성';
   508	    }
   509	}
   510	
   511	// ===== 사주 요약 생성 =====
   512	function generateSummary(input, year, month, day, hour, elements) {
   513	    const gender = input.gender === 'male' ? '남성' : '여성';
   514	    const calendar = input.calendar === 'lunar' ? '음력' : '양력';
   515	    const birthDate = new Date(input.birthDate);
   516	    
   517	    const strongElement = elements.strongest.element;
   518	    const weakElement = elements.weakest.element;
   519	    
   520	    return {
   521	        basic: `${birthDate.getFullYear()}년 ${birthDate.getMonth() + 1}월 ${birthDate.getDate()}일 ${input.birthHour}시 출생 (${calendar}, ${gender})`,
   522	        dayMaster: `일간(日干): ${day.cheongan}(${day.cheongName}) - ${ELEMENT_NAMES[ELEMENTS[day.cheongan]]}(${ELEMENTS[day.cheongan]})`,
   523	        elementAnalysis: `오행: ${ELEMENT_NAMES[strongElement]}(${strongElement})이 가장 강하고(${elements.strongest.percentage}%), ${ELEMENT_NAMES[weakElement]}(${weakElement})이 가장 약합니다(${elements.weakest.percentage}%).`,
   524	        balance: `오행 균형도: ${elements.balance.score}점 (${elements.balance.description})`
   525	    };
   526	}
   527	
   528	// ===== 상세 해석 생성 (프리미엄) =====
   529	function generateDetailedAnalysis(saju) {
   530	    // 프리미엄 기능: 상세한 해석
   531	    return {
   532	        personality: analyzePersonality(saju),
   533	        career: analyzeCareer(saju),
   534	        wealth: analyzeWealth(saju),
   535	        love: analyzeLove(saju),
   536	        health: analyzeHealth(saju),
   537	        luck: analyzeLuck(saju)
   538	    };
   539	}
   540	
   541	function analyzePersonality(saju) {
   542	    const dayElement = ELEMENTS[saju.dayMaster];
   543	    
   544	    const personalities = {
   545	        '木': '적극적이고 진취적인 성격입니다. 성장과 발전을 추구하며 새로운 것에 도전하는 것을 좋아합니다.',
   546	        '火': '열정적이고 활발한 성격입니다. 사교적이며 밝은 에너지로 주변 사람들에게 활력을 줍니다.',
   547	        '土': '안정적이고 신중한 성격입니다. 책임감이 강하고 신뢰할 수 있으며 포용력이 있습니다.',
   548	        '金': '원칙적이고 정의로운 성격입니다. 결단력이 있으며 목표 달성을 위해 노력합니다.',
   549	        '水': '지혜롭고 유연한 성격입니다. 통찰력이 뛰어나며 상황에 따라 적응하는 능력이 좋습니다.'
   550	    };
   551	    
   552	    return personalities[dayElement] || '균형잡힌 성격입니다.';
   553	}
   554	
   555	function analyzeCareer(saju) {
   556	    const strongElement = saju.elements.strongest.element;
   557	    
   558	    const careers = {
   559	        '木': '교육, 출판, 디자인, 창업 등 성장과 창의성이 필요한 분야',
   560	        '火': '예술, 방송, 마케팅, 영업 등 활동적이고 사람을 만나는 분야',
   561	        '土': '부동산, 농업, 건설, 행정 등 안정적이고 신뢰가 중요한 분야',
   562	        '金': '법률, 금융, 제조업, 기술직 등 전문성과 정확성이 요구되는 분야',
   563	        '水': '연구, IT, 무역, 컨설팅 등 지식과 정보를 다루는 분야'
   564	    };
   565	    
   566	    return `적합한 직업: ${careers[strongElement]}`;
   567	}
   568	
   569	function analyzeWealth(saju) {
   570	    // 재성(財星) 분석
   571	    return '재물운은 꾸준한 노력으로 축적됩니다. 투자보다는 저축이 유리합니다.';
   572	}
   573	
   574	function analyzeLove(saju) {
   575	    const gender = saju.input.gender;
   576	    
   577	    if (gender === 'male') {
   578	        return '이성과의 만남이 많으며, 적극적인 태도가 좋은 결과를 가져옵니다.';
   579	    } else {
   580	        return '진실된 관계를 중요시하며, 안정적인 연애를 추구합니다.';
   581	    }
   582	}
   583	
   584	function analyzeHealth(saju) {
   585	    const weakElement = saju.elements.weakest.element;
   586	    
   587	    const healthAdvice = {
   588	        '木': '간 기능과 눈 건강에 주의하세요.',
   589	        '火': '심장과 혈액순환에 주의하세요.',
   590	        '土': '소화기 계통과 비장 건강에 주의하세요.',
   591	        '金': '호흡기와 폐 건강에 주의하세요.',
   592	        '水': '신장과 방광 건강에 주의하세요.'
   593	    };
   594	    
   595	    return healthAdvice[weakElement];
   596	}
   597	
   598	function analyzeLuck(saju) {
   599	    const birthDate = new Date(saju.input.birthDate);
   600	    const currentYear = new Date().getFullYear();
   601	    const age = currentYear - birthDate.getFullYear();
   602	    
   603	    // 대운 계산 (간략화)
   604	    const daewoon = Math.floor(age / 10) * 10;
   605	    
   606	    return `현재 ${age}세, ${daewoon}세 대운 중입니다. 10년마다 운의 흐름이 바뀝니다.`;
   607	}
   608	
   609	// ===== Export =====
   610	window.calculateSaju = calculateSaju;
   611	window.generateDetailedAnalysis = generateDetailedAnalysis;
   612	
   613	console.log('✅ saju-calculator.js 로드 완료');
   614	
