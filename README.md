# 👑 Princess Dev Diary

공주님의 개발 일기장 - 반응형 웹 애플리케이션

## ✨ 주요 기능

- 📝 **일기 작성**: 제목, 날짜, 내용, 이미지 첨부
- 🎨 **리치 텍스트 에디터**: 굵게, 밑줄, 취소선, 링크, 목록 지원
- 🔥 **Firebase 연동**: 클라우드 저장소 지원
- 💾 **로컬 백업**: 브라우저 로컬 스토리지 지원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 최적화
- 🎯 **접근성**: 키보드 네비게이션, 포커스 표시 지원

## 🚀 기술 스택

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Firebase Firestore, Firebase Storage
- **스타일링**: CSS Custom Properties, Flexbox, Grid
- **반응형**: Mobile-First 접근법

## 📱 지원 환경

- ✅ **모바일**: iOS Safari, Android Chrome, Samsung Internet
- ✅ **태블릿**: iPad, Android 태블릿
- ✅ **데스크톱**: Chrome, Firefox, Safari, Edge
- ✅ **반응형**: 모든 화면 크기에서 최적화된 보기

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: `#ff69b4` (핑크)
- **Secondary**: `#ff6b35` (오렌지)
- **Background**: 그라데이션 (연한 핑크)
- **Text**: `#444` (진한 회색)

### 타이포그래피
- **Font Family**: Noto Sans KR
- **Font Sizes**: 0.8rem ~ 2.2rem (반응형)
- **Line Height**: 1.6 ~ 1.7

### 간격 시스템
- **Spacing**: 0.3rem ~ 2.5rem (8단계)
- **Border Radius**: 0.5rem ~ 2rem (4단계)

## 🏗️ 프로젝트 구조

```
Princess Dev Diary/
├── index.html          # 메인 HTML 파일
├── style.css           # 스타일시트 (CSS 변수 기반)
├── script.js           # JavaScript 로직
├── firebase.json       # Firebase 설정
├── FIREBASE_SETUP.md   # Firebase 설정 가이드
├── DEPLOYMENT.md       # 배포 가이드
└── README.md           # 프로젝트 문서
```

## 🔧 설치 및 실행

### 1. 로컬 개발
```bash
# Python 서버 (권장)
python -m http.server 8000

# 또는 Node.js 서버
npx http-server
```

### 2. Firebase 설정
1. `FIREBASE_SETUP.md` 파일 참조
2. Firebase 프로젝트 생성
3. `index.html`의 Firebase 설정 업데이트

### 3. 배포
- **Firebase Hosting**: `firebase deploy`
- **GitHub Pages**: 저장소 Settings → Pages
- **Netlify**: 드래그 앤 드롭 배포

## 🎯 주요 컴포넌트

### 1. 헤더 (Header)
- 제목 및 네비게이션 버튼
- 반응형 버튼 레이아웃

### 2. 포스트 카드 (Post Card)
- 호버 효과 및 그림자
- 액션 버튼 (수정/삭제)

### 3. 모달 (Modal)
- 백드롭 블러 효과
- 스크롤 가능한 콘텐츠

### 4. 리치 텍스트 에디터
- 툴바 기반 편집
- 실시간 미리보기

## 🔄 데이터 플로우

```
사용자 입력 → 폼 검증 → Firebase/로컬 저장 → UI 업데이트
```

## 🎨 CSS 아키텍처

### CSS 변수 시스템
```css
:root {
  /* 색상 */
  --primary-color: #ff69b4;
  
  /* 타이포그래피 */
  --font-size-base: 1rem;
  
  /* 간격 */
  --spacing-md: 1rem;
  
  /* 전환 */
  --transition-fast: 0.2s ease;
}
```

### 반응형 브레이크포인트
- **Mobile**: `max-width: 768px`
- **Tablet**: `769px - 1024px`
- **Desktop**: `min-width: 1025px`

## 🚀 성능 최적화

- **CSS 변수**: 일관된 디자인 시스템
- **반응형 이미지**: `object-fit: cover`
- **지연 로딩**: Firebase 데이터
- **캐싱**: 브라우저 캐시 활용

## 🔒 보안 고려사항

- **Firebase 보안 규칙**: Firestore 및 Storage
- **입력 검증**: 클라이언트 사이드
- **XSS 방지**: 콘텐츠 정제

## 🧪 테스트

### 브라우저 테스트
- Chrome DevTools Device Toolbar
- 다양한 화면 크기 시뮬레이션
- 네트워크 속도 테스트

### 기능 테스트
- 일기 작성/수정/삭제
- 이미지 업로드
- Firebase 동기화
- 반응형 레이아웃

## 📈 향후 계획

- [ ] 다크 모드 지원
- [ ] 오프라인 모드
- [ ] 검색 기능
- [ ] 카테고리 분류
- [ ] 댓글 시스템

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 👑 제작자

**Princess Dev** - 개발을 사랑하는 공주님

---

**Happy Coding! 👑✨**
