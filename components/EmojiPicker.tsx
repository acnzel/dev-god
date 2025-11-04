"use client";

import { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  "자주 사용": ["😀", "😊", "😂", "🤣", "😍", "🥰", "😎", "🤔", "😭", "😱"],
  "표정": ["😃", "😄", "😁", "😆", "😅", "🤪", "😜", "😝", "🤗", "🤭"],
  "손동작": ["👍", "👎", "👏", "🙌", "👌", "✌️", "🤞", "🤝", "🙏", "✋"],
  "하트": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💖"],
  "기타": ["✅", "❌", "⭐", "🎉", "🎊", "🔥", "💯", "✨", "⚡", "💪"],
};

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("자주 사용");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleEmojiClick = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 hover:bg-kakao-lightGray rounded-lg transition-colors"
        title="이모지 추가"
      >
        <Smile className="w-5 h-5 text-kakao-darkGray" />
      </button>

      {/* Emoji Picker Popup */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white border border-kakao-border rounded-xl shadow-2xl w-80 z-50">
          {/* Category Tabs */}
          <div className="flex gap-1 p-2 border-b border-kakao-border overflow-x-auto">
            {Object.keys(EMOJI_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-blue-500 text-white"
                    : "bg-kakao-lightGray text-kakao-text hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Emoji Grid */}
          <div className="p-3 grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
            {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map(
              (emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-9 h-9 flex items-center justify-center text-2xl hover:bg-kakao-lightGray rounded-lg transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
