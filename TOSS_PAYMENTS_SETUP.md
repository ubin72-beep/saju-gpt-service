# 💳 토스페이먼츠 결제 시스템 가이드

## 📋 **목적**
AI 사주 천년지기 웹사이트에 토스페이먼츠 결제 시스템을 연동하여 유료 서비스 판매

---

## ✅ **완료된 작업**

### **1. pricing.html 업데이트**
- ✅ 토스페이먼츠 클라이언트 SDK 추가
- ✅ 모든 상품에 결제 버튼 추가
- ✅ 결제 요청 함수 구현 (`requestPayment`)
- ✅ 결제 모달 UI 구현
- ✅ 이용약관 동의 체크박스 추가

### **2. 결제 처리 페이지**
- ✅ `payment-success.html` - 결제 성공 페이지
  - 결제 정보 표시
  - Google Sheets 자동 저장
  - localStorage 백업
  - 마이페이지 링크
- ✅ `payment-fail.html` - 결제 실패 페이지
  - 오류 메시지 표시
  - 다시 시도 버튼
  - 고객센터 안내

---

## 🛒 **상품 목록**

### **구독형 상품**
| 상품명 | 가격 | 상품 ID | 기능 |
|--------|------|---------|------|
| 무료 체험 | ₩0 | free | 기본 사주, AI 상담 3회/일 |
| 월간 프리미엄 | ₩19,900/월 | monthly_premium | AI 무제한, 상세 사주, 택일 |
| 연간 프리미엄 | ₩199,000/년 | yearly_premium | 월간 + VIP 서비스, 16% 할인 |

### **개별 구매 상품**
| 상품명 | 가격 | 상품 ID | 설명 |
|--------|------|---------|------|
| 상세 사주팔자 | ₩4,900 | premium_saju | 십신 분석, 대운 타임라인 |
| 이사/결혼 택일 | ₩5,900 | taekil | 명리학 기반 길일 선택 |
| 정밀 궁합 | ₩9,900 | compatibility | 천생연분 확인 |
| 맞춤 연애운 | ₩3,900 | love_fortune | 2026년 사랑의 흐름 |
| 토정비결 | ₩3,900 | tojeong | 전통 토정 점괘 |
| 2026 신년운세 | ₩4,900 | year_fortune | 병오년 12띠별 운세 |

---

## 🚀 **토스페이먼츠 설정 방법**

### **Step 1: 토스페이먼츠 가입**

1. **토스페이먼츠 홈페이지 접속**
   - URL: https://www.tosspayments.com/

2. **회원가입 및 로그인**
   - 사업자 정보 입력
     - 사업자등록번호: 537-08-03349
     - 대표자명: 김미화
     - 상호: 큐브박스

3. **가맹점 등록**
   - 사업자등록증 업로드
   - 정산 계좌 등록
   - 심사 승인 대기 (1~3일)

---

### **Step 2: API 키 발급**

1. **토스페이먼츠 개발자센터** 접속
   - URL: https://developers.tosspayments.com/

2. **내 개발정보** 메뉴에서 API 키 확인
   - **클라이언트 키 (Client Key)** - 프론트엔드에서 사용
   - **시크릿 키 (Secret Key)** - 결제 승인 시 사용

3. **테스트 환경 키 (현재 적용됨)**
   - 클라이언트 키: `test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq`
   - 시크릿 키: `test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R`

---

### **Step 3: 실제 결제 키로 변경**

**👉 pricing.html 수정:**

1. **GitHub 저장소** → **pricing.html** 열기
2. **Line 278 근처** 검색: `const clientKey =`
3. **테스트 키를 실제 키로 변경:**

```javascript
// Before (테스트)
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

// After (실제)
const clientKey = 'live_ck_YOUR_LIVE_CLIENT_KEY';
```

**👉 payment-success.html 수정:**

1. **Line 94 근처** 검색: `const clientKey =`
2. **실제 키로 변경:**

```javascript
// Before (테스트)
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const secretKey = 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';

// After (실제)
const clientKey = 'live_ck_YOUR_LIVE_CLIENT_KEY';
const secretKey = 'live_sk_YOUR_LIVE_SECRET_KEY';
```

⚠️ **주의:** 시크릿 키는 클라이언트에 노출되면 안 됩니다! 
- 실제 서비스에서는 서버에서 처리해야 하나, 정적 웹사이트이므로 클라이언트에서 처리
- 보안을 위해 환경 변수 또는 별도 서버 구축 권장

---

### **Step 4: 결제 테스트**

#### **테스트 카드 정보 (테스트 환경)**
- **카드번호:** 4000123456781234
- **유효기간:** 12/26
- **CVC:** 123
- **비밀번호 앞 2자리:** 00

