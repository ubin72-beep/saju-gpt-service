# 검색 엔진 등록 가이드

## 📋 생성된 파일
- ✅ `sitemap.xml` - 사이트 구조 맵
- ✅ `robots.txt` - 크롤링 규칙

---

## 🔍 1. Google Search Console 등록

### 단계 1: 사이트 등록
1. https://search.google.com/search-console 접속
2. "속성 추가" 클릭
3. "URL 접두어" 선택 → `https://aisaju1000.com` 입력

### 단계 2: 소유권 확인
**방법 1: HTML 파일 업로드 (추천)**
- Google이 제공하는 HTML 파일 다운로드
- 사이트 루트에 업로드
- "확인" 클릭

**방법 2: 메타 태그**
- Google이 제공하는 메타 태그를 index.html `<head>`에 추가

### 단계 3: 사이트맵 제출
1. 좌측 메뉴 "Sitemaps" 클릭
2. `sitemap.xml` 입력 후 제출
3. 처리 완료까지 1-3일 소요

---

## 📍 2. Naver Search Advisor 등록

### 단계 1: 웹마스터 도구 접속
1. https://searchadvisor.naver.com 접속
2. 네이버 로그인
3. "사이트 등록" 클릭

### 단계 2: 사이트 소유 확인
**방법 1: HTML 파일 업로드 (추천)**
```
naver[고유코드].html 파일을 루트에 업로드
```

**방법 2: 메타 태그**
```html
<meta name="naver-site-verification" content="고유코드" />
```

### 단계 3: 사이트맵 제출
1. "요청" → "사이트맵 제출" 클릭
2. `https://aisaju1000.com/sitemap.xml` 입력
3. 제출 완료

### 단계 4: RSS 등록 (선택)
- 블로그가 있다면 RSS 주소 추가

---

## 🎯 3. 추가 검색 엔진 등록

### Bing Webmaster Tools
1. https://www.bing.com/webmasters 접속
2. Google Search Console 계정으로 가져오기 가능
3. 또는 수동 등록

### Daum (선택)
- 현재 검색 점유율 낮음
- 자동 크롤링 의존

---

## 📊 4. Google Analytics 설치 (필수)

### Google Analytics 4 (GA4) 설정
1. https://analytics.google.com 접속
2. "속성 만들기" 클릭
3. 추적 ID 발급 받기
4. 모든 페이지 `<head>` 태그에 추가:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔔 5. Naver Analytics 설치

1. https://analytics.naver.com 접속
2. 사이트 등록
3. 스크립트 코드 발급
4. 모든 페이지에 추가

---

## ⏰ 6. 노출 시기 예상

### Google
- 사이트맵 제출 후: **1-3일**
- 본격 노출 시작: **1-2주**
- 상위 노출: **1-3개월** (키워드 경쟁도에 따라)

### Naver
- 사이트맵 제출 후: **3-7일**
- 본격 노출 시작: **2-4주**
- 상위 노출: **2-6개월** (콘텐츠 품질에 따라)

---

## 📈 7. SEO 최적화 팁

### 콘텐츠 전략
1. **키워드 리서치**
   - "사주팔자"
   - "무료 사주"
   - "2026 운세"
   - "토정비결"
   - "궁합 보기"

2. **블로그 콘텐츠 작성**
   - 사주 관련 정보성 글
   - 주 2-3회 포스팅
   - 최소 1,000자 이상

3. **외부 링크 확보**
   - 관련 사이트와 상호 링크
   - 블로그, 카페에 링크 게시

### 기술적 SEO
- ✅ 사이트 속도 최적화
- ✅ 모바일 최적화 (완료)
- ✅ HTTPS 적용 (완료)
- ⚠️ 이미지 alt 태그 추가
- ⚠️ 페이지별 메타 설명 최적화

---

## 🎯 8. 즉시 실행 체크리스트

### 오늘 해야 할 일
- [ ] Google Search Console 등록
- [ ] Naver Search Advisor 등록
- [ ] sitemap.xml 제출 (Google)
- [ ] sitemap.xml 제출 (Naver)
- [ ] Google Analytics 설치
- [ ] Naver Analytics 설치

### 이번 주 해야 할 일
- [ ] 블로그 개설 (네이버 블로그 추천)
- [ ] 첫 블로그 포스팅 3개 작성
- [ ] SNS 계정 개설 (인스타그램, 페이스북)
- [ ] 카카오톡 채널 개설

### 이번 달 해야 할 일
- [ ] 블로그 10개 이상 포스팅
- [ ] 네이버 지식iN 답변 활동
- [ ] 관련 커뮤니티 가입 및 활동
- [ ] 유료 광고 테스트 (예산: 10만원)

---

## 💡 추가 문의

1. **Google Analytics 추적 코드 설치**가 필요하시면 말씀해주세요!
2. **메타 태그 최적화**가 필요하시면 작업해드립니다!
3. **블로그 콘텐츠 아이디어**가 필요하시면 제안해드립니다!

---

**작성일**: 2026-01-07  
**상태**: ✅ sitemap.xml, robots.txt 생성 완료
