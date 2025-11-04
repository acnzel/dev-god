"use client";

import { Conversation } from "@/lib/types";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Plus, MessageSquare, Trash2, X } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ConversationList({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
}: ConversationListProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full bg-white border-r border-kakao-border z-50 transition-transform duration-300 shadow-lg lg:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } w-72`}
      >
        {/* Header with New Conversation Button */}
        <div className="p-3 border-b border-kakao-border">
          <button
            onClick={onNewConversation}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            새 대화
          </button>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-kakao-lightGray rounded-lg transition-colors lg:hidden"
            title="닫기"
          >
            <X className="w-5 h-5 text-kakao-text" />
          </button>
        </div>

        {/* Conversation List */}
        <div className="overflow-y-auto h-[calc(100%-77px)]">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-kakao-darkGray p-6">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm text-center text-kakao-darkGray">대화 목록이 비어있습니다.</p>
              <p className="text-xs text-center mt-1 text-kakao-darkGray">새 대화를 시작해보세요!</p>
            </div>
          ) : (
            <div className="divide-y divide-kakao-lightGray">
              {conversations
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .map((conv) => (
                  <div
                    key={conv.id}
                    className={`group relative px-4 py-3.5 cursor-pointer transition-colors ${
                      conv.id === currentConversationId
                        ? "bg-kakao-lightGray"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => onSelectConversation(conv.id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[15px] text-kakao-text truncate mb-1">
                          {conv.title}
                        </h3>
                        <p className="text-xs text-kakao-darkGray">
                          {conv.messages.length}개 메시지 · {format(conv.updatedAt, "M/d a h:mm", { locale: ko })}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm("이 대화를 삭제하시겠습니까?")
                          ) {
                            onDeleteConversation(conv.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 rounded transition-opacity"
                        title="삭제"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
