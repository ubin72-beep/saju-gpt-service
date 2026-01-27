# 🔍 우측 하단 플로팅 버튼 확인 가이드
   	
	## 📋 **문제 증상**
	- **위치:** 우측 하단
	- **모양:** 검은색 동그란 버튼
	- **아이콘:** 시계 아이콘 + 메뉴 아이콘 (3줄)
	- **문제:** 사이트에 추가하지 않은 버튼이 나타남

	---

	## 🔍 **원인 확인 방법**
	
	### **Step 1: 시크릿 모드 테스트 (가장 쉬움)**
	
	#### **Chrome**
	1. `Ctrl + Shift + N` (Windows) 또는 `Cmd + Shift + N` (Mac)
	2. 시크릿 창에서 사이트 열기: `https://www.aisaju1000.com/`
	3. **버튼이 사라지면** → 브라우저 확장 프로그램이 원인!
	
	#### **Safari**
	1. `Cmd + Shift + N`
	2. 시크릿 창에서 사이트 열기
	3. 버튼 확인

	#### **Edge**
	1. `Ctrl + Shift + N` (Windows) 또는 `Cmd + Shift + N` (Mac)
	2. InPrivate 창에서 사이트 열기
	3. 버튼 확인

	---
	
	### **Step 2: 브라우저 확장 프로그램 확인**
	#### **Chrome/Edge**
	1. 주소창에 입력: `chrome://extensions/` (Chrome) 또는 `edge://extensions/` (Edge)
	2. 모든 확장 프로그램 목록 확인
	3. **의심되는 확장 프로그램:**
   - 번역 도구 (Google Translate, Papago)
	   - 광고 차단 (AdBlock, uBlock Origin)
  - 스크린샷 도구
	   - AI 어시스턴트 (ChatGPT, Copilot, Gemini)
	   - 생산성 도구 (Notion, Evernote Web Clipper)
	   - 시간 관리 (RescueTime, Toggl Track)

. 확장 프로그램 비활성화 테스트:
	   - 사이트 새로고침
   - 버튼 사라지는지 확인

	#### **Safari**
	1. Safari → 환경설정 → 확장 프로그램
	2. 모든 확장 프로그램 끄기
	3. 사이트 새로고침
	
	---
	
	### **Step 3: 개발자 도구로 확인**

	#### **방법**
	1. 사이트에서 `F12` 눌러 개발자 도구 열기
2. **Elements/요소** 탭 선택
	3. 좌측 상단 **선택 도구** 클릭 (화살표 아이콘)
	4. 우측 하단 버튼 클릭
	5. HTML 코드 확인:
	   - `data-extension-id` 속성이 있으면 → **확장 프로그램**
   - `iframe` 태그가 있으면 → **외부 스크립트**
	   - `id` 또는 `class`에 외부 서비스 이름이 있으면 → **외부 위젯**

	#### **예시 코드 (확장 프로그램)**
	```html
	<div data-extension-id="abcdef12345" style="position: fixed; bottom: 20px; right: 20px;">
  <button>...</button>
	</div>
	```

	#### **예시 코드 (외부 위젯)**
	```html
	<iframe src="https://widget.example.com/" style="position: fixed; bottom: 20px; right: 20px;"></iframe>
	```

	---
	
	## 🚨 **예상 원인 TOP 5**
	
	### **1. AI 어시스턴트 확장 프로그램**
	- **ChatGPT Sidebar**
- **Copilot**
	- **Gemini**
	- **Merlin AI**
	- **Monica AI**
	
	**확인 방법:** Chrome Extensions에서 "AI", "Chat", "Assistant" 검색

	---

 	### **2. 번역 도구**
	- **Google Translate**
	- **Papago**
	- **DeepL**

	**확인 방법:** 번역 아이콘이 있는지 확인

	---
	
	### **3. 광고 차단 도구**
	- **AdBlock**
	- **uBlock Origin**
	- **AdGuard**
	
	**확인 방법:** 방패 아이콘이 있는지 확인

	---

	### **4. 시간 관리 도구**
	- **RescueTime**
 	- **Toggl Track**
	- **Clockify**
	
	**확인 방법:** 시계 아이콘 → 시간 추적 도구일 가능성

	---

