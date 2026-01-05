# AI 사주 천년지기

**2026 병오년 사주팔자 운세 서비스**

## 🚀 프로젝트 개요
정통 명리학과 AI 기술을 결합한 온라인 사주 분석 서비스

## 📦 최근 업데이트 (2026-01-05)
- ✅ **blog/year-2026.html 완전 재구성** (10개 주제 통합 가이드)
- ✅ **JavaScript 오류 완전 해결** (index.html 구조 적용)
- ✅ **12띠 운세 카드 그리드** (종합운 점수 + 행운의 달)
- ✅ **부드러운 스크롤 구현** (목차 링크)
- ✅ **전역 에러 핸들러 적용** (브라우저 확장 프로그램 오류 무시)
- ✅ **Content-Type 문제 해결** (HTML 소스 노출 해결)

## 🌐 배포 URL
- **Production**: https://aisaju1000.com
- **GitHub Pages**: https://ubin72-beep.github.io/saju-gpt-service/

## 🛠️ 기술 스택
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Noto Sans KR, Noto Serif KR)
- **Hosting**: GitHub Pages + Vercel
- **Domain**: aisaju1000.com

## 📂 프로젝트 구조
```
saju-gpt-service/
├── index.html                  (메인 페이지 - 사주팔자 입력 폼)
├── result.html                 (사주 결과 페이지)
├── compatibility.html          (궁합 분석 페이지)
├── ai-chat.html               (AI 상담 페이지)
├── blog.html                  (블로그 메인 - 사주 가이드 목록)
├── blog/
│   ├── year-2026.html         (2026년 완벽 가이드 - 10개 주제 통합)
│   ├── 2026-year-analysis.html (2026년 운세 분석)
│   ├── saju-basics.html       (사주팔자 기초 가이드)
│   ├── compatibility-guide.html (궁합 분석 가이드)
│   ├── career-fortune.html    (직업운 가이드)
│   └── wealth-2026.html       (재물운 가이드)
├── pricing.html               (가격표)
├── mypage.html                (마이페이지)
├── vercel.json                (Vercel 배포 설정)
├── CNAME                      (커스텀 도메인)
├── .nojekyll                  (Jekyll 비활성화)
└── README.md                  (프로젝트 문서)
```

## 🎨 주요 기능

### 1. 사주팔자 무료 보기
- 생년월일, 시간, 성별 입력으로 사주 분석
- 사주팔자 (연주, 월주, 일주, 시주) 자동 계산
- 오행 분석 및 운세 해석

### 2. 정밀 궁합 분석
- 두 사람의 사주 기반 궁합 점수 계산
- 연애운, 결혼운, 재물운 상세 분석
- 천간합, 지지합 분석

### 3. AI 24시간 상담
- 실시간 AI 운세 상담
- 사주, 운세, 궁합 관련 질문 답변
- 24시간 무제한 상담

### 4. 사주 가이드 블로그
**10개 주제 통합 가이드 (blog/year-2026.html)**:
- Section 01: 2026년 병오년 완벽 분석
- Section 02: 사주팔자 기초 가이드
- Section 03: 직업운 좋은 사주 특징
- Section 04: 연애운 강한 사주
- Section 05: 재물운 사주 분석
- Section 06: 궁합 분석 사례 연구
- Section 07: 택일 완벽 가이드
- Section 08: 사주로 보는 육아
- Section 09: 사주로 보는 건강운
- Section 10: 사주 용어 사전

### 5. 12띠 운세 카드
- 12띠별 2026년 운세 상세 분석
- 종합운 점수 (5점 만점)
- 행운의 달 표시
- 띠별 특징 및 조언

### 6. 다국어 지원
- 한국어 (기본)
- English
- 中文 (중국어)
- 日本語 (일본어)

## 📊 페이지별 주요 기능

| 페이지 | URL | 주요 기능 |
|--------|-----|-----------|
| **메인** | `/index.html` | 사주팔자 입력 폼, 서비스 소개 |
| **결과** | `/result.html` | 사주팔자 결과 표시, 운세 해석 |
| **궁합** | `/compatibility.html` | 두 사람의 궁합 분석 |
| **AI 상담** | `/ai-chat.html` | 실시간 AI 운세 상담 |
| **블로그** | `/blog.html` | 사주 가이드 목록 |
| **2026 가이드** | `/blog/year-2026.html` | 10개 주제 통합 가이드 |
| **가격표** | `/pricing.html` | 서비스 요금제 안내 |
| **마이페이지** | `/mypage.html` | 사용자 정보 관리 |

