// RSVP models
export interface RSVP {
  id: number;
  eventId: number;
  userId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  status: RSVPStatus;
  guestsCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export enum RSVPStatus {
  CONFIRMED = 'CONFIRMED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING'
}

export interface CreateRSVPRequest {
  userId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  status: RSVPStatus;
  guestsCount?: number;
  notes?: string;
}

export interface Attendee {
  id: number;
  userId: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  guestsCount: number;
  totalPeople: number;
  notes?: string;
  confirmedAt: string;
}
