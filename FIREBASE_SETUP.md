# Firebase 설정 가이드 🔥

Princess Dev Diary에 Firebase를 연동하는 방법을 단계별로 설명합니다.

## 1단계: Firebase 프로젝트 생성

### 1.1 Firebase 콘솔 접속
1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 만들기" 클릭
2. 프로젝트 이름 입력: `princess-dev-diary` (또는 원하는 이름)
3. Google Analytics 사용 여부 선택 (선택사항)
4. "프로젝트 만들기" 클릭

## 2단계: 웹 앱 등록

### 2.1 웹 앱 추가
1. 프로젝트 대시보드에서 "웹" 아이콘 클릭
2. 앱 닉네임 입력: `princess-diary-web`
3. "Firebase Hosting 설정" 체크 해제 (선택사항)
4. "앱 등록" 클릭

### 2.2 Firebase 설정 복사
앱 등록 후 다음과 같은 설정이 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

이 설정을 복사해두세요!

## 3단계: Firestore 데이터베이스 설정

### 3.1 Firestore 데이터베이스 생성
1. 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택: "테스트 모드에서 시작" 선택
4. 위치 선택: `asia-northeast3 (서울)` 선택
5. "완료" 클릭

### 3.2 보안 규칙 설정 (선택사항)
테스트 모드에서는 모든 사용자가 읽기/쓰기가 가능합니다. 
프로덕션에서는 보안 규칙을 설정해야 합니다.

## 4단계: Storage 설정

### 4.1 Storage 활성화
1. 왼쪽 메뉴에서 "Storage" 클릭
2. "시작하기" 클릭
3. 보안 규칙 선택: "테스트 모드에서 시작" 선택
4. 위치 선택: `asia-northeast3 (서울)` 선택
5. "완료" 클릭

## 5단계: 코드에 설정 적용

### 5.1 index.html 파일 수정
`index.html` 파일에서 Firebase 설정 부분을 찾아 실제 설정으로 교체:

```javascript
const firebaseConfig = {
  apiKey: "여기에_실제_API_KEY_입력",
  authDomain: "여기에_실제_AUTH_DOMAIN_입력",
  projectId: "여기에_실제_PROJECT_ID_입력",
  storageBucket: "여기에_실제_STORAGE_BUCKET_입력",
  messagingSenderId: "여기에_실제_SENDER_ID_입력",
  appId: "여기에_실제_APP_ID_입력"
};
```

## 6단계: 테스트

### 6.1 로컬 서버 실행
파일을 웹 서버에서 실행해야 합니다. 간단한 방법:

```bash
# Python 3가 설치되어 있다면
python -m http.server 8000

# 또는 Node.js가 설치되어 있다면
npx http-server
```

### 6.2 브라우저에서 테스트
1. `http://localhost:8000` 접속
2. "🔥 Firebase" 버튼 클릭하여 Firebase 모드 활성화
3. 새 글 작성하여 Firebase에 저장되는지 확인

## 7단계: 문제 해결

### 7.1 CORS 오류
Firebase는 HTTPS 또는 localhost에서만 작동합니다. 
파일을 직접 열면 CORS 오류가 발생할 수 있습니다.

### 7.2 설정 오류
- API 키가 올바른지 확인
- 프로젝트 ID가 정확한지 확인
- Firestore와 Storage가 활성화되었는지 확인

### 7.3 권한 오류
Firestore 보안 규칙이 너무 제한적일 수 있습니다. 
테스트 모드에서 시작하는 것을 권장합니다.

## 8단계: 고급 설정 (선택사항)

### 8.1 인증 추가
사용자 로그인 기능을 추가하려면:
1. Firebase 콘솔에서 "Authentication" 활성화
2. 원하는 로그인 방법 선택 (이메일/비밀번호, Google 등)

### 8.2 보안 규칙 설정
프로덕션 환경에서는 적절한 보안 규칙을 설정해야 합니다:

```javascript
// Firestore 보안 규칙 예시
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read, write: if true; // 테스트용 (모든 사용자 허용)
    }
  }
}
```

## 9단계: 배포 (선택사항)

### 9.1 Firebase Hosting 사용
1. Firebase CLI 설치: `npm install -g firebase-tools`
2. 로그인: `firebase login`
3. 프로젝트 초기화: `firebase init hosting`
4. 배포: `firebase deploy`

### 9.2 다른 호스팅 서비스 사용
GitHub Pages, Netlify, Vercel 등 다른 호스팅 서비스도 사용 가능합니다.

## 주의사항 ⚠️

1. **API 키 보안**: API 키는 클라이언트 사이드에 노출되지만, Firebase 보안 규칙으로 보호됩니다.
2. **사용량 제한**: Firebase 무료 플랜에는 사용량 제한이 있습니다.
3. **데이터 백업**: 정기적으로 데이터를 백업하는 것을 권장합니다.
4. **비용 관리**: 사용량이 많아지면 비용이 발생할 수 있습니다.

## 도움말

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 가이드](https://firebase.google.com/docs/firestore)
- [Firebase Storage 가이드](https://firebase.google.com/docs/storage)

문제가 발생하면 Firebase 콘솔의 로그를 확인하거나 브라우저 개발자 도구의 콘솔을 확인해보세요! 