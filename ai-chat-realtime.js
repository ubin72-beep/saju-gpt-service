1	/**
     2	 * 실시간 GPT 답변 시스템
     3	 * 사주GPT와 동일한 즉시 응답 기능
     4	 */
     5	
     6	// API 엔드포인트
     7	const API_BASE_URL = '/api'; // Vercel Functions 또는 Backend Server
     8	
     9	/**
    10	 * GPT에게 질문하기
    11	 */
    12	async function askGPT(question, sajuData = null) {
    13	    try {
    14	        // 로딩 상태 표시
    15	        showLoadingMessage('AI가 답변을 생성하고 있습니다...');
    16	
    17	        const response = await fetch(`${API_BASE_URL}/ai-consultation`, {
    18	            method: 'POST',
    19	            headers: {
    20	                'Content-Type': 'application/json',
    21	                'Authorization': `Bearer ${getUserToken()}` // 인증 토큰
    22	            },
    23	            body: JSON.stringify({
    24	                question: question,
    25	                sajuData: sajuData,
    26	                userId: getCurrentUser()?.id
    27	            })
    28	        });
    29	
    30	        if (!response.ok) {
    31	            const error = await response.json();
    32	            throw new Error(error.message || 'API 오류');
    33	        }
    34	
    35	        const data = await response.json();
    36	
    37	        // 로딩 메시지 제거
    38	        hideLoadingMessage();
    39	
    40	        // GPT 답변 표시
    41	        displayGPTResponse(data);
    42	
    43	        return data;
    44	
    45	    } catch (error) {
    46	        console.error('❌ GPT 호출 오류:', error);
    47	        hideLoadingMessage();
    48	        showErrorMessage(error.message);
    49	        return null;
    50	    }
    51	}
    52	
    53	/**
    54	 * 로딩 메시지 표시
    55	 */
    56	function showLoadingMessage(message) {
    57	    const chatMessages = document.getElementById('chatMessages');
    58	    
    59	    const loadingDiv = document.createElement('div');
    60	    loadingDiv.className = 'message ai-message loading';
    61	    loadingDiv.id = 'loadingMessage';
    62	    loadingDiv.innerHTML = `
    63	        <div class="message-avatar">
    64	            <i class="fas fa-robot"></i>
    65	        </div>
    66	        <div class="message-content">
    67	            <div class="typing-indicator">
    68	                <span></span>
    69	                <span></span>
    70	                <span></span>
    71	            </div>
    72	            <p>${message}</p>
    73	        </div>
    74	    `;
    75	    
    76	    chatMessages.appendChild(loadingDiv);
    77	    chatMessages.scrollTop = chatMessages.scrollHeight;
    78	}
    79	
    80	/**
    81	 * 로딩 메시지 제거
    82	 */
    83	function hideLoadingMessage() {
    84	    const loadingMsg = document.getElementById('loadingMessage');
    85	    if (loadingMsg) {
    86	        loadingMsg.remove();
    87	    }
    88	}
    89	
    90	/**
    91	 * GPT 답변 표시
    92	 */
    93	function displayGPTResponse(data) {
    94	    const chatMessages = document.getElementById('chatMessages');
    95	    
    96	    const messageDiv = document.createElement('div');
    97	    messageDiv.className = 'message ai-message';
    98	    messageDiv.innerHTML = `
    99	        <div class="message-avatar">
   100	            <i class="fas fa-robot"></i>
   101	        </div>
   102	        <div class="message-content">
   103	            <div class="message-header">
   104	                <span class="message-name">AI 사주 전문가</span>
   105	                <span class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
   106	            </div>
   107	            <div class="message-text">${formatMarkdown(data.answer)}</div>
   108	            ${data.isPremium ? '<span class="badge premium">프리미엄</span>' : '<span class="badge free">무료</span>'}
   109	        </div>
   110	    `;
   111	    
   112	    chatMessages.appendChild(messageDiv);
   113	    chatMessages.scrollTop = chatMessages.scrollHeight;
   114	
   115	    // 사용량 정보 업데이트
   116	    if (data.usage) {
   117	        updateUsageInfo(data.usage);
   118	    }
   119	}
   120	
   121	/**
   122	 * 에러 메시지 표시
   123	 */
   124	function showErrorMessage(message) {
   125	    const chatMessages = document.getElementById('chatMessages');
   126	    
   127	    const errorDiv = document.createElement('div');
   128	    errorDiv.className = 'message system-message error';
   129	    errorDiv.innerHTML = `
   130	        <i class="fas fa-exclamation-circle"></i>
   131	        <p>${message}</p>
   132	    `;
   133	    
   134	    chatMessages.appendChild(errorDiv);
   135	    chatMessages.scrollTop = chatMessages.scrollHeight;
   136	}
   137	
   138	/**
   139	 * 마크다운 형식 변환 (간단한 버전)
   140	 */
   141	function formatMarkdown(text) {
   142	    return text
   143	        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **굵게**
   144	        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *기울임*
   145	        .replace(/\n/g, '<br>') // 줄바꿈
   146	        .replace(/^- (.+)$/gm, '<li>$1</li>'); // 리스트
   147	}
   148	
   149	/**
   150	 * 사용량 정보 업데이트
   151	 */
   152	function updateUsageInfo(usage) {
   153	    const user = getCurrentUser();
   154	    if (!user) return;
   155	
   156	    // 무료 사용자: 남은 횟수 표시
   157	    if (!isPremiumUser()) {
   158	        const remaining = 3 - getTodayConsultationCount(user.id);
   159	        const usageElement = document.getElementById('freeUsageInfo');
   160	        if (usageElement) {
   161	            usageElement.innerHTML = `
   162	                <i class="fas fa-info-circle"></i>
   163	                오늘 남은 무료 상담: <strong>${remaining}회</strong>
   164	            `;
   165	        }
   166	    }
   167	
   168	    // 프리미엄 사용자: 토큰 사용량 표시 (선택사항)
   169	    if (isPremiumUser() && usage.costKRW) {
   170	        console.log(`💰 이번 상담 비용: ₩${usage.costKRW} (${usage.totalTokens} tokens)`);
   171	    }
   172	}
   173	
   174	/**
   175	 * 사용자 토큰 가져오기
   176	 */
   177	function getUserToken() {
   178	    // 실제 구현 시 JWT 토큰 또는 세션 ID 사용
   179	    const user = getCurrentUser();
   180	    return user ? btoa(user.id) : '';
   181	}
   182	
   183	/**
   184	 * 질문 전송 핸들러
   185	 */
   186	function setupChatInterface() {
   187	    const sendButton = document.getElementById('sendMessage');
   188	    const inputField = document.getElementById('userQuestion');
   189	
   190	    if (sendButton && inputField) {
   191	        sendButton.addEventListener('click', async () => {
   192	            const question = inputField.value.trim();
   193	            
   194	            if (!question) {
   195	                alert('질문을 입력해주세요.');
   196	                return;
   197	            }
   198	
   199	            // 사용자 메시지 표시
   200	            displayUserMessage(question);
   201	            inputField.value = '';
   202	
   203	            // 로그인 확인
   204	            const user = getCurrentUser();
   205	            if (!user) {
   206	                showErrorMessage('로그인이 필요합니다.');
   207	                return;
   208	            }
   209	
   210	            // 무료 사용자 횟수 제한 확인
   211	            if (!isPremiumUser()) {
   212	                const todayCount = getTodayConsultationCount(user.id);
   213	                if (todayCount >= 3) {
   214	                    showErrorMessage('오늘의 무료 상담 횟수를 모두 사용했습니다. 프리미엄으로 업그레이드하시면 무제한 상담이 가능합니다.');
   215	                    return;
   216	                }
   217	            }
   218	
   219	            // 사주 데이터 가져오기
   220	            const sajuData = user.sajuData || null;
   221	
   222	            // GPT에게 질문
   223	            const result = await askGPT(question, sajuData);
   224	
   225	            // 상담 내역 저장
   226	            if (result) {
   227	                addConsultationHistory(user.id, {
   228	                    question: question,
   229	                    answer: result.answer,
   230	                    type: result.isPremium ? 'premium_gpt' : 'free_keyword',
   231	                    tokens: result.usage?.totalTokens || 0
   232	                });
   233	            }
   234	        });
   235	
   236	        // Enter 키로 전송
   237	        inputField.addEventListener('keypress', (e) => {
   238	            if (e.key === 'Enter' && !e.shiftKey) {
   239	                e.preventDefault();
   240	                sendButton.click();
   241	            }
   242	        });
   243	    }
   244	}
   245	
   246	/**
   247	 * 사용자 메시지 표시
   248	 */
   249	function displayUserMessage(message) {
   250	    const chatMessages = document.getElementById('chatMessages');
   251	    
   252	    const messageDiv = document.createElement('div');
   253	    messageDiv.className = 'message user-message';
   254	    messageDiv.innerHTML = `
   255	        <div class="message-content">
   256	            <div class="message-header">
   257	                <span class="message-name">나</span>
   258	                <span class="message-time">${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
   259	            </div>
   260	            <div class="message-text">${message}</div>
   261	        </div>
   262	        <div class="message-avatar">
   263	            <i class="fas fa-user"></i>
   264	        </div>
   265	    `;
   266	    
   267	    chatMessages.appendChild(messageDiv);
   268	    chatMessages.scrollTop = chatMessages.scrollHeight;
   269	}
   270	
   271	/**
   272	 * 빠른 질문 버튼 설정
   273	 */
   274	function setupQuickQuestions() {
   275	    const quickButtons = document.querySelectorAll('.quick-question-btn');
   276	    
   277	    quickButtons.forEach(button => {
   278	        button.addEventListener('click', () => {
   279	            const question = button.dataset.question;
   280	            document.getElementById('userQuestion').value = question;
   281	            document.getElementById('sendMessage').click();
   282	        });
   283	    });
   284	}
   285	
   286	// 페이지 로드 시 초기화
   287	document.addEventListener('DOMContentLoaded', () => {
   288	    setupChatInterface();
   289	    setupQuickQuestions();
   290	    
   291	    console.log('✅ 실시간 GPT 상담 시스템 로드 완료');
   292	});
   293	