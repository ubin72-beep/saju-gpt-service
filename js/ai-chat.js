 1	/**
     2	 * AI 채팅 시스템 
     3	 * ChatGPT API 연동 및 사주팔자 맞춤 상담
     4	 */
     5	
     6	// ===== 설정 =====
     7	const CONFIG = {
     8	    OPENAI_API_KEY: 'sk-YOUR-API-KEY-HERE', // 실제 API 키로 교체 필요
     9	    OPENAI_MODEL: 'gpt-4', // 또는 'gpt-3.5-turbo'
    10	    OPENAI_API_URL: 'https://api.openai.com/v1/chat/completions',
    11	    
    12	    // 무료 사용자 제한
    13	    FREE_DAILY_LIMIT: 3,
    14	    
    15	    // 가격
    16	    EXTRA_QUESTIONS_PRICE: 2900,
    17	    EXTRA_QUESTIONS_COUNT: 10,
    18	    UNLIMITED_SUBSCRIPTION_PRICE: 9900
    19	};
    20	
    21	// ===== 전역 변수 =====
    22	let currentUser = null;
    23	let chatHistory = [];
    24	let conversationContext = [];
    25	let isProcessing = false;
    26	let userSajuInfo = null;
    27	
    28	// ===== 초기화 =====
    29	document.addEventListener('DOMContentLoaded', () => {
    30	    loadUser();
    31	    loadSajuInfo();
    32	    loadChatHistory();
    33	    setupEventListeners();
    34	    updateUI();
    35	    updateSajuUI();
    36	    autoResizeTextarea();
    37	});
    38	
    39	// ===== 사용자 로드 =====
    40	function loadUser() {
    41	    const userStr = localStorage.getItem('currentUser');
    42	    if (userStr) {
    43	        currentUser = JSON.parse(userStr);
    44	        
    45	        // 일일 제한 리셋 (자정 기준)
    46	        const today = new Date().toDateString();
    47	        if (currentUser.lastUsedDate !== today) {
    48	            currentUser.todayUsed = 0;
    49	            currentUser.lastUsedDate = today;
    50	            saveUser();
    51	        }
    52	    } else {
    53	        // 비회원 기본 설정
    54	        currentUser = {
    55	            id: 'guest_' + Date.now(),
    56	            type: 'free',
    57	            remainingQuestions: CONFIG.FREE_DAILY_LIMIT,
    58	            todayUsed: 0,
    59	            totalConversations: 0,
    60	            lastUsedDate: new Date().toDateString(),
    61	            subscriptionActive: false
    62	        };
    63	        saveUser();
    64	    }
    65	}
    66	
    67	function saveUser() {
    68	    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    69	}
    70	
    71	// ===== 사주 정보 로드 =====
    72	function loadSajuInfo() {
    73	    const sajuDataStr = localStorage.getItem('sajuData');
    74	    if (sajuDataStr) {
    75	        try {
    76	            const sajuData = JSON.parse(sajuDataStr);
    77	            userSajuInfo = {
    78	                birthdate: sajuData.birthdate || '',
    79	                calendar: sajuData.calendar === 'lunar' ? '음력' : '양력',
    80	                hour: sajuData.hour || '',
    81	                gender: sajuData.gender === 'male' ? '남성' : '여성',
    82	                // result.html에서 계산된 사주팔자 정보가 있다면
    83	                yearPillar: sajuData.yearPillar || '',
    84	                monthPillar: sajuData.monthPillar || '',
    85	                dayPillar: sajuData.dayPillar || '',
    86	                hourPillar: sajuData.hourPillar || ''
    87	            };
    88	            
    89	            console.log('📋 사주 정보 로드됨:', userSajuInfo);
    90	        } catch (e) {
    91	            console.error('사주 정보 로드 실패:', e);
    92	            userSajuInfo = null;
    93	        }
    94	    }
    95	}
    96	
    97	function updateSajuUI() {
    98	    if (!userSajuInfo) return;
    99	    
   100	    // 사주 정보 표시 영역이 있다면 업데이트
   101	    const sajuInfoDiv = document.getElementById('userSajuInfo');
   102	    if (sajuInfoDiv) {
   103	        sajuInfoDiv.innerHTML = `
   104	            <div class="saju-summary">
   105	                <h4>📅 내 사주 정보</h4>
   106	                <p>생년월일: ${userSajuInfo.birthdate} (${userSajuInfo.calendar})</p>
   107	                <p>태어난 시간: ${userSajuInfo.hour || '미상'}</p>
   108	                <p>성별: ${userSajuInfo.gender}</p>
   109	            </div>
   110	        `;
   111	    }
   112	}
   113	
   114	// ===== 채팅 히스토리 로드 =====
   115	function loadChatHistory() {
   116	    const historyStr = localStorage.getItem('chatHistory_' + currentUser.id);
   117	    if (historyStr) {
   118	        chatHistory = JSON.parse(historyStr);
   119	        renderHistoryList();
   120	    }
   121	}
   122	
   123	function saveChatHistory() {
   124	    localStorage.setItem('chatHistory_' + currentUser.id, JSON.stringify(chatHistory));
   125	}
   126	
   127	// ===== UI 업데이트 =====
   128	function updateUI() {
   129	    // 남은 질문 수 업데이트
   130	    const remaining = currentUser.subscriptionActive 
   131	        ? '∞' 
   132	        : currentUser.remainingQuestions;
   133	    
   134	    document.getElementById('remainingQuestions').textContent = remaining;
   135	    document.getElementById('remainingCount').textContent = remaining;
   136	    document.getElementById('todayUsed').textContent = currentUser.todayUsed;
   137	    document.getElementById('totalConversations').textContent = currentUser.totalConversations;
   138	    
   139	    // 전송 버튼 활성화/비활성화
   140	    const sendBtn = document.getElementById('sendBtn');
   141	    if (!currentUser.subscriptionActive && currentUser.remainingQuestions <= 0) {
   142	        sendBtn.disabled = true;
   143	        sendBtn.innerHTML = '<i class="fas fa-lock"></i> 질문 소진';
   144	    }
   145	}
   146	
   147	// ===== 이벤트 리스너 설정 =====
   148	function setupEventListeners() {
   149	    // 질문 템플릿 클릭
   150	    document.querySelectorAll('.template-btn').forEach(btn => {
   151	        btn.addEventListener('click', (e) => {
   152	            const question = e.currentTarget.getAttribute('data-question');
   153	            document.getElementById('chatInput').value = question;
   154	            sendMessage();
   155	        });
   156	    });
   157	    
   158	    // Enter 키로 전송
   159	    document.getElementById('chatInput').addEventListener('keydown', (e) => {
   160	        if (e.key === 'Enter' && !e.shiftKey) {
   161	            e.preventDefault();
   162	            sendMessage();
   163	        }
   164	    });
   165	    
   166	    // 글자 수 카운터
   167	    document.getElementById('chatInput').addEventListener('input', (e) => {
   168	        const length = e.target.value.length;
   169	        document.getElementById('charCount').textContent = length;
   170	        
   171	        if (length > 450) {
   172	            document.getElementById('charCount').style.color = '#c41e3a';
   173	        } else {
   174	            document.getElementById('charCount').style.color = '#333';
   175	        }
   176	    });
   177	    
   178	    // 모달 닫기
   179	    const modal = document.getElementById('purchaseModal');
   180	    document.querySelector('.close').addEventListener('click', closeModal);
   181	    window.addEventListener('click', (e) => {
   182	        if (e.target === modal) {
   183	            closeModal();
   184	        }
   185	    });
   186	}
   187	
   188	// ===== 메시지 전송 =====
   189	async function sendMessage() {
   190	    const input = document.getElementById('chatInput');
   191	    const message = input.value.trim();
   192	    
   193	    if (!message || isProcessing) return;
   194	    
   195	    // 질문 수 확인
   196	    if (!currentUser.subscriptionActive && currentUser.remainingQuestions <= 0) {
   197	        showUpgradeModal();
   198	        return;
   199	    }
   200	    
   201	    // 사용자 메시지 표시
   202	    addMessageToUI('user', message);
   203	    input.value = '';
   204	    document.getElementById('charCount').textContent = '0';
   205	    
   206	    // 컨텍스트에 추가
   207	    conversationContext.push({
   208	        role: 'user',
   209	        content: message
   210	    });
   211	    
   212	    // 타이핑 인디케이터 표시
   213	    showTypingIndicator();
   214	    
   215	    isProcessing = true;
   216	    
   217	    try {
   218	        // AI 응답 생성
   219	        const aiResponse = await getAIResponse(message);
   220	        
   221	        // 타이핑 인디케이터 제거
   222	        removeTypingIndicator();
   223	        
   224	        // AI 응답 표시
   225	        addMessageToUI('ai', aiResponse);
   226	        
   227	        // 컨텍스트에 추가
   228	        conversationContext.push({
   229	            role: 'assistant',
   230	            content: aiResponse
   231	        });
   232	        
   233	        // 질문 수 차감
   234	        if (!currentUser.subscriptionActive) {
   235	            currentUser.remainingQuestions--;
   236	        }
   237	        currentUser.todayUsed++;
   238	        currentUser.totalConversations++;
   239	        saveUser();
   240	        updateUI();
   241	        
   242	        // 채팅 히스토리 저장
   243	        saveChatToHistory(message, aiResponse);
   244	        
   245	    } catch (error) {
   246	        removeTypingIndicator();
   247	        addMessageToUI('ai', '죄송합니다. 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
   248	        console.error('AI Error:', error);
   249	    }
   250	    
   251	    isProcessing = false;
   252	}
   253	
   254	// ===== AI 응답 생성 =====
   255	async function getAIResponse(userMessage) {
   256	    // API 키가 없을 경우 데모 응답
   257	    if (CONFIG.OPENAI_API_KEY === 'sk-YOUR-API-KEY-HERE') {
   258	        return getDemoResponse(userMessage);
   259	    }
   260	    
   261	    // 사주 정보 문자열 생성
   262	    let sajuInfoText = '';
   263	    if (userSajuInfo) {
   264	        sajuInfoText = `
   265	사용자 사주 정보:
   266	- 생년월일: ${userSajuInfo.birthdate} (${userSajuInfo.calendar})
   267	- 태어난 시간: ${userSajuInfo.hour || '미상'}
   268	- 성별: ${userSajuInfo.gender}`;
   269	        
   270	        if (userSajuInfo.yearPillar) {
   271	            sajuInfoText += `
   272	- 연주(年柱): ${userSajuInfo.yearPillar}
   273	- 월주(月柱): ${userSajuInfo.monthPillar}
   274	- 일주(日柱): ${userSajuInfo.dayPillar}
   275	- 시주(時柱): ${userSajuInfo.hourPillar}`;
   276	        }
   277	    } else {
   278	        sajuInfoText = '\n사용자 사주 정보: 미제공 (정확한 분석을 위해 생년월일시를 입력해주세요)';
   279	    }
   280	
   281	    // 사주팔자 시스템 프롬프트
   282	    const systemPrompt = `당신은 전문 명리학자입니다. 사용자의 사주팔자를 기반으로 정확하고 따뜻한 조언을 제공합니다.
   283	
   284	규칙:
   285	1. 항상 존댓말을 사용하세요
   286	2. 구체적이고 실용적인 조언을 제공하세요
   287	3. 긍정적이면서도 현실적인 톤을 유지하세요
   288	4. 사주를 언급할 때는 천간지지를 명확히 하세요
   289	5. 질문에 직접적으로 답변하되, 관련된 추가 정보도 제공하세요
   290	6. 운세는 참고 자료이며 본인의 노력이 중요함을 강조하세요
   291	${sajuInfoText}
   292	`;
   293	
   294	    try {
   295	        const response = await fetch(CONFIG.OPENAI_API_URL, {
   296	            method: 'POST',
   297	            headers: {
   298	                'Content-Type': 'application/json',
   299	                'Authorization': `Bearer ${CONFIG.OPENAI_API_KEY}`
   300	            },
   301	            body: JSON.stringify({
   302	                model: CONFIG.OPENAI_MODEL,
   303	                messages: [
   304	                    { role: 'system', content: systemPrompt },
   305	                    ...conversationContext
   306	                ],
   307	                temperature: 0.7,
   308	                max_tokens: 500
   309	            })
   310	        });
   311	        
   312	        if (!response.ok) {
   313	            throw new Error('API 요청 실패');
   314	        }
   315	        
   316	        const data = await response.json();
   317	        return data.choices[0].message.content;
   318	        
   319	    } catch (error) {
   320	        console.error('OpenAI API Error:', error);
   321	        throw error;
   322	    }
   323	}
   324	
   325	// ===== 데모 응답 (API 키 없을 때) =====
   326	function getDemoResponse(userMessage) {
   327	    const responses = {
   328	        '연애': '2026년 병오년은 불의 기운이 강한 해입니다. 연애운은 전반적으로 활발하며, 특히 봄과 가을에 좋은 인연을 만날 가능성이 높습니다. 적극적으로 다가가되, 상대방의 감정도 세심히 배려하는 것이 중요합니다. 소통을 통해 서로를 이해하는 시간을 충분히 가지시길 바랍니다.',
   329	        '직업': '직업운은 상반기에 특히 좋습니다. 새로운 도전이나 이직을 고려하신다면 3월~5월이 적기입니다. 다만 성급한 결정보다는 충분히 준비하고 신중하게 판단하시는 것이 좋습니다. 현재 직장에 계신다면 7월 이후 승진이나 중요한 프로젝트 기회가 올 수 있습니다.',
   330	        '재물': '재물운은 안정적인 편입니다. 큰 투자보다는 꾸준한 저축과 안전한 투자가 권장됩니다. 부동산은 하반기가 유리하며, 주식 투자는 신중히 접근하시기 바랍니다. 예상치 못한 지출이 있을 수 있으니 비상금을 준비해두시면 좋습니다.',
   331	        '건강': '건강 관리에 주의가 필요한 시기입니다. 특히 소화기와 심장 건강을 챙기시기 바랍니다. 규칙적인 운동과 충분한 휴식이 중요합니다. 스트레스 관리를 위해 명상이나 요가를 추천드립니다. 정기 건강검진도 꼭 받으시길 바랍니다.'
   332	    };
   333	    
   334	    // 키워드 기반 응답
   335	    for (const [keyword, response] of Object.entries(responses)) {
   336	        if (userMessage.includes(keyword)) {
   337	            return response;
   338	        }
   339	    }
   340	    
   341	    // 기본 응답
   342	    return `질문 주셔서 감사합니다. "${userMessage}"에 대해 말씀드리겠습니다.\n\n2026년 병오년은 붉은 불의 말띠 해로, 변화와 열정의 기운이 넘치는 해입니다. 이 시기는 새로운 시작에 좋은 때이며, 적극적인 자세가 좋은 결과를 가져올 것입니다.\n\n더 구체적인 조언을 위해서는 생년월일시를 알려주시면 정확한 사주 분석이 가능합니다. 추가 질문이 있으시면 언제든 물어보세요!`;
   343	}
   344	
   345	// ===== UI에 메시지 추가 =====
   346	function addMessageToUI(sender, message) {
   347	    const messagesContainer = document.getElementById('chatMessages');
   348	    const messageDiv = document.createElement('div');
   349	    messageDiv.className = `message ${sender}-message`;
   350	    
   351	    const time = new Date().toLocaleTimeString('ko-KR', { 
   352	        hour: '2-digit', 
   353	        minute: '2-digit' 
   354	    });
   355	    
   356	    messageDiv.innerHTML = `
   357	        <div class="message-avatar">
   358	            <i class="fas fa-${sender === 'ai' ? 'robot' : 'user'}"></i>
   359	        </div>
   360	        <div class="message-content">
   361	            <div class="message-bubble">
   362	                ${formatMessage(message)}
   363	            </div>
   364	            <span class="message-time">${time}</span>
   365	        </div>
   366	    `;
   367	    
   368	    messagesContainer.appendChild(messageDiv);
   369	    messagesContainer.scrollTop = messagesContainer.scrollHeight;
   370	}
   371	
   372	function formatMessage(text) {
   373	    // 줄바꿈을 <p> 태그로 변환
   374	    return text.split('\n').map(line => `<p>${line || '&nbsp;'}</p>`).join('');
   375	}
   376	
   377	// ===== 타이핑 인디케이터 =====
   378	function showTypingIndicator() {
   379	    const messagesContainer = document.getElementById('chatMessages');
   380	    const indicator = document.createElement('div');
   381	    indicator.id = 'typingIndicator';
   382	    indicator.className = 'message ai-message';
   383	    indicator.innerHTML = `
   384	        <div class="message-avatar">
   385	            <i class="fas fa-robot"></i>
   386	        </div>
   387	        <div class="message-content">
   388	            <div class="message-bubble">
   389	                <div class="typing-indicator">
   390	                    <span></span>
   391	                    <span></span>
   392	                    <span></span>
   393	                </div>
   394	            </div>
   395	        </div>
   396	    `;
   397	    messagesContainer.appendChild(indicator);
   398	    messagesContainer.scrollTop = messagesContainer.scrollHeight;
   399	}
   400	
   401	function removeTypingIndicator() {
   402	    const indicator = document.getElementById('typingIndicator');
   403	    if (indicator) {
   404	        indicator.remove();
   405	    }
   406	}
   407	
   408	// ===== 채팅 히스토리 관리 =====
   409	function saveChatToHistory(userMessage, aiResponse) {
   410	    const chatItem = {
   411	        id: Date.now(),
   412	        title: userMessage.substring(0, 30) + (userMessage.length > 30 ? '...' : ''),
   413	        date: new Date().toLocaleDateString('ko-KR'),
   414	        messages: [
   415	            { sender: 'user', content: userMessage },
   416	            { sender: 'ai', content: aiResponse }
   417	        ]
   418	    };
   419	    
   420	    chatHistory.unshift(chatItem);
   421	    
   422	    // 최대 20개만 저장
   423	    if (chatHistory.length > 20) {
   424	        chatHistory = chatHistory.slice(0, 20);
   425	    }
   426	    
   427	    saveChatHistory();
   428	    renderHistoryList();
   429	}
   430	
   431	function renderHistoryList() {
   432	    const historyList = document.getElementById('historyList');
   433	    
   434	    if (chatHistory.length === 0) {
   435	        historyList.innerHTML = '<p class="empty-message">아직 대화 내역이 없습니다</p>';
   436	        return;
   437	    }
   438	    
   439	    historyList.innerHTML = chatHistory.map(item => `
   440	        <div class="history-item" onclick="loadChatFromHistory(${item.id})">
   441	            <div class="title">${item.title}</div>
   442	            <div class="date">${item.date}</div>
   443	        </div>
   444	    `).join('');
   445	}
   446	
   447	function loadChatFromHistory(id) {
   448	    const chat = chatHistory.find(item => item.id === id);
   449	    if (!chat) return;
   450	    
   451	    // 채팅 메시지 영역 초기화
   452	    const messagesContainer = document.getElementById('chatMessages');
   453	    messagesContainer.innerHTML = '';
   454	    
   455	    // 환영 메시지
   456	    addMessageToUI('ai', '이전 대화를 불러왔습니다. 계속 대화하실 수 있습니다.');
   457	    
   458	    // 이전 메시지 표시
   459	    chat.messages.forEach(msg => {
   460	        addMessageToUI(msg.sender, msg.content);
   461	    });
   462	}
   463	
   464	// ===== 채팅 내보내기 =====
   465	function exportChat() {
   466	    if (conversationContext.length === 0) {
   467	        alert('내보낼 대화가 없습니다.');
   468	        return;
   469	    }
   470	    
   471	    let text = '=== AI 사주 상담 대화 내역 ===\n';
   472	    text += `날짜: ${new Date().toLocaleString('ko-KR')}\n\n`;
   473	    
   474	    conversationContext.forEach((msg, index) => {
   475	        const sender = msg.role === 'user' ? '나' : 'AI 상담사';
   476	        text += `[${sender}]\n${msg.content}\n\n`;
   477	    });
   478	    
   479	    // 텍스트 파일 다운로드
   480	    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
   481	    const url = URL.createObjectURL(blob);
   482	    const a = document.createElement('a');
   483	    a.href = url;
   484	    a.download = `AI상담_${new Date().getTime()}.txt`;
   485	    a.click();
   486	    URL.revokeObjectURL(url);
   487	}
   488	
   489	// ===== 대화 초기화 =====
   490	function clearChat() {
   491	    if (!confirm('대화 내역을 모두 삭제하시겠습니까?')) return;
   492	    
   493	    conversationContext = [];
   494	    const messagesContainer = document.getElementById('chatMessages');
   495	    messagesContainer.innerHTML = `
   496	        <div class="message ai-message">
   497	            <div class="message-avatar">
   498	                <i class="fas fa-robot"></i>
   499	            </div>
   500	            <div class="message-content">
   501	                <div class="message-bubble">
   502	                    <p>대화가 초기화되었습니다. 새로운 질문을 시작해주세요.</p>
   503	                </div>
   504	                <span class="message-time">방금</span>
   505	            </div>
   506	        </div>
   507	    `;
   508	}
   509	
   510	// ===== 업그레이드 모달 =====
   511	function showUpgradeModal() {
   512	    document.getElementById('purchaseModal').style.display = 'block';
   513	}
   514	
   515	function closeModal() {
   516	    document.getElementById('purchaseModal').style.display = 'none';
   517	}
   518	
   519	// ===== 질문 구매 =====
   520	function purchaseQuestions() {
   521	    showUpgradeModal();
   522	}
   523	
   524	function confirmPurchase() {
   525	    // 실제로는 결제 API 호출
   526	    if (confirm(`₩${CONFIG.EXTRA_QUESTIONS_PRICE.toLocaleString()}을 결제하시겠습니까?`)) {
   527	        currentUser.remainingQuestions += CONFIG.EXTRA_QUESTIONS_COUNT;
   528	        saveUser();
   529	        updateUI();
   530	        closeModal();
   531	        alert(`${CONFIG.EXTRA_QUESTIONS_COUNT}개의 질문이 추가되었습니다!`);
   532	    }
   533	}
   534	
   535	// ===== 무제한 구독 =====
   536	function subscribeUnlimited() {
   537	    if (confirm(`월 ₩${CONFIG.UNLIMITED_SUBSCRIPTION_PRICE.toLocaleString()}으로 무제한 AI 상담을 구독하시겠습니까?`)) {
   538	        currentUser.subscriptionActive = true;
   539	        currentUser.subscriptionStartDate = new Date().toISOString();
   540	        saveUser();
   541	        updateUI();
   542	        alert('무제한 구독이 활성화되었습니다! 🎉');
   543	        location.reload();
   544	    }
   545	}
   546	
   547	// ===== 무료 체험 시작 =====
   548	function startChat(plan) {
   549	    document.getElementById('chatInput').focus();
   550	}
   551	
   552	// ===== 파일 첨부 (향후 구현) =====
   553	function attachFile() {
   554	    alert('파일 첨부 기능은 준비 중입니다.');
   555	}
   556	
   557	// ===== Textarea 자동 높이 조절 =====
   558	function autoResizeTextarea() {
   559	    const textarea = document.getElementById('chatInput');
   560	    textarea.addEventListener('input', function() {
   561	        this.style.height = 'auto';
   562	        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
   563	    });
   564	}
   565	
