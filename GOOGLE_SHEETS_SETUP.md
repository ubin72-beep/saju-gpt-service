# 🎯 카카오 구독자를 Google Sheets에 저장하기

## 📌 왜 Google Sheets?

- ✅ **완전 무료**
- ✅ **설정 5분**
- ✅ **실시간 확인 가능**
- ✅ **어디서든 접속 가능**
- ✅ **엑셀처럼 사용 가능**
- ✅ **CSV 다운로드 가능**

---

## 🚀 설정 방법 (5분!)

### Step 1: Google Sheets 만들기

1. **Google Sheets 접속**
   ```
   https://sheets.google.com/
   ```

2. **새 스프레드시트 만들기**

3. **시트 이름 변경**: "카카오 구독자"

4. **첫 번째 행에 헤더 입력:**
   | A열 | B열 | C열 | D열 | E열 |
   |-----|-----|-----|-----|-----|
   | 이름 | 전화번호 | 생년 | 띠 | 가입일시 |

---

### Step 2: Google Apps Script 설정

1. **상단 메뉴**: 확장 프로그램 → Apps Script

2. **아래 코드 복사 붙여넣기:**

```javascript
function doPost(e) {
  try {
    // JSON 데이터 파싱
    const data = JSON.parse(e.postData.contents);
    
    // 시트 가져오기
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 데이터 추가
    sheet.appendRow([
      data.userName,
      data.userPhone,
      data.birthYear + '년',
      data.zodiac + '띠',
      new Date(data.subscribedAt).toLocaleString('ko-KR')
    ]);
    
    // 성공 응답
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: '구독 신청이 완료되었습니다!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // 에러 응답
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // 헤더 제외
  const subscribers = data.slice(1).map(row => ({
    userName: row[0],
    userPhone: row[1],
    birthYear: row[2],
    zodiac: row[3],
    subscribedAt: row[4]
  }));
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    count: subscribers.length,
    data: subscribers
  })).setMimeType(ContentService.MimeType.JSON);
}
```

3. **저장** (디스크 아이콘 클릭)

4. **배포 → 새 배포**
   - "유형 선택": 웹 앱
   - "액세스 권한": 모든 사용자
   - **배포** 클릭

5. **웹 앱 URL 복사**
   ```
   https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

---

### Step 3: 웹사이트 코드 수정

**이 URL을 알려주시면 제가 코드를 수정해드리겠습니다!**

수정할 부분:
```javascript
// Google Sheets에 저장
const GOOGLE_SHEETS_URL = 'YOUR_URL_HERE';

fetch(GOOGLE_SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify(formData)
});
```

---

## 📊 사용 방법

### 구독자 확인
```
Google Sheets에서 실시간으로 확인!
```

### 띠별 통계
```
=COUNTIF(D:D, "쥐띠")
```

### 오늘 가입자
```
=COUNTIF(E:E, TODAY())
```

---

## ✅ 다음 단계

1. **Google Sheets 만들기** ✅
2. **Apps Script 설정** ✅
3. **웹 앱 URL 복사** ✅
4. **URL 알려주기** → 제가 코드 수정해드림!

---

**Google Sheets URL을 알려주시면 바로 적용해드리겠습니다!** 🚀
