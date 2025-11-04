# 개발의신 챗봇 - 프로젝트 요약

## 프로젝트 개요

Google Gemini API를 활용한 소프트웨어 개발 전문 AI 챗봇 웹 애플리케이션입니다.
카카오톡 스타일의 친숙한 UI로 개발자들이 편리하게 기술 질문을 하고 답변을 받을 수 있습니다.

## 핵심 기술 스택

### Frontend
- **Next.js 15** (App Router) - 최신 React 프레임워크
- **TypeScript** - 타입 안정성 보장
- **Tailwind CSS** - 유틸리티 퍼스트 CSS 프레임워크

### AI & API
- **Google Gemini Pro** - 최신 생성형 AI 모델
- **Server-Sent Events (SSE)** - 실시간 스트리밍 응답

### Markdown & Rendering
- **react-markdown** - Markdown 렌더링
- **remark-gfm** - GitHub Flavored Markdown
- **remark-math** - 수학 공식 지원
- **rehype-katex** - LaTeX 렌더링
- **rehype-highlight** - 코드 문법 강조

### UI Components & Icons
- **Lucide React** - 아이콘 라이브러리
- **date-fns** - 날짜/시간 포맷팅

## 주요 기능

### 1. AI 대화 기능
- ✅ Gemini Pro API를 통한 고품질 응답
- ✅ 실시간 스트리밍으로 즉각적인 피드백
- ✅ 시스템 프롬프트를 통한 전문성 있는 답변
- ✅ 대화 컨텍스트 유지

### 2. Markdown 지원
- ✅ 코드 블록 with 문법 강조
- ✅ 표(table) 렌더링
- ✅ 순서/비순서 리스트
- ✅ LaTeX 수식 렌더링
- ✅ 링크 및 이미지 표시

### 3. 대화 관리
- ✅ 여러 대화 스레드 생성
- ✅ 대화 간 전환
- ✅ 대화 삭제
- ✅ 자동 제목 생성 (첫 메시지 기반)
- ✅ localStorage를 통한 영구 저장

### 4. UI/UX
- ✅ 카카오톡 스타일 인터페이스
- ✅ 반응형 디자인 (모바일/데스크톱)
- ✅ 프로필 아이콘 및 타임스탬프
- ✅ 스크롤 자동 이동
- ✅ 입력 필드 자동 크기 조절

## 프로젝트 구조

```
choisunhwadotcom/
├── app/                        # Next.js App Router
│   ├── api/chat/route.ts       # Gemini API 엔드포인트
│   ├── layout.tsx              # 루트 레이아웃
│   └── page.tsx                # 메인 페이지
│
├── components/                 # React 컴포넌트
│   ├── ChatInterface.tsx       # 메인 채팅 인터페이스
│   ├── ChatMessage.tsx         # 메시지 말풍선
│   ├── ChatInput.tsx           # 입력 필드
│   ├── ConversationList.tsx    # 대화 목록 사이드바
│   └── MarkdownRenderer.tsx    # Markdown 렌더러
│
├── lib/                        # 유틸리티 & 로직
│   ├── gemini.ts               # Gemini API 클라이언트
│   ├── storage.ts              # localStorage 관리
│   └── types.ts                # TypeScript 타입
│
├── prompts/                    # AI 설정
│   └── system-prompt.md        # 시스템 프롬프트
│
├── styles/                     # 스타일
│   └── globals.css             # 전역 CSS
│
├── docs/                       # 문서
│   ├── USAGE.md                # 사용 가이드
│   └── PROJECT_SUMMARY.md      # 프로젝트 요약
│
└── public/                     # 정적 파일
```

## 데이터 흐름

### 1. 사용자 메시지 전송
```
사용자 입력 → ChatInput
  → ChatInterface (상태 업데이트)
  → localStorage 저장
  → API 호출 (/api/chat)
```

### 2. AI 응답 수신
```
API Route (/api/chat)
  → Gemini API 스트리밍 호출
  → Server-Sent Events로 청크 전송
  → ChatInterface에서 실시간 업데이트
  → 완료 후 localStorage 저장
```

### 3. 대화 관리
```
ConversationList
  ↕ (양방향 데이터 바인딩)
ChatInterface
  ↕
localStorage (자동 저장/로드)
```

## 스타일링 시스템

### 카카오톡 테마 색상
```typescript
colors: {
  kakao: {
    bg: "#b2c7d9",           // 배경색 (파란-회색)
    yellow: "#ffe500",       // 사용자 말풍선 (노란색)
    yellowDark: "#f7d600",   // 호버 상태
    white: "#ffffff",        // 봇 말풍선 (흰색)
    gray: "#f5f5f5",         // 회색 배경
    darkGray: "#8e8e93",     // 타임스탬프 색상
    text: "#191919",         // 텍스트 색상
  }
}
```

### 폰트
- **Pretendard** - 주요 한글 폰트
- 시스템 폰트 폴백 체인

### 레이아웃
- **Flexbox** - 레이아웃 구성
- **Tailwind 유틸리티** - 빠른 스타일링
- **반응형 브레이크포인트** - lg (1024px)

## API 엔드포인트

### POST /api/chat
**Request:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user" | "assistant",
      "content": "메시지 내용",
      "timestamp": "ISO 날짜 문자열"
    }
  ]
}
```

**Response (SSE):**
```
data: {"content": "응답 청크"}
data: {"content": "다음 청크"}
...
data: [DONE]
```

## 환경 변수

```env
GEMINI_API_KEY=your_gemini_api_key
```

## 빌드 & 배포

### 개발 모드
```bash
npm run dev
# http://localhost:3000
```

### 프로덕션 빌드
```bash
npm run build
npm start
```

### 배포 옵션
- **Vercel** - Next.js 최적화 (권장)
- **Netlify** - JAMstack 배포
- **Docker** - 컨테이너 배포

## 성능 최적화

### 구현된 최적화
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG) for static pages
- ✅ Code splitting (Next.js 자동)
- ✅ 이미지 최적화 준비 (Next.js Image)
- ✅ Tree shaking (Webpack)

### 추가 최적화 가능
- [ ] React.memo로 컴포넌트 메모이제이션
- [ ] useMemo/useCallback 훅 활용
- [ ] Virtual scrolling (긴 대화 목록)
- [ ] Service Worker (PWA)
- [ ] IndexedDB (대용량 저장)

## 보안 고려사항

### 구현된 보안 기능
- ✅ API 키 환경 변수 관리
- ✅ .gitignore로 민감 정보 제외
- ✅ 클라이언트 사이드 데이터만 localStorage 저장
- ✅ TypeScript로 타입 안정성

### 추가 고려사항
- 사용자 인증 (필요시)
- Rate limiting
- CORS 설정
- Content Security Policy

## 확장 가능성

### 쉽게 추가 가능한 기능
1. **사용자 인증** - NextAuth.js
2. **데이터베이스 연동** - Prisma + PostgreSQL
3. **파일 업로드** - 이미지/문서 분석
4. **음성 입력** - Web Speech API
5. **다국어 지원** - i18n
6. **테마 전환** - 다크 모드
7. **대화 공유** - 링크 생성
8. **내보내기** - PDF/Markdown

## 라이선스

MIT License

## 개발자

최선화 (Choi Sun-hwa)

## 버전 히스토리

### v1.0.0 (2025-11-04)
- 초기 릴리스
- Gemini Pro API 통합
- 카카오톡 스타일 UI
- 다중 대화 관리
- Markdown 렌더링 (코드, 수식, 표)
- localStorage 저장
- 반응형 디자인
