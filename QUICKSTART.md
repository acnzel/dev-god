# 🚀 빠른 시작 가이드

## 1분 안에 시작하기

### 1️⃣ 의존성 설치
```bash
npm install
```

### 2️⃣ 환경 변수 설정
`.env.local` 파일이 이미 생성되어 있습니다:
```env
GEMINI_API_KEY=AIzaSyDGg8pUVESVYRHfIJkmpIRXpZAvnW1U26k
```

### 3️⃣ 개발 서버 실행
```bash
npm run dev
```

### 4️⃣ 브라우저에서 확인
```
http://localhost:3000
```

## ✨ 첫 대화 시작하기

1. 하단 입력 필드에 질문 입력
2. 전송 버튼 클릭 또는 Enter 키
3. AI의 실시간 응답 확인!

## 📝 예시 질문

```
"React Hooks의 useState와 useEffect 차이점을 알려줘"
```

```
"TypeScript 제네릭 사용 예시를 보여줘"
```

```
"REST API와 GraphQL의 장단점을 표로 비교해줘"
```

## 🎯 주요 기능

- **💬 실시간 스트리밍**: 응답이 타이핑되는 것처럼 표시됩니다
- **📝 Markdown 지원**: 코드 블록, 표, 수식 등을 예쁘게 렌더링
- **💾 자동 저장**: 대화가 자동으로 저장되어 새로고침 해도 유지
- **📱 반응형**: 모바일, 태블릿, 데스크톱 모두 지원
- **🗂️ 다중 대화**: 여러 주제로 대화를 분리해서 관리

## 🔧 문제 해결

### 서버가 시작되지 않을 때
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 포트가 이미 사용 중일 때
```bash
# 다른 포트 사용
PORT=3001 npm run dev
```

### API 오류가 발생할 때
- `.env.local` 파일이 존재하는지 확인
- API 키가 올바른지 확인
- 서버 재시작

## 📚 추가 문서

- [README.md](./README.md) - 전체 프로젝트 개요
- [docs/USAGE.md](./docs/USAGE.md) - 상세 사용 가이드
- [docs/PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md) - 기술 문서

## 🎨 커스터마이징

### 색상 변경
`tailwind.config.ts`에서 카카오톡 테마 색상을 수정할 수 있습니다.

### AI 성격 변경
`prompts/system-prompt.md`에서 AI의 응답 스타일을 조정할 수 있습니다.

## 🤝 도움이 필요하신가요?

문제가 발생하면 GitHub Issues에 등록해주세요!

---

**즐거운 코딩 되세요! 🎉**
