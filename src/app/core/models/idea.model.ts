// Idea models
export interface Idea {
  id: number;
  eventId: number;
  userId: string;
  guestName: string;
  description: string;
  isApproved?: boolean;
  organizerComment?: string;
  createdAt: string;
}

export interface CreateIdeaRequest {
  userId: string;
  guestName?: string;
  description: string;
}