### **5. 외부 스크립트 (드물음)**
	- **Google Analytics**
	- **Hotjar**
	- **Intercom (채팅 위젯)**
	- **Zendesk**

	**확인 방법:** 개발자 도구에서 `<script>` 태그 확인
	
	---
	
	## ✅ **해결 방법**
	
	### **방법 1: 확장 프로그램 비활성화**
 	1. 원인이 되는 확장 프로그램 찾기
	2. Chrome Extensions에서 비활성화 또는 삭제
	3. 사이트 새로고침

	---

	### **방법 2: CSS로 숨기기 (임시)**

	만약 **외부 스크립트**가 원인이고 제거할 수 없다면, 사이트에 CSS 추가:

	#### **index.html에 추가**
	```html
	<style>
 	/* 우측 하단 플로팅 버튼 숨기기 */
	div[style*="position: fixed"][style*="bottom"][style*="right"] {
     display: none !important;
	}
 	
	/* 특정 ID가 있다면 (개발자 도구에서 확인 후) */
 	#floating-button-id {
	    display: none !important;
	}
	</style>
	```

	**주의:** 이 방법은 다른 중요한 버튼도 숨길 수 있으므로, 개발자 도구에서 정확한 선택자를 확인 후 사용하세요!

	---

	### **방법 3: 사이트 소유자에게 문의**
	
	만약 **외부 스크립트**가 원인이고, 사이트 관리자가 추가한 것이라면:
	- Google Analytics
	- Hotjar
	- Intercom 채팅 위젯

→ 사이트 관리자에게 문의해서 제거 요청
 
	---

	## 📊 **진단 체크리스트**
 	
	### **확인 사항**
 	- [ ] 시크릿 모드에서 버튼이 사라지나요?
	  - ✅ 예 → 브라우저 확장 프로그램이 원인
	  - ❌ 아니오 → Step 2로

	- [ ] Chrome Extensions에서 의심되는 확장 프로그램이 있나요?
	  - ✅ 예 → 비활성화 후 테스트
  	  - ❌ 아니오 → Step 3으로

	- [ ] 개발자 도구에서 `data-extension-id` 속성이 있나요?
  - ✅ 예 → 확장 프로그램 확정
	  - ❌ 아니오 → 외부 스크립트 가능성

	- [ ] 개발자 도구에서 `iframe` 태그가 있나요?
  - ✅ 예 → 외부 위젯 (Intercom, Zendesk 등)
  - ❌ 아니오 → 사이트 코드 확인 필요

	---

	## 💡 **추가 정보**
 
	### **자주 나타나는 플로팅 버튼**

 | 아이콘 | 서비스 | 설명 |
  |--------|--------|------|
	| 💬 | Intercom, Zendesk | 채팅 위젯 |
| 🤖 | ChatGPT, Copilot | AI 어시스턴트 |
| 🌐 | Google Translate | 번역 도구 |
	| ⏱️ | RescueTime, Toggl | 시간 추적 |
	| 🛡️ | AdBlock | 광고 차단 |
	| 📸 | Awesome Screenshot | 스크린샷 도구 |
 
	---
 
	## 🎯 **결론**

	**가장 가능성 높은 원인:** 브라우저 확장 프로그램

	**추천 확인 순서:**
	1. 시크릿 모드 테스트 (1분)
	2. Chrome Extensions 확인 (2분)
	3. 개발자 도구로 정확한 원인 파악 (5분)

 	**해결 방법:**
- 확장 프로그램 비활성화 (추천)
	- CSS로 숨기기 (임시)

	---

	## 📞 **추가 도움**

	막히는 부분이 있으면 알려주세요!

	1. 시크릿 모드 결과
	2. 설치된 확장 프로그램 목록
	3. 개발자 도구 스크린샷
  	
	위 정보를 주시면 정확한 원인을 찾아드리겠습니다! 🚀

	---

	**작성일:** 2026-01-14  
**문의:** aisaju1000@gmail.com