## 🔧 기술적 특징

### JavaScript 구조
```javascript
// 안정적인 DOM 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 모든 초기화 코드
});

// 전역 에러 핸들러
window.addEventListener('error', function(e) {
    if (e.filename && !e.filename.includes('aisaju1000.com')) {
        e.preventDefault();
    }
});

// 부드러운 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
```

### CSS 디자인 시스템
- **Color Palette**: 
  - Primary: `#8B4513` (갈색)
  - Secondary: `#FFD700` (금색)
  - Background: `#1a1a1a` (다크)
  - Text: `#ffffff` (흰색)
- **Typography**: Noto Sans KR, Noto Serif KR
- **Layout**: Flexbox + Grid
- **Responsive**: Mobile-first approach

### 반응형 디자인
```css
/* Mobile */
@media (max-width: 768px) {
    .container { padding: 10px; }
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
    .container { padding: 20px; }
}

/* Desktop */
@media (min-width: 1025px) {
    .container { padding: 40px; }
}
```

## 🚀 배포 방법

### GitHub에 커밋하기
```bash
# 변경사항 추가
git add .

# 커밋 메시지 작성
git commit -m "Update: [변경 내용]"

# GitHub에 푸시
git push origin main
```

### Vercel 자동 배포
- GitHub에 푸시하면 Vercel이 자동으로 재배포
- 배포 시간: 약 5~10분
- 배포 완료 후 https://aisaju1000.com 에서 확인

### 로컬 테스트
```bash
# Python 3 사용
python -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

## 🐛 문제 해결 가이드

### HTML 소스가 보이는 경우
1. **vercel.json 확인**:
   ```json
   {
     "cleanUrls": true,
     "trailingSlash": false,
     "headers": [
       {
         "source": "/**/*.html",
         "headers": [
           { "key": "Content-Type", "value": "text/html; charset=utf-8" }
         ]
       }
     ]
   }
   ```

2. **브라우저 캐시 삭제**:
   - Chrome: `Ctrl + Shift + Delete`
   - 또는 시크릿 모드 사용

3. **Vercel 재배포**:
   - Vercel 대시보드 → Deployments → Redeploy

### JavaScript 오류가 발생하는 경우
1. **DOMContentLoaded 이벤트 확인**
2. **전역 에러 핸들러 추가**
3. **try-catch 블록 사용**

### 목차 링크가 작동하지 않는 경우
1. **href 속성 확인**: `href="#section1"`
2. **target 요소 확인**: `id="section1"`
3. **부드러운 스크롤 스크립트 확인**

## 📈 향후 개선 계획

### 단기 계획 (1개월)
- [ ] 블로그 콘텐츠 추가 (20개 이상)
- [ ] SEO 최적화 (Open Graph, Twitter Card)
- [ ] 성능 최적화 (이미지 압축, CSS/JS 압축)
- [ ] 모바일 UX 개선

### 중기 계획 (3개월)
- [ ] 사용자 회원가입/로그인 기능
- [ ] 사주 결과 저장 기능
- [ ] 결제 시스템 연동
- [ ] 푸시 알림 기능

### 장기 계획 (6개월)
- [ ] AI 사주 분석 정확도 개선
- [ ] 다국어 지원 확대 (베트남어, 태국어 등)
- [ ] 모바일 앱 출시 (iOS, Android)
- [ ] API 서비스 제공

## 🤝 기여 가이드

### 코드 스타일
- **HTML**: 2칸 들여쓰기, 시맨틱 태그 사용
- **CSS**: BEM 네이밍 컨벤션
- **JavaScript**: ES6+ 문법, 함수형 프로그래밍

### 커밋 메시지 규칙
```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 추가
chore: 빌드 업무 수정
```

## 📞 문의 및 지원

- **이메일**: support@aisaju1000.com
- **GitHub Issues**: https://github.com/ubin72-beep/saju-gpt-service/issues
- **웹사이트**: https://aisaju1000.com

## 📝 라이선스

MIT License

Copyright (c) 2025 AI 사주 천년지기

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

© 2025 AI 사주 천년지기. All rights reserved.
