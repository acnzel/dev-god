"use client";

import { useState, useEffect, useRef } from "react";
import { Conversation, Message } from "@/lib/types";
import { storage } from "@/lib/storage";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ConversationList from "./ConversationList";
import { Menu, Bot } from "lucide-react";

export default function ChatInterface() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find((c) => c.id === currentConversationId);

  // Mark component as mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load state from localStorage only after mounting
  useEffect(() => {
    if (!isMounted) return;

    const state = storage.loadState();
    setConversations(state.conversations);
    setCurrentConversationId(state.currentConversationId);

    // If no conversations exist, create a new one
    if (state.conversations.length === 0) {
      const newConv = storage.createConversation();
      setConversations([newConv]);
      setCurrentConversationId(newConv.id);
    }
  }, [isMounted]);

  // Save state to localStorage whenever it changes (skip if not mounted yet)
  useEffect(() => {
    if (!isMounted) return;
    storage.saveState({ conversations, currentConversationId });
  }, [conversations, currentConversationId, isMounted]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentConversation?.messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentConversationId || isStreaming) return;

    const conversation = conversations.find((c) => c.id === currentConversationId);
    if (!conversation) return;

    // Add user message
    let updatedConv = storage.addMessage(conversation, "user", content);

    // Update title if this is the first message
    if (updatedConv.messages.length === 1) {
      updatedConv = {
        ...updatedConv,
        title: storage.generateTitle(content),
      };
    }

    // Add empty assistant message for streaming
    updatedConv = storage.addMessage(updatedConv, "assistant", "");

    setConversations((prev) => prev.map((c) => (c.id === updatedConv.id ? updatedConv : c)));
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedConv.messages.slice(0, -1), // Exclude the empty assistant message
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                accumulatedContent += parsed.content;
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === currentConversationId
                      ? storage.updateLastMessage(c, accumulatedContent)
                      : c
                  )
                );
              } else if (parsed.error) {
                console.error("Streaming error:", parsed.error);
              }
            } catch (e) {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? storage.updateLastMessage(
                c,
                "죄송합니다. 메시지를 처리하는 중 오류가 발생했습니다. 다시 시도해주세요."
              )
            : c
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleNewConversation = () => {
    const newConv = storage.createConversation();
    setConversations((prev) => [...prev, newConv]);
    setCurrentConversationId(newConv.id);
    setIsSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setIsSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);

      // If deleted conversation was current, switch to another or create new
      if (id === currentConversationId) {
        if (filtered.length > 0) {
          setCurrentConversationId(filtered[0].id);
        } else {
          const newConv = storage.createConversation();
          setCurrentConversationId(newConv.id);
          return [newConv];
        }
      }

      return filtered;
    });
  };

  const handleReaction = (messageId: string, reaction: string | undefined) => {
    if (!currentConversationId) return;

    const conversation = conversations.find((c) => c.id === currentConversationId);
    if (!conversation) return;

    const updatedConv = storage.updateMessageReaction(conversation, messageId, reaction);
    setConversations((prev) => prev.map((c) => (c.id === updatedConv.id ? updatedConv : c)));
  };

  // Show nothing during SSR to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-kakao-bg">
      {/* Sidebar */}
      <ConversationList
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-kakao-border px-5 py-3.5 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-kakao-lightGray rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-kakao-text" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-kakao-purple text-white font-bold text-xs shadow-md">
              ✨
            </div>
            <h1 className="text-lg font-bold text-kakao-text">개발의신</h1>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="max-w-5xl mx-auto">
            {currentConversation?.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-kakao-darkGray">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-kakao-purple text-white font-bold text-2xl shadow-lg mb-4">
                  ✨
                </div>
                <h2 className="text-xl font-bold mb-2 text-kakao-text">개발의신과 대화를 시작하세요</h2>
                <p className="text-sm text-center text-kakao-darkGray">
                  소프트웨어 개발 관련 질문을 자유롭게 해주세요!
                </p>
              </div>
            ) : (
              <>
                {currentConversation?.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} onReaction={handleReaction} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input */}
        <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
