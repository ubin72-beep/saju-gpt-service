 1	/**
     2	 * AI 사주 천년지기 API 클라이언트
     3	 * @version 1.0.0
     4	 * @description 백엔드 API와 통신하는 클라이언트 라이브러리
     5	 */
     6	
     7	// API 기본 설정
     8	const API_CONFIG = {
     9	    baseURL: 'https://api.aisaju1000.com', // 실제 백엔드 URL로 변경
    10	    timeout: 30000, // 30초
    11	    headers: {
    12	        'Content-Type': 'application/json'
    13	    }
    14	};
    15	
    16	/**
    17	 * API 요청 헬퍼 함수
    18	 */
    19	async function apiRequest(endpoint, options = {}) {
    20	    const url = `${API_CONFIG.baseURL}${endpoint}`;
    21	    
    22	    // 기본 옵션 설정
    23	    const config = {
    24	        method: options.method || 'GET',
    25	        headers: {
    26	            ...API_CONFIG.headers,
    27	            ...options.headers
    28	        },
    29	        ...options
    30	    };
    31	
    32	    // JWT 토큰 추가 (인증이 필요한 경우)
    33	    const token = localStorage.getItem('authToken');
    34	    if (token) {
    35	        config.headers['Authorization'] = `Bearer ${token}`;
    36	    }
    37	
    38	    // Body 데이터 처리
    39	    if (options.body) {
    40	        config.body = JSON.stringify(options.body);
    41	    }
    42	
    43	    try {
    44	        const response = await fetch(url, config);
    45	        
    46	        // 응답 처리
    47	        const contentType = response.headers.get('content-type');
    48	        let data;
    49	        
    50	        if (contentType && contentType.includes('application/json')) {
    51	            data = await response.json();
    52	        } else {
    53	            data = await response.text();
    54	        }
    55	
    56	        // HTTP 에러 처리
    57	        if (!response.ok) {
    58	            // 401 Unauthorized - 토큰 만료
    59	            if (response.status === 401) {
    60	                handleUnauthorized();
    61	            }
    62	            
    63	            throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    64	        }
    65	
    66	        return {
    67	            success: true,
    68	            data: data,
    69	            status: response.status
    70	        };
    71	    } catch (error) {
    72	        console.error('API 요청 오류:', error);
    73	        return {
    74	            success: false,
    75	            message: error.message,
    76	            error: error
    77	        };
    78	    }
    79	}
    80	
    81	/**
    82	 * 인증 관련 함수
    83	 */
    84	
    85	// 회원가입
    86	async function signup(userData) {
    87	    return await apiRequest('/api/auth/signup', {
    88	        method: 'POST',
    89	        body: userData
    90	    });
    91	}
    92	
    93	// 로그인
    94	async function login(email, password) {
    95	    const result = await apiRequest('/api/auth/login', {
    96	        method: 'POST',
    97	        body: { email, password }
    98	    });
    99	
   100	    if (result.success && result.data.token) {
   101	        // JWT 토큰 저장
   102	        localStorage.setItem('authToken', result.data.token);
   103	        localStorage.setItem('user', JSON.stringify(result.data.user));
   104	        
   105	        // Refresh Token 저장 (옵션)
   106	        if (result.data.refreshToken) {
   107	            localStorage.setItem('refreshToken', result.data.refreshToken);
   108	        }
   109	    }
   110	
   111	    return result;
   112	}
   113	
   114	// 로그아웃
   115	function logout() {
   116	    // 토큰 삭제
   117	    localStorage.removeItem('authToken');
   118	    localStorage.removeItem('refreshToken');
   119	    localStorage.removeItem('user');
   120	    localStorage.removeItem('admin_remember');
   121	    
   122	    // 로그인 페이지로 리다이렉트
   123	    window.location.href = 'login.html';
   124	}
   125	
   126	// 사용자 정보 가져오기
   127	async function getUserProfile() {
   128	    return await apiRequest('/api/auth/profile', {
   129	        method: 'GET'
   130	    });
   131	}
   132	
   133	// 토큰 갱신
   134	async function refreshToken() {
   135	    const refreshToken = localStorage.getItem('refreshToken');
   136	    
   137	    if (!refreshToken) {
   138	        handleUnauthorized();
   139	        return null;
   140	    }
   141	
   142	    const result = await apiRequest('/api/auth/refresh', {
   143	        method: 'POST',
   144	        body: { refreshToken }
   145	    });
   146	
   147	    if (result.success && result.data.token) {
   148	        localStorage.setItem('authToken', result.data.token);
   149	        return result.data.token;
   150	    }
   151	
   152	    return null;
   153	}
   154	
   155	// 인증 실패 처리
   156	function handleUnauthorized() {
   157	    console.warn('🔒 인증이 필요합니다. 로그인 페이지로 이동합니다.');
   158	    
   159	    // 현재 페이지 URL 저장 (로그인 후 돌아오기 위해)
   160	    const currentPage = window.location.pathname;
   161	    localStorage.setItem('redirectAfterLogin', currentPage);
   162	    
   163	    // 로그아웃 처리
   164	    logout();
   165	}
   166	
   167	/**
   168	 * 관리자 API
   169	 */
   170	
   171	// 사용자 목록 조회
   172	async function getUsers(page = 1, limit = 20) {
   173	    return await apiRequest(`/api/admin/users?page=${page}&limit=${limit}`, {
   174	        method: 'GET'
   175	    });
   176	}
   177	
   178	// 사용자 상세 조회
   179	async function getUserById(userId) {
   180	    return await apiRequest(`/api/admin/users/${userId}`, {
   181	        method: 'GET'
   182	    });
   183	}
   184	
   185	// 사용자 정보 수정
   186	async function updateUser(userId, userData) {
   187	    return await apiRequest(`/api/admin/users/${userId}`, {
   188	        method: 'PUT',
   189	        body: userData
   190	    });
   191	}
   192	
   193	// 사용자 삭제
   194	async function deleteUser(userId) {
   195	    return await apiRequest(`/api/admin/users/${userId}`, {
   196	        method: 'DELETE'
   197	    });
   198	}
   199	
   200	// 주문 목록 조회
   201	async function getOrders(page = 1, limit = 20) {
   202	    return await apiRequest(`/api/admin/orders?page=${page}&limit=${limit}`, {
   203	        method: 'GET'
   204	    });
   205	}
   206	
   207	// 통계 데이터 조회
   208	async function getStatistics() {
   209	    return await apiRequest('/api/admin/statistics', {
   210	        method: 'GET'
   211	    });
   212	}
   213	
   214	/**
   215	 * 사주 서비스 API
   216	 */
   217	
   218	// 사주 분석 요청
   219	async function requestSajuAnalysis(birthData) {
   220	    return await apiRequest('/api/saju/analyze', {
   221	        method: 'POST',
   222	        body: birthData
   223	    });
   224	}
   225	
   226	// 궁합 분석 요청
   227	async function requestCompatibility(person1, person2) {
   228	    return await apiRequest('/api/saju/compatibility', {
   229	        method: 'POST',
   230	        body: { person1, person2 }
   231	    });
   232	}
   233	
   234	// 구매 내역 조회
   235	async function getPurchaseHistory() {
   236	    return await apiRequest('/api/purchases/history', {
   237	        method: 'GET'
   238	    });
   239	}
   240	
   241	/**
   242	 * 유틸리티 함수
   243	 */
   244	
   245	// 인증 상태 확인
   246	function isAuthenticated() {
   247	    const token = localStorage.getItem('authToken');
   248	    const user = localStorage.getItem('user');
   249	    return !!(token && user);
   250	}
   251	
   252	// 관리자 권한 확인
   253	function isAdmin() {
   254	    if (!isAuthenticated()) return false;
   255	    
   256	    const user = JSON.parse(localStorage.getItem('user'));
   257	    return user && user.role === 'admin';
   258	}
   259	
   260	// 현재 사용자 정보
   261	function getCurrentUser() {
   262	    if (!isAuthenticated()) return null;
   263	    return JSON.parse(localStorage.getItem('user'));
   264	}
   265	
   266	// 페이지 접근 권한 확인 (관리자 페이지용)
   267	function requireAdmin() {
   268	    if (!isAdmin()) {
   269	        alert('❌ 관리자 권한이 필요합니다.');
   270	        window.location.href = 'index.html';
   271	        return false;
   272	    }
   273	    return true;
   274	}
   275	
   276	// 페이지 접근 권한 확인 (로그인 필수 페이지용)
   277	function requireAuth() {
   278	    if (!isAuthenticated()) {
   279	        alert('🔒 로그인이 필요합니다.');
   280	        window.location.href = 'login.html';
   281	        return false;
   282	    }
   283	    return true;
   284	}
   285	
   286	/**
   287	 * 에러 핸들링
   288	 */
   289	window.addEventListener('error', (event) => {
   290	    // 외부 스크립트 에러 무시
   291	    if (event.filename && !event.filename.includes('aisaju1000.com')) {
   292	        event.preventDefault();
   293	    }
   294	});
   295	
   296	console.log('✅ API 클라이언트 로드 완료');
   297	