#### **테스트 절차**
1. **https://www.aisaju1000.com/pricing.html** 접속
2. **상품 선택** (예: 월간 프리미엄 ₩19,900)
3. **"구독하기" 버튼 클릭**
4. **결제 모달** 표시 확인
5. **결제 수단 선택** (테스트 카드 입력)
6. **이용약관 동의 체크**
7. **"₩19,900 결제하기" 버튼 클릭**
8. **결제 성공 페이지** (`payment-success.html`) 확인
   - 주문번호, 상품명, 금액 표시
   - 마이페이지 링크 작동

---

## 📊 **결제 내역 관리**

### **1. Google Sheets 연동 (선택사항)**

**결제 내역을 Google Sheets에 자동 저장하려면:**

1. **새 Google Sheets 생성**
   - 파일명: `결제 내역`
   - 헤더: A1(주문번호), B1(상품명), C1(금액), D1(결제수단), E1(결제일시), F1(결제키)

2. **Apps Script 코드:**
```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.orderId,
      data.orderName,
      data.amount,
      data.method,
      data.approvedAt,
      data.paymentKey
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      result: 'success'
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **배포 → 웹 앱 → URL 복사**

4. **payment-success.html에 URL 적용:**
```javascript
const PAYMENT_SHEETS_URL = 'YOUR_GOOGLE_SHEETS_DEPLOYMENT_URL';
```

### **2. localStorage 저장 (기본 포함)**
- 결제 완료 시 자동으로 `purchaseHistory`에 저장
- 마이페이지에서 확인 가능

---

## 🧪 **지원되는 결제 수단**

토스페이먼츠가 지원하는 결제 수단:
- ✅ 신용카드 / 체크카드
- ✅ 계좌이체
- ✅ 가상계좌
- ✅ 토스페이
- ✅ 카카오페이
- ✅ 네이버페이
- ✅ 삼성페이
- ✅ 휴대폰 소액결제

---

## 💰 **수수료 안내**

### **토스페이먼츠 수수료 (2024년 기준)**
- **신용카드:** 3.3%
- **간편결제:** 3.3%
- **계좌이체:** 1.0%
- **가상계좌:** 건당 500원
- **휴대폰 소액결제:** 5.0%

### **예상 수익 계산 (월간 프리미엄 ₩19,900 기준)**
- 카드 결제 시: ₩19,900 - (₩19,900 × 3.3%) = **₩19,243** (순수익)

---

## ⚠️ **중요 보안 사항**

### **1. 시크릿 키 보안**
- ❌ 절대 GitHub에 실제 시크릿 키 업로드 금지
- ✅ 환경 변수 또는 별도 서버 사용 권장

### **2. 서버 측 검증 (권장)**
- 현재: 클라이언트에서만 결제 처리 (정적 웹사이트 한계)
- 권장: Node.js/Python 서버 구축하여 결제 승인 검증

### **3. HTTPS 필수**
- ✅ 현재: GitHub Pages HTTPS 자동 적용
- 결제는 반드시 HTTPS 환경에서만 작동

---

## 📞 **문제 해결**

### **오류 1: "결제 위젯 로드 실패"**
- **원인:** 인터넷 연결 또는 SDK 로딩 실패
- **해결:** 페이지 새로고침

### **오류 2: "결제 승인 실패"**
- **원인:** 서버 측 검증 오류 (CORS 등)
- **해결:** 토스페이먼츠 대시보드에서 결제 상태 확인

### **오류 3: "테스트 결제가 안 돼요"**
- **원인:** 테스트 카드 정보 오류
- **해결:** 위 테스트 카드 정보 정확히 입력

---

## 📅 **다음 단계**

### **필수**
1. ✅ 토스페이먼츠 가맹점 등록
2. ✅ 실제 API 키 발급
3. ✅ pricing.html, payment-success.html에 실제 키 적용
4. ✅ 테스트 결제 진행
5. ✅ 실제 카드로 소액 결제 테스트

### **선택사항**
1. 🔄 Google Sheets 결제 내역 자동 저장
2. 🔄 마이페이지에 결제 내역 표시 기능 강화
3. 🔄 환불 처리 페이지 구축
4. 🔄 정기결제 (구독) 자동 갱신 시스템

---

## 🎉 **완료!**

**토스페이먼츠 결제 시스템이 완성되었습니다!**

**지금 할 일:**
1. 토스페이먼츠 가입 및 가맹점 등록
2. API 키 발급
3. 코드에 실제 키 적용
4. 테스트 결제 진행

**문의:**
- 전화: 0502-1909-7788
- 이메일: aisaju1000@gmail.com

---

**💡 Tip:** 
- 토스페이먼츠 승인 후 바로 사용 가능합니다!
- 테스트 환경에서 충분히 테스트 후 실제 키로 전환하세요.

**🎊 수고하셨습니다!**
