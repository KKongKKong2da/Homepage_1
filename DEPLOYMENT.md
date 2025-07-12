# 🚀 홈페이지 배포 가이드

Princess Dev Diary를 다양한 플랫폼에 배포하는 방법을 안내합니다.

## 📱 지원 환경

- ✅ **모바일**: iOS Safari, Android Chrome, Samsung Internet
- ✅ **태블릿**: iPad, Android 태블릿
- ✅ **데스크톱**: Chrome, Firefox, Safari, Edge
- ✅ **반응형**: 모든 화면 크기에서 최적화된 보기

## 🔥 1. Firebase Hosting (추천)

### 1.1 Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 1.2 Firebase 로그인
```bash
firebase login
```

### 1.3 프로젝트 초기화
```bash
firebase init hosting
```
- 프로젝트 선택: 기존 Firebase 프로젝트 선택
- Public directory: `.` (현재 폴더)
- Single-page app: `Yes`
- GitHub Actions: `No` (선택사항)

### 1.4 배포
```bash
firebase deploy
```

### 1.5 결과
- URL: `https://your-project-id.web.app`
- 자동 HTTPS 지원
- 글로벌 CDN
- 무료 호스팅

## 🌐 2. GitHub Pages

### 2.1 GitHub 저장소 생성
1. GitHub에서 새 저장소 생성
2. 프로젝트 파일들을 업로드

### 2.2 GitHub Pages 활성화
1. 저장소 Settings → Pages
2. Source: `Deploy from a branch`
3. Branch: `main` 또는 `master`
4. Folder: `/ (root)`

### 2.3 결과
- URL: `https://username.github.io/repository-name`
- 무료 호스팅
- 자동 HTTPS

## ☁️ 3. Netlify

