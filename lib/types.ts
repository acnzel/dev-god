export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  reaction?: string; // Emoji reaction: ❤️, 👍, ✅, 😊
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
}
