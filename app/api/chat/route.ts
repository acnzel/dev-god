import { NextRequest } from "next/server";
import { streamGeminiResponse } from "@/lib/gemini";
import { Message } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid request body", { status: 400 });
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          await streamGeminiResponse(
            messages as Message[],
            (chunk: string) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "스트리밍 중 오류가 발생했습니다." })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
