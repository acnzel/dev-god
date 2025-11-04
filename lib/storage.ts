import { Conversation, ChatState, Message } from "./types";

const STORAGE_KEY = "dev-god-chatbot-state";

export const storage = {
  // Load chat state from localStorage
  loadState(): ChatState {
    if (typeof window === "undefined") {
      return { conversations: [], currentConversationId: null };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return { conversations: [], currentConversationId: null };
      }

      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return {
        conversations: parsed.conversations.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })),
        currentConversationId: parsed.currentConversationId,
      };
    } catch (error) {
      console.error("Failed to load chat state:", error);
      return { conversations: [], currentConversationId: null };
    }
  },

  // Save chat state to localStorage
  saveState(state: ChatState): void {
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save chat state:", error);
    }
  },

  // Create a new conversation
  createConversation(title?: string): Conversation {
    const now = new Date();
    return {
      id: crypto.randomUUID(),
      title: title || `새 대화 ${new Date().toLocaleDateString("ko-KR")}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
  },

  // Add a message to a conversation
  addMessage(
    conversation: Conversation,
    role: "user" | "assistant",
    content: string
  ): Conversation {
    const message: Message = {
      id: crypto.randomUUID(),
      role,
      content,
      timestamp: new Date(),
    };

    return {
      ...conversation,
      messages: [...conversation.messages, message],
      updatedAt: new Date(),
    };
  },

  // Update the last message (useful for streaming)
  updateLastMessage(conversation: Conversation, content: string): Conversation {
    const messages = [...conversation.messages];
    if (messages.length === 0) return conversation;

    messages[messages.length - 1] = {
      ...messages[messages.length - 1],
      content,
    };

    return {
      ...conversation,
      messages,
      updatedAt: new Date(),
    };
  },

  // Generate a title from the first user message
  generateTitle(firstMessage: string): string {
    const maxLength = 30;
    if (firstMessage.length <= maxLength) {
      return firstMessage;
    }
    return firstMessage.substring(0, maxLength) + "...";
  },

  // Update message reaction
  updateMessageReaction(
    conversation: Conversation,
    messageId: string,
    reaction: string | undefined
  ): Conversation {
    const messages = conversation.messages.map((msg) => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reaction,
        };
      }
      return msg;
    });

    return {
      ...conversation,
      messages,
      updatedAt: new Date(),
    };
  },
};
