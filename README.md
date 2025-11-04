# 개발의신 (Dev God) 챗봇

Google Gemini API를 활용한 소프트웨어 개발 전문 AI 챗봇입니다.

## 주요 기능

- 🤖 **Gemini Pro AI**: Google의 최신 생성형 AI 모델 활용
- 💬 **실시간 스트리밍**: 응답을 실시간으로 받아볼 수 있습니다
- 📝 **Markdown 지원**: 코드 하이라이팅, 테이블, 리스트, LaTeX 수식 렌더링
- 💾 **로컬 저장**: 브라우저 localStorage를 통한 대화 히스토리 저장
- 🗂️ **다중 대화**: 여러 대화를 생성하고 관리
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두 지원
- 🎨 **카카오톡 스타일 UI**: 친숙한 메신저 인터페이스

## 기술 스택

- **Frontend/Backend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Markdown**: react-markdown + remark/rehype plugins
- **수식 렌더링**: KaTeX
- **코드 하이라이팅**: highlight.js
- **아이콘**: Lucide React

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 Gemini API 키를 설정합니다:

```env
GEMINI_API_KEY=your_api_key_here
```

> [Google AI Studio](https://makersuite.google.com/app/apikey)에서 무료 API 키를 발급받을 수 있습니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
choisunhwadotcom/
├── app/
│   ├── api/chat/route.ts          # Gemini API 엔드포인트
│   ├── layout.tsx                  # 루트 레이아웃
│   └── page.tsx                    # 메인 페이지
├── components/
│   ├── ChatInterface.tsx           # 메인 채팅 인터페이스
│   ├── ChatMessage.tsx            # 메시지 말풍선 컴포넌트
│   ├── ChatInput.tsx              # 입력 필드
│   ├── ConversationList.tsx       # 대화 목록 사이드바
│   └── MarkdownRenderer.tsx       # Markdown 렌더러
├── lib/
│   ├── gemini.ts                  # Gemini API 클라이언트
│   ├── storage.ts                 # localStorage 관리
│   └── types.ts                   # TypeScript 타입 정의
├── prompts/
│   └── system-prompt.md           # AI 시스템 프롬프트
├── styles/
│   └── globals.css                # 전역 스타일
└── public/                        # 정적 파일
```

## 시스템 프롬프트 커스터마이징

`prompts/system-prompt.md` 파일을 수정하여 AI의 응답 스타일과 전문성을 변경할 수 있습니다.

## 주요 기능 설명

### 실시간 스트리밍

Gemini API의 스트리밍 기능을 활용하여 응답을 실시간으로 표시합니다.

### Markdown 렌더링

- **코드 블록**: 문법 강조 지원
- **수식**: LaTeX 문법으로 수학 공식 표시
- **테이블**: GitHub Flavored Markdown 테이블 지원
- **링크 & 이미지**: 자동 렌더링

### 대화 관리

- 여러 대화 스레드 생성 및 전환
- 자동 제목 생성 (첫 메시지 기반)
- 로컬 저장으로 새로고침 시에도 대화 유지

## 라이선스

MIT License

## 개발자

최선화 (Choi Sun-hwa)
