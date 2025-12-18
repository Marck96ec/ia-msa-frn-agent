// Chat models
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  quickReplies?: QuickReply[];
}

export interface QuickReply {
  label: string;
  value: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface ChatRequest {
  conversationId?: string;
  userId: string;
  eventId?: number | string;
  message: string;
  mode: ChatMode;
  metadata?: Record<string, any>;
}

export enum ChatMode {
  EVENT = 'EVENT',
  GENERAL = 'GENERAL'
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  quickReplies?: QuickReply[];
  action?: ChatAction;
  metadata?: Record<string, any>;
}

export interface ChatAction {
  type: 'navigate' | 'show_gifts' | 'show_location' | 'show_rsvp';
  data?: any;
}
