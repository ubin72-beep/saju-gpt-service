 1	/**
     2	 * PDF 보고서 다운로드 기능
     3	 * 프리미엄 사용자 전용
     4	 */
     5	
     6	/**
     7	 * PDF 보고서 생성 요청
     8	 */
     9	async function requestPDFReport() {
    10	    const user = getCurrentUser();
    11	    
    12	    if (!user) {
    13	        alert('로그인이 필요합니다.');
    14	        window.location.href = 'login.html';
    15	        return;
    16	    }
    17	
    18	    if (!isPremiumUser()) {
    19	        if (confirm('PDF 보고서는 프리미엄 회원 전용 기능입니다.\n프리미엄으로 업그레이드하시겠습니까?')) {
    20	            window.location.href = 'pricing.html';
    21	        }
    22	        return;
    23	    }
    24	
    25	    if (!user.sajuData) {
    26	        alert('먼저 사주팔자를 계산해주세요.');
    27	        window.location.href = 'index.html';
    28	        return;
    29	    }
    30	
    31	    try {
    32	        // 로딩 표시
    33	        showLoadingModal('보고서를 생성하고 있습니다...');
    34	
    35	        const response = await fetch('/api/report/generate', {
    36	            method: 'POST',
    37	            headers: {
    38	                'Content-Type': 'application/json',
    39	                'Authorization': `Bearer ${getUserToken()}`
    40	            },
    41	            body: JSON.stringify({
    42	                userId: user.id,
    43	                sajuData: user.sajuData
    44	            })
    45	        });
    46	
    47	        if (!response.ok) {
    48	            throw new Error('보고서 생성 실패');
    49	        }
    50	
    51	        const blob = await response.blob();
    52	        
    53	        // PDF 다운로드
    54	        const url = window.URL.createObjectURL(blob);
    55	        const a = document.createElement('a');
    56	        a.href = url;
    57	        a.download = `사주보고서_${user.name}_${new Date().toISOString().split('T')[0]}.pdf`;
    58	        document.body.appendChild(a);
    59	        a.click();
    60	        document.body.removeChild(a);
    61	        window.URL.revokeObjectURL(url);
    62	
    63	        hideLoadingModal();
    64	        alert('✅ PDF 보고서가 다운로드되었습니다!');
    65	
    66	    } catch (error) {
    67	        console.error('❌ PDF 생성 오류:', error);
    68	        hideLoadingModal();
    69	        alert('보고서 생성 중 오류가 발생했습니다.');
    70	    }
    71	}
    72	
    73	/**
    74	 * 이메일로 보고서 전송
    75	 */
    76	async function sendReportByEmail() {
    77	    const user = getCurrentUser();
    78	    
    79	    if (!user) {
    80	        alert('로그인이 필요합니다.');
    81	        return;
    82	    }
    83	
    84	    if (!isPremiumUser()) {
    85	        alert('프리미엄 회원 전용 기능입니다.');
    86	        return;
    87	    }
    88	
    89	    const email = prompt('보고서를 받을 이메일 주소를 입력하세요:', user.email);
    90	    
    91	    if (!email) return;
    92	
    93	    try {
    94	        showLoadingModal('이메일을 전송하고 있습니다...');
    95	
    96	        const response = await fetch('/api/report/email', {
    97	            method: 'POST',
    98	            headers: {
    99	                'Content-Type': 'application/json',
   100	                'Authorization': `Bearer ${getUserToken()}`
   101	            },
   102	            body: JSON.stringify({
   103	                userId: user.id,
   104	                email: email,
   105	                sajuData: user.sajuData
   106	            })
   107	        });
   108	
   109	        if (!response.ok) {
   110	            throw new Error('이메일 전송 실패');
   111	        }
   112	
   113	        hideLoadingModal();
   114	        alert(`✅ ${email}로 보고서가 전송되었습니다!`);
   115	
   116	    } catch (error) {
   117	        console.error('❌ 이메일 전송 오류:', error);
   118	        hideLoadingModal();
   119	        alert('이메일 전송 중 오류가 발생했습니다.');
   120	    }
   121	}
   122	
   123	/**
   124	 * 보고서 미리보기 (HTML 버전)
   125	 */
   126	async function previewReport() {
   127	    const user = getCurrentUser();
   128	    
   129	    if (!user || !user.sajuData) {
   130	        alert('먼저 사주팔자를 계산해주세요.');
   131	        return;
   132	    }
   133	
   134	    try {
   135	        const response = await fetch('/api/report/preview', {
   136	            method: 'POST',
   137	            headers: {
   138	                'Content-Type': 'application/json',
   139	                'Authorization': `Bearer ${getUserToken()}`
   140	            },
   141	            body: JSON.stringify({
   142	                userId: user.id,
   143	                sajuData: user.sajuData
   144	            })
   145	        });
   146	
   147	        if (!response.ok) {
   148	            throw new Error('미리보기 생성 실패');
   149	        }
   150	
   151	        const html = await response.text();
   152	        
   153	        // 새 창에서 미리보기
   154	        const previewWindow = window.open('', '_blank');
   155	        previewWindow.document.write(html);
   156	        previewWindow.document.close();
   157	
   158	    } catch (error) {
   159	        console.error('❌ 미리보기 오류:', error);
   160	        alert('미리보기 생성 중 오류가 발생했습니다.');
   161	    }
   162	}
   163	
   164	/**
   165	 * 로딩 모달 표시
   166	 */
   167	function showLoadingModal(message) {
   168	    const modal = document.createElement('div');
   169	    modal.id = 'loadingModal';
   170	    modal.style.cssText = `
   171	        position: fixed;
   172	        top: 0;
   173	        left: 0;
   174	        right: 0;
   175	        bottom: 0;
   176	        background: rgba(0, 0, 0, 0.7);
   177	        display: flex;
   178	        align-items: center;
   179	        justify-content: center;
   180	        z-index: 10000;
   181	    `;
   182	    
   183	    modal.innerHTML = `
   184	        <div style="background: white; padding: 40px; border-radius: 12px; text-align: center;">
   185	            <div class="spinner" style="
   186	                border: 4px solid #f3f3f3;
   187	                border-top: 4px solid #6b46c1;
   188	                border-radius: 50%;
   189	                width: 50px;
   190	                height: 50px;
   191	                animation: spin 1s linear infinite;
   192	                margin: 0 auto 20px;
   193	            "></div>
   194	            <p style="color: #333; font-size: 1.1rem;">${message}</p>
   195	        </div>
   196	    `;
   197	    
   198	    document.body.appendChild(modal);
   199	}
   200	
   201	/**
   202	 * 로딩 모달 숨기기
   203	 */
   204	function hideLoadingModal() {
   205	    const modal = document.getElementById('loadingModal');
   206	    if (modal) {
   207	        modal.remove();
   208	    }
   209	}
   210	
   211	/**
   212	 * 보고서 버튼 UI 추가
   213	 */
   214	function addReportButtons() {
   215	    const resultSection = document.querySelector('.result-section');
   216	    if (!resultSection) return;
   217	
   218	    const reportButtons = document.createElement('div');
   219	    reportButtons.className = 'report-actions';
   220	    reportButtons.style.cssText = `
   221	        margin-top: 30px;
   222	        padding: 20px;
   223	        background: linear-gradient(135deg, #f0e7ff, #e9d8fd);
   224	        border-radius: 12px;
   225	        text-align: center;
   226	    `;
   227	    
   228	    reportButtons.innerHTML = `
   229	        <h3 style="margin-bottom: 15px; color: #553c9a;">
   230	            <i class="fas fa-file-pdf"></i> 상세 분석 보고서
   231	        </h3>
   232	        <p style="margin-bottom: 20px; color: #2d3748;">
   233	            당신의 사주팔자를 PDF 보고서로 받아보세요!
   234	        </p>
   235	        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
   236	            <button onclick="previewReport()" class="btn btn-secondary">
   237	                <i class="fas fa-eye"></i> 미리보기
   238	            </button>
   239	            <button onclick="requestPDFReport()" class="btn btn-primary">
   240	                <i class="fas fa-download"></i> PDF 다운로드
   241	            </button>
   242	            <button onclick="sendReportByEmail()" class="btn btn-secondary">
   243	                <i class="fas fa-envelope"></i> 이메일 전송
   244	            </button>
   245	        </div>
   246	        ${!isPremiumUser() ? `
   247	        <p style="margin-top: 15px; font-size: 0.9rem; color: #e53e3e;">
   248	            <i class="fas fa-lock"></i> 프리미엄 회원 전용 기능입니다
   249	        </p>
   250	        ` : ''}
   251	    `;
   252	    
   253	    resultSection.appendChild(reportButtons);
   254	}
   255	
   256	// 페이지 로드 시 버튼 추가
   257	document.addEventListener('DOMContentLoaded', () => {
   258	    if (window.location.pathname.includes('result.html')) {
   259	        setTimeout(addReportButtons, 1000); // 결과 표시 후 버튼 추가
   260	    }
   261	});
   262	
   263	console.log('✅ PDF 보고서 다운로드 시스템 로드 완료');
   264	