"use client";

import { useState } from "react";
import { Message } from "@/lib/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import MarkdownRenderer from "./MarkdownRenderer";
import { MoreHorizontal } from "lucide-react";

interface ChatMessageProps {
  message: Message;
  onReaction?: (messageId: string, reaction: string | undefined) => void;
}

const REACTIONS = ["❤️", "👍", "✅", "😊"];

export default function ChatMessage({ message, onReaction }: ChatMessageProps) {
  const [showReactions, setShowReactions] = useState(false);
  const isUser = message.role === "user";
  const time = format(message.timestamp, "a h:mm", { locale: ko });

  const handleReactionClick = (reaction: string) => {
    if (!onReaction) return;
    // Toggle reaction: if same reaction is clicked, remove it
    if (message.reaction === reaction) {
      onReaction(message.id, undefined);
    } else {
      onReaction(message.id, reaction);
    }
    // Close the reaction picker after selection
    setShowReactions(false);
  };

  return (
    <div className={`flex gap-2 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Profile Image - only show for AI */}
      {!isUser && (
        <div className="flex-shrink-0">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-kakao-purple text-white font-bold text-sm">
            AI
          </div>
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Name - only show for AI */}
        {!isUser && <div className="text-xs font-medium text-kakao-text mb-1 ml-1">개발의신</div>}

        {/* Message Bubble with Timestamp */}
        <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          {/* Bubble */}
          <div className="flex flex-col gap-1">
            <div
              className={`px-4 py-2.5 rounded-2xl ${
                isUser
                  ? "bg-kakao-yellow text-kakao-text rounded-tr-md shadow-sm"
                  : "bg-white text-kakao-text rounded-tl-md shadow-md border border-kakao-border"
              }`}
            >
              {isUser ? (
                <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                  {message.content}
                </div>
              ) : (
                <div className="text-[15px]">
                  <MarkdownRenderer content={message.content} />
                </div>
              )}
            </div>

            {/* Reaction Section - only for AI messages */}
            {!isUser && onReaction && (
              <div className="ml-1 flex gap-1 items-center">
                {/* Show selected reaction */}
                {message.reaction && (
                  <button
                    onClick={() => handleReactionClick(message.reaction!)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all bg-blue-100 border-2 border-blue-400 shadow-sm hover:scale-105"
                    title={message.reaction}
                  >
                    {message.reaction}
                  </button>
                )}

                {/* More button to toggle reaction picker */}
                <button
                  onClick={() => setShowReactions(!showReactions)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white border border-kakao-border hover:bg-kakao-lightGray hover:scale-105"
                  title="이모지 추가"
                >
                  <MoreHorizontal className="w-4 h-4 text-kakao-darkGray" />
                </button>

                {/* Reaction picker - show when clicked */}
                {showReactions && (
                  <div className="flex gap-1">
                    {REACTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactionClick(emoji)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
                          message.reaction === emoji
                            ? "bg-blue-100 border-2 border-blue-400 scale-110 shadow-sm"
                            : "bg-white border border-kakao-border hover:bg-kakao-lightGray hover:scale-105"
                        }`}
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="text-[11px] text-gray-500 mb-1 whitespace-nowrap">{time}</div>
        </div>
      </div>
    </div>
  );
}
