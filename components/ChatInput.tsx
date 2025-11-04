"use client";

import { useState, KeyboardEvent, useRef } from "react";
import { Send } from "lucide-react";
import EmojiPicker from "./EmojiPicker";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = input.substring(0, start) + emoji + input.substring(end);

    setInput(newValue);

    // Set cursor position after emoji
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + emoji.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="border-t border-kakao-border bg-white px-6 py-4 shadow-sm">
      <div className="flex items-end gap-2 max-w-5xl mx-auto">
        {/* Emoji Picker */}
        <EmojiPicker onSelect={handleEmojiSelect} />

        {/* Message Input */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={disabled}
          className="flex-1 resize-none border border-kakao-border rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-kakao-lightGray disabled:cursor-not-allowed text-[15px] max-h-32 transition-all"
          rows={1}
          style={{
            minHeight: "44px",
            maxHeight: "128px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "44px";
            target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="text-center text-xs text-kakao-darkGray mt-2">
        Shift + Enter로 줄바꿈, Enter로 전송
      </div>
    </div>
  );
}
