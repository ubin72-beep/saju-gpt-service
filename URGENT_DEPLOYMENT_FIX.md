# 🚨 긴급 배포 수정 가이드

## 문제 증상
- 시크릿 모드에서도 HTML 코드가 텍스트로 표시됨
- 웹사이트 디자인이 전혀 보이지 않음
- Content-Type이 text/plain으로 응답됨

---

## 원인
**서버가 잘못된 MIME 타입으로 응답**
```
❌ 현재: Content-Type: text/plain
✅ 필요: Content-Type: text/html
```

---

## ⚡ 즉시 해결 방법

### 방법 1: 재배포 (가장 확실!)

#### GenSpark 재배포
```
1) GenSpark 대시보드 접속
2) Hosting 탭 클릭
3) "호스팅 플랫폼에 배포" 버튼 클릭
4) "Clean deployment" 옵션 선택
5) 배포 완료 대기 (3~5분)
6) https://aisaju1000.com 접속
```

---

### 방법 2: _headers 파일 추가

`./_headers` 파일 생성:
```
/*
  Content-Type: text/html; charset=utf-8
  X-Content-Type-Options: nosniff

/*.html
  Content-Type: text/html; charset=utf-8

/*.css
  Content-Type: text/css; charset=utf-8

/*.js
  Content-Type: application/javascript; charset=utf-8

/*.png
  Content-Type: image/png

/*.jpg
  Content-Type: image/jpeg

/*.jpeg
  Content-Type: image/jpeg

/*.ico
  Content-Type: image/x-icon
```

---

### 방법 3: index.html → index.htm 변경

일부 서버는 .htm 확장자를 선호합니다:
```
1) index.html을 index.htm으로 복사
2) 재배포
3) https://aisaju1000.com 접속
```

---

## 🔧 Cloudflare 설정 확인

### Cloudflare 대시보드
```
1) https://dash.cloudflare.com 접속
2) aisaju1000.com 도메인 선택
3) "Rules" → "Page Rules" 확인
4) Auto Minify 설정:
   - HTML: ✅ 활성화
   - CSS: ✅ 활성화
   - JavaScript: ✅ 활성화
```

### Cloudflare 캐시 삭제
```
1) Cloudflare 대시보드
2) "Caching" → "Configuration"
3) "Purge Everything" 버튼 클릭
4) 확인
5) 5분 대기
6) https://aisaju1000.com 접속
```

---

## 🎯 임시 URL로 테스트

GenSpark 임시 URL로 테스트:
```
https://adf09da0-2262-4f47-a4cd-aed59f2940b2.vip.gensparksite.com
```

이 URL로 접속했을 때:
- **정상 표시되면**: 도메인 설정 문제
- **같은 증상이면**: 배포 설정 문제

---

## 📝 체크리스트

배포 전 확인:
- [ ] index.html 파일 존재
- [ ] <!DOCTYPE html> 선언
- [ ] <html lang="ko"> 태그
- [ ] UTF-8 인코딩
- [ ] 모든 태그 닫힘

배포 후 확인:
- [ ] 재배포 완료 (Clean deployment)
- [ ] Cloudflare 캐시 삭제
- [ ] 5분 대기
- [ ] 시크릿 모드로 접속
- [ ] Content-Type 확인 (F12 → Network)

---

## 🔍 Content-Type 확인 방법

### 개발자 도구로 확인
```
1) F12 키 누르기
2) "Network" 탭 클릭
3) 페이지 새로고침 (Ctrl + R)
4) "index.html" 또는 첫 번째 항목 클릭
5) "Headers" 탭에서 "Content-Type" 확인
```

**올바른 응답**:
```
Content-Type: text/html; charset=utf-8
```

**잘못된 응답**:
```
Content-Type: text/plain
Content-Type: application/octet-stream
```

---

## 🚀 최종 해결 순서

### 1. 즉시 실행 (5분)
```
1) GenSpark 재배포 (Clean deployment)
2) Cloudflare 캐시 삭제
3) 5분 대기
4) https://aisaju1000.com 접속
```

### 2. 문제 지속 시 (10분)
```
1) _headers 파일 추가
2) 재배포
3) 10분 대기
4) 접속 확인
```

### 3. 여전히 문제 시 (15분)
```
1) index.html → index.htm 복사
2) 재배포
3) Cloudflare 설정 확인
4) 접속 확인
```

---

## 📞 도움 요청 시 필요한 정보

스크린샷:
1. 현재 브라우저 화면
2. F12 → Network → Headers (Content-Type)
3. GenSpark 배포 로그
4. Cloudflare 설정 화면

---

*작성일: 2026-01-08*
*우선순위: 🔥 긴급*
