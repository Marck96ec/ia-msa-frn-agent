// Baby Message models
export interface BabyMessage {
  id: number;
  eventId: number;
  userId: string;
  guestName?: string;
  messageText: string;
  audioUrl?: string;
  isPublished?: boolean;
  createdAt: string;
}

export interface CreateBabyMessageRequest {
  userId: string;
  guestName?: string;
  messageText: string;
  audioUrl?: string;
}
