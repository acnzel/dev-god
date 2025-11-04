import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "./types";
import { readFileSync } from "fs";
import { join } from "path";

let systemPrompt: string | null = null;

function getSystemPrompt(): string {
  if (systemPrompt) return systemPrompt;

  try {
    const promptPath = join(process.cwd(), "prompts", "system-prompt.md");
    systemPrompt = readFileSync(promptPath, "utf-8");
    return systemPrompt;
  } catch (error) {
    console.error("Failed to load system prompt:", error);
    return "당신은 개발의신이라는 이름의 소프트웨어 개발 전문가 AI 어시스턴트입니다.";
  }
}

export async function streamGeminiResponse(
  messages: Message[],
  onChunk: (text: string) => void
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const systemPrompt = getSystemPrompt();

  // Convert messages to Gemini format
  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text: "네, 알겠습니다. 저는 개발의신으로서 소프트웨어 개발 관련 질문에 친절하고 전문적으로 답변하겠습니다.",
          },
        ],
      },
      ...history,
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    },
  });

  const result = await chat.sendMessageStream(lastMessage.content);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
}
