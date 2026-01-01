# 🚀 AI 사주 천년지기 - 배포 가이드

완성된 프로젝트를 실제 서버에 배포하는 방법을 안내합니다.

---

## 📋 목차

1. [프론트엔드 배포 (GitHub Pages)](#프론트엔드-배포)
2. [백엔드 배포 (Vercel)](#백엔드-배포-vercel)
3. [백엔드 배포 (Railway)](#백엔드-배포-railway)
4. [MongoDB Atlas 설정](#mongodb-atlas-설정)
5. [도메인 연결](#도메인-연결)
6. [환경 변수 설정](#환경-변수-설정)
7. [배포 후 체크리스트](#배포-후-체크리스트)

---

## 프론트엔드 배포 (GitHub Pages)

### ✅ 현재 상태
- 이미 GitHub Pages로 배포 완료
- URL: https://ubin72-beep.github.io/saju-gpt-service/

### 📝 배포 과정 (참고용)

1. **GitHub 저장소 생성**
   - 저장소 이름: `saju-gpt-service`
   - Public 설정

2. **코드 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **GitHub Pages 활성화**
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, / (root)
   - Save

4. **배포 확인**
   - 약 1-2분 후 배포 완료
   - URL: https://[username].github.io/[repository]/

---

## 백엔드 배포 (Vercel)

### 🎯 권장 방법 (가장 쉬움!)

### 1. Vercel 계정 생성
- https://vercel.com
- GitHub 계정으로 로그인

### 2. 프로젝트 설정 파일 생성

**`vercel.json` 파일을 backend 폴더에 생성:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### 3. Vercel CLI 설치 및 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# backend 폴더로 이동
cd backend

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 4. 환경 변수 설정

**Vercel 대시보드에서:**
- Project Settings → Environment Variables
- 아래 변수들 추가:

```
MONGODB_URI=mongodb+srv://sajuadmin:password@cluster0.xxxxx.mongodb.net/saju
JWT_SECRET=your-super-secret-key
NODE_ENV=production
CORS_ORIGIN=https://ubin72-beep.github.io
```

### 5. 배포 완료!

- 배포 URL 예시: `https://saju-gpt-backend.vercel.app`
- 이 URL을 프론트엔드 `js/api.js`의 `API_BASE_URL`에 설정

---

## 백엔드 배포 (Railway)

### 대안 배포 방법

### 1. Railway 계정 생성
- https://railway.app
- GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
- New Project → Deploy from GitHub repo
- `saju-gpt-service` 저장소 선택
- `backend` 폴더 지정

### 3. 환경 변수 설정

**Railway 대시보드에서:**
- Variables 탭
- 아래 변수들 추가:

```
MONGODB_URI=mongodb+srv://sajuadmin:password@cluster0.xxxxx.mongodb.net/saju
JWT_SECRET=your-super-secret-key
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://ubin72-beep.github.io
```

### 4. 빌드 설정

**`railway.json` 파일 생성 (선택사항):**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 5. 배포 완료!

- 배포 URL 예시: `https://saju-gpt-backend.up.railway.app`

---

## MongoDB Atlas 설정

### 1. 프로덕션용 클러스터 생성 (선택사항)

- 개발용 클러스터를 그대로 사용 가능
- 또는 새 클러스터 생성

### 2. 네트워크 접근 설정

**IP Access List:**
- `0.0.0.0/0` 추가 (모든 IP 허용)
- 또는 Vercel/Railway IP 추가

### 3. 데이터베이스 사용자

- Username: `sajuadmin`
- Password: 강력한 비밀번호 설정
- Role: Atlas admin

### 4. 연결 문자열 복사

```
mongodb+srv://sajuadmin:<password>@cluster0.xxxxx.mongodb.net/saju?retryWrites=true&w=majority
```

---

## 도메인 연결

### 프론트엔드 (GitHub Pages)

#### 1. 커스텀 도메인 구매
- 예: `saju2026.com`

#### 2. DNS 설정
- A 레코드 추가:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```

#### 3. GitHub Pages 설정
- Settings → Pages → Custom domain
- `saju2026.com` 입력

### 백엔드 (Vercel/Railway)

#### Vercel:
- Project Settings → Domains
- 커스텀 도메인 추가 (예: `api.saju2026.com`)

#### Railway:
- Settings → Domains
- 커스텀 도메인 추가

---

## 환경 변수 설정

### 프로덕션 환경 변수

```env
# 서버
NODE_ENV=production
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://sajuadmin:강력한비밀번호@cluster0.xxxxx.mongodb.net/saju

# JWT
JWT_SECRET=아주-길고-복잡한-비밀-키-생성-필수
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://saju2026.com,https://www.saju2026.com

# 보안
BCRYPT_ROUNDS=12

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 🔒 보안 주의사항

- **절대로** `.env` 파일을 GitHub에 업로드하지 마세요
- JWT_SECRET은 최소 32자 이상의 랜덤 문자열 사용
- 프로덕션과 개발 환경의 비밀번호를 다르게 설정
- MongoDB 비밀번호는 특수문자 포함하여 강력하게

---

## 배포 후 체크리스트

### ✅ 프론트엔드

- [ ] GitHub Pages 배포 확인
- [ ] 모든 페이지 로드 확인
- [ ] 이미지 및 CSS/JS 로드 확인
- [ ] 다국어 전환 작동 확인
- [ ] 모바일 반응형 확인

### ✅ 백엔드

- [ ] 배포 URL 접근 확인
- [ ] `/health` 엔드포인트 응답 확인
- [ ] MongoDB 연결 확인
- [ ] 회원가입 API 테스트
- [ ] 로그인 API 테스트
- [ ] JWT 토큰 발급 확인

### ✅ 통합

- [ ] 프론트엔드 → 백엔드 API 연결 확인
- [ ] 회원가입 흐름 테스트
- [ ] 로그인 흐름 테스트
- [ ] 사주 분석 저장 테스트
- [ ] 마이페이지 데이터 로드 확인

### ✅ 보안

- [ ] HTTPS 적용 확인
- [ ] CORS 설정 확인
- [ ] 비밀번호 암호화 확인
- [ ] JWT 토큰 만료 시간 확인
- [ ] Rate Limiting 작동 확인

### ✅ SEO

- [ ] sitemap.xml 접근 확인
- [ ] robots.txt 확인
- [ ] 메타 태그 확인
- [ ] Open Graph 태그 확인

---

## 배포 후 모니터링

### 로그 확인

**Vercel:**
```bash
vercel logs
```

**Railway:**
- 대시보드 → Deployments → Logs

### 에러 추적

**프론트엔드:**
- 브라우저 Console 확인
- Network 탭에서 API 요청 확인

**백엔드:**
- Vercel/Railway 로그 확인
- MongoDB Atlas Metrics 확인

---

## 트러블슈팅

### 문제: API 요청 실패 (CORS 에러)

**해결:**
```javascript
// backend/server.js
const corsOptions = {
  origin: ['https://ubin72-beep.github.io', 'https://saju2026.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

### 문제: MongoDB 연결 실패

**해결:**
1. MongoDB Atlas Network Access 확인
2. 연결 문자열 확인
3. 비밀번호 특수문자 URL 인코딩 확인

### 문제: 환경 변수 인식 안 됨

**해결:**
1. Vercel/Railway 대시보드에서 환경 변수 재확인
2. 배포 다시 트리거
3. `console.log(process.env.MONGODB_URI)` 로 확인

---

## 성능 최적화

### 프론트엔드

- [ ] 이미지 압축 (TinyPNG)
- [ ] CSS/JS 압축
- [ ] CDN 사용 (Cloudflare)
- [ ] Lazy Loading 적용

### 백엔드

- [ ] MongoDB 인덱스 설정
- [ ] API 응답 캐싱
- [ ] Gzip 압축 활성화
- [ ] 불필요한 로그 제거

---

## 비용 예상

### MongoDB Atlas
- **무료 티어**: 512MB 스토리지
- **M10 (프로덕션)**: 월 $57

### Vercel
- **Hobby (무료)**: 100GB 대역폭
- **Pro**: 월 $20

### Railway
- **무료**: 월 $5 크레딧
- **Developer**: 월 $10

### 총 예상 비용
- **개발 단계**: $0/월 (모두 무료)
- **프로덕션**: $20-$87/월

---

## 다음 단계

1. ✅ 프론트엔드 + 백엔드 배포
2. 🔄 결제 시스템 연동 (Toss Payments)
3. 📧 이메일 알림 (SendGrid)
4. 📊 분석 도구 (Google Analytics)
5. 🔐 추가 보안 강화

---

**배포 성공을 기원합니다! 🎉**

Made with ❤️ by AI 사주 천년지기 Team
