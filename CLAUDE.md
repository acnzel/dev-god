# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dev God (개발의신)** is a software development expert chatbot built with Next.js 15 and Google Gemini API. The application provides a KakaoTalk-style messaging interface for real-time AI conversations with markdown rendering, LaTeX math support, and syntax highlighting.

## Development Commands

### Essential Commands
```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Setup
- Create `.env.local` with `GEMINI_API_KEY=your_api_key_here`
- API keys available from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router + TypeScript
- **AI**: Google Gemini API (`gemini-2.0-flash` model)
- **Styling**: Tailwind CSS with custom KakaoTalk theme
- **Markdown**: react-markdown with remark-gfm, remark-math, rehype-katex, rehype-highlight
- **State**: React hooks + localStorage for persistence

### Core Architecture Pattern

**Client-Server Streaming Flow**:
1. `ChatInterface.tsx` manages client state (conversations, messages, streaming status)
2. User messages → POST `/api/chat/route.ts` with conversation history
3. Server streams response from Gemini API using Server-Sent Events (SSE)
4. Client accumulates chunks and updates UI in real-time

**Data Flow**:
```
User Input → ChatInterface → /api/chat → Gemini API (streaming)
                ↓                              ↓
         localStorage ← storage.ts ← Accumulated chunks
```

### Key Files & Responsibilities

**API Layer** (`app/api/chat/route.ts`):
- POST endpoint for chat requests
- Streams Gemini responses using ReadableStream
- SSE format: `data: {"content": "..."}\n\n` and `data: [DONE]\n\n`

**Gemini Integration** (`lib/gemini.ts`):
- `streamGeminiResponse()`: Main streaming function
- Loads system prompt from `prompts/system-prompt.md` with caching
- Converts message history to Gemini format (role mapping: assistant → model)
- Generation config: temperature 0.7, maxOutputTokens 8192

**State Management** (`lib/storage.ts`):
- Centralized localStorage operations with STORAGE_KEY `"dev-god-chatbot-state"`
- `loadState()/saveState()`: Serialization with Date object handling
- Helper functions: `createConversation()`, `addMessage()`, `updateLastMessage()`
- Auto-generates conversation titles from first user message (30 char limit)

**UI Components**:
- `ChatInterface.tsx`: Main orchestrator - conversation list, message display, input handling
- `ChatMessage.tsx`: Message bubble rendering (user vs assistant styles)
- `MarkdownRenderer.tsx`: Markdown with code highlighting, LaTeX math, tables
- `ChatInput.tsx`: Message input with send button and disabled state
- `ConversationList.tsx`: Sidebar with conversation management (new, select, delete)

**Types** (`lib/types.ts`):
- `Message`: id, role, content, timestamp
- `Conversation`: id, title, messages[], createdAt, updatedAt
- `ChatState`: conversations[], currentConversationId

### Streaming Implementation Details

The streaming uses SSE with manual chunk accumulation:
- Server encodes chunks as `data: {JSON}\n\n`
- Client reads stream via `response.body.getReader()`
- Accumulates content and calls `storage.updateLastMessage()` per chunk
- Updates React state to trigger re-renders during streaming

### System Prompt

Located in `prompts/system-prompt.md`. Defines AI personality:
- Role: Software development expert AI assistant
- Expertise: All major languages, frameworks, cloud, algorithms, architecture
- Style: Friendly, professional Korean (존댓말), structured explanations
- Response format: Code blocks with language tags, comments, pros/cons

Customizing this file changes the AI's behavior globally.

### Styling Approach

Tailwind with custom theme colors (see `tailwind.config.ts`):
- `kakao-yellow`: Primary brand color (#FEE500)
- `kakao-bg`, `kakao-text`, `kakao-lightGray`, etc.
- Message bubbles styled similar to KakaoTalk (user: yellow, assistant: white)

### State Persistence

All conversations persist in browser `localStorage`:
- Auto-saves on every state change (conversations, currentConversationId)
- Auto-loads on mount
- Date fields serialized/deserialized correctly
- Survives page refreshes

## Common Development Patterns

### Adding New Conversation Features
1. Update `lib/types.ts` for new fields
2. Modify `lib/storage.ts` helper functions
3. Update `ChatInterface.tsx` state management
4. Adjust `ConversationList.tsx` UI if needed

### Modifying AI Behavior
- Edit `prompts/system-prompt.md` (cached, restart dev server)
- Adjust `generationConfig` in `lib/gemini.ts` (temperature, maxOutputTokens)
- Change model: update `model: "gemini-2.0-flash"` to other Gemini models

### Extending Markdown Rendering
- Add remark/rehype plugins to `MarkdownRenderer.tsx`
- Install plugin via npm
- Import and add to `remarkPlugins` or `rehypePlugins` arrays

## Important Notes

- **No Git Repository**: This directory is not a git repository
- **Korean UI**: Most UI text and system prompts are in Korean
- **Client-Side State**: All data stored in browser localStorage (no backend DB)
- **API Key Security**: Never commit `.env.local` (already in `.gitignore`)
- **Streaming State**: Track `isStreaming` to prevent concurrent requests
- **Path Aliases**: Uses `@/*` for root-level imports (configured in `tsconfig.json`)