### 3.1 Netlify 계정 생성
1. [Netlify](https://netlify.com) 가입
2. GitHub 계정 연동

### 3.2 배포
1. "New site from Git" 클릭
2. GitHub 저장소 선택
3. Build settings:
   - Build command: (비워두기)
   - Publish directory: `.`

### 3.3 결과
- URL: `https://random-name.netlify.app`
- 커스텀 도메인 지원
- 자동 HTTPS
- 폼 처리 기능

## ⚡ 4. Vercel

### 4.1 Vercel 계정 생성
1. [Vercel](https://vercel.com) 가입
2. GitHub 계정 연동

### 4.2 배포
1. "New Project" 클릭
2. GitHub 저장소 선택
3. Framework Preset: `Other`
4. Deploy

### 4.3 결과
- URL: `https://project-name.vercel.app`
- 자동 HTTPS
- 글로벌 CDN
- 실시간 미리보기

## 📦 5. 정적 파일 서버

### 5.1 Python 서버
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### 5.2 Node.js 서버
```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000
```

### 5.3 PHP 서버
```bash
php -S localhost:8000
```

## 🔧 6. 고급 설정

### 6.1 커스텀 도메인 설정
1. 도메인 구매 (예: GoDaddy, Namecheap)
2. DNS 설정에서 CNAME 레코드 추가
3. 호스팅 서비스에서 도메인 연결

### 6.2 SSL 인증서
- Firebase Hosting: 자동
- GitHub Pages: 자동
- Netlify: 자동
- Vercel: 자동

### 6.3 성능 최적화
- 이미지 압축
- CSS/JS 압축
- 브라우저 캐싱
- CDN 사용



## 🔍 8. 테스트 방법

### 8.1 반응형 테스트
```bash
# Chrome DevTools 사용
1. F12 키
2. Toggle device toolbar (Ctrl+Shift+M)
3. 다양한 기기 크기 선택
```

### 8.2 반응형 테스트
```bash
# Chrome DevTools
1. Application 탭
2. 반응형 디자인 확인
3. 다양한 기기 시뮬레이션
```

### 8.3 성능 테스트
```bash
# Lighthouse 사용
1. Chrome DevTools → Lighthouse
2. Generate report
3. PWA, Performance, Accessibility 점수 확인
```

## 🚨 9. 문제 해결

### 9.1 CORS 오류
- HTTPS 환경에서만 Firebase 사용 가능
- 로컬 개발 시 `localhost` 사용

### 9.2 캐싱 문제
- Service Worker 캐시 삭제
- 브라우저 캐시 삭제
- 하드 리프레시 (Ctrl+Shift+R)



## 📊 10. 모니터링

### 10.1 Google Analytics
```html
<!-- index.html에 추가 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 10.2 Firebase Analytics
- Firebase 콘솔에서 자동 수집
- 사용자 행동 분석
- 실시간 데이터 확인

## 🎯 추천 배포 순서

1. **개발/테스트**: Firebase Hosting
2. **프로덕션**: Firebase Hosting + 커스텀 도메인
3. **백업**: GitHub Pages
4. **고급 기능**: Netlify 또는 Vercel

## 📞 지원

문제가 발생하면:
1. 브라우저 개발자 도구 확인
2. Firebase 콘솔 로그 확인
3. GitHub Issues 생성

---

**Happy Deploying! 🚀✨** 

---

## 🛠️ **해결 방법**

### 1. **터미널을 완전히 껐다가 다시 켜세요**
- Node.js를 설치한 뒤에는 새로 연 터미널(명령 프롬프트/cmd, PowerShell)에서만 `npm`이 인식돼요.
- **기존에 열려 있던 터미널은 닫고, 새로 열어주세요!**

### 2. **명령 프롬프트(cmd)로 실행해보세요**
- Windows 검색창에 `cmd` 입력 → 엔터
- 아래 명령어를 입력:
  ```
  npm --version
  ```
- 버전이 나오면 정상!
- 그 다음
  ```
  npm install -g firebase-tools
  ```

### 3. **그래도 안 되면…**
- Node.js 설치 경로가 환경 변수에 등록되지 않았을 수 있어요.
- 이럴 땐 컴퓨터를 재부팅하면 대부분 해결됩니다.

---

## 🧸 비유로 설명

- **Node.js 설치 후**: 새 연필을 샀는데, 연필꽂이에 꽂으려면 책상을 한번 정리(=터미널 재시작)해야 해요!
- **터미널 재시작**: 새로고침 버튼을 누르는 것과 같아요.

---

### **정리**
1. 터미널(명령 프롬프트/cmd, PowerShell) 완전히 닫기
2. 새로 열기
3. `npm --version` 입력해서 버전 확인
4. `npm install -g firebase-tools` 실행

---

**이렇게 해도 안 되면,  
화면 캡처나 에러 메시지를 보여주시면 추가로 도와드릴게요!** 😊 

---

## 1️⃣ **명령 프롬프트(cmd) 열기**
- Windows 검색창에 `cmd` 입력 → 엔터

---

## 2️⃣ **Node.js와 npm 설치 확인**
아래 명령어를 차례로 입력해보세요:
```
node --version
npm --version
```
- 두 명령 모두 버전 번호(예: v22.17.0, 10.8.0 등)가 나오면 정상입니다!

---

## 3️⃣ **Firebase CLI 설치**
정상적으로 버전이 나오면, 아래 명령어를 입력하세요:
```
npm install -g firebase-tools
```
- 설치가 완료되면  
  ```
  firebase --version
  ```
  도 입력해보세요! (버전이 나오면 성공!)

---

### ⚠️ 만약 또 에러가 나오면
- 에러 메시지 전체를 복사해서 알려주세요!
- 또는 캡처해서 보여주시면 원인을 바로 찾아드릴 수 있어요.

---

**차근차근 진행해보시고, 궁금한 점이 있으면 언제든 질문해 주세요! 😊** 

---

## 중요한 점

- **정확한 storageBucket 값은**  
  ```
  homepage-1-3fff8.appspot.com
  ```
  입니다.

- 그런데 현재 index.html에는  
  ```
  homepage-1-3fff8.firebasestorage.app
  ```
  으로 잘못 입력되어 있습니다.

---

## 반드시 이렇게 고쳐주세요!

index.html의 firebaseConfig 부분을  
아래처럼 **수정**해 주세요.

```javascript
<code_block_to_apply_changes_from>
```

---

## 수정 후 해야 할 일

1. **index.html을 저장**하고,
2. **Firebase Hosting에 다시 배포**하거나,  
   로컬에서 새로고침 후
3. **Firebase ON 상태에서 글 저장**을 시도해보세요.

---

이제 Firestore와 Storage가 정상적으로 연결되어  
글이 잘 저장되고, posts 컬렉션에도 문서가 추가될 것입니다!

---

**수정 후에도 문제가 있으면,  
브라우저 콘솔의 에러 메시지를 다시 한 번 올려주세요.  
(이제는 대부분 해결될 가능성이 매우 높아요!)**

궁금한 점이 있으면 언제든 질문해 주세요! 😊 