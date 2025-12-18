// Commitment models
export interface Commitment {
  id: string;
  token: string;
  eventId: string;
  userId: string;
  type: CommitmentType;
  giftId?: string;
  amount?: number;
  status: CommitmentStatus;
  createdAt: string;
  expiresAt?: string;
}

export enum CommitmentType {
  GIFT_RESERVE = 'GIFT_RESERVE',
  GIFT_CONTRIBUTION = 'GIFT_CONTRIBUTION',
  RSVP = 'RSVP'
}

export enum CommitmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

// Response del backend al crear compromiso
export interface CommitmentResponse {
  id: number;
  giftId: number;
  giftName: string;
  userId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  commitmentType: 'FULL_RESERVATION' | 'PARTIAL_CONTRIBUTION';
  contributionAmount?: number;
  token: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
  cancelledAt?: string;
}
