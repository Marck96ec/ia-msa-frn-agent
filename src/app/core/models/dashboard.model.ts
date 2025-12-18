// Dashboard models
export interface Dashboard {
  event: DashboardEvent;
  rsvpSummary: RSVPSummary;
  giftSummary: GiftSummary;
  recentActivity: Activity[];
  statistics: Statistics;
}

export interface DashboardEvent {
  id: string;
  slug: string;
  babyName: string;
  eventDate: string;
  location: string;
  daysUntilEvent: number;
}

export interface RSVPSummary {
  totalResponses: number;
  confirmed: number;
  declined: number;
  maybe: number;
  pending: number;
  totalExpectedGuests: number;
}

export interface GiftSummary {
  totalGifts: number;
  availableGifts: number;
  reservedGifts: number;
  partiallyFundedGifts: number;
  fullyFundedGifts: number;
  totalBudget: number;
  coveredBudget: number;
  remainingBudget: number;
  coveragePercentage: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
  userName?: string;
}

export enum ActivityType {
  RSVP_CONFIRMED = 'RSVP_CONFIRMED',
  RSVP_DECLINED = 'RSVP_DECLINED',
  GIFT_RESERVED = 'GIFT_RESERVED',
  GIFT_CONTRIBUTED = 'GIFT_CONTRIBUTED',
  IDEA_SUBMITTED = 'IDEA_SUBMITTED',
  BABY_MESSAGE_RECEIVED = 'BABY_MESSAGE_RECEIVED'
}

export interface Statistics {
  totalIdeas: number;
  totalBabyMessages: number;
  totalContributions: number;
  averageContributionAmount: number;
}
