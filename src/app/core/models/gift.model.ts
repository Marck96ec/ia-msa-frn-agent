// Gift models
export interface Gift {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  priority?: number;
  status: GiftStatus;
  allowSplit: boolean;
  isActive: boolean;
  quantity?: number;
  purchaseUrl?: string;
  currentFunding: number;
  fundingPercentage: number;
  commitmentCount: number;
  createdAt?: string;
  updatedAt?: string;
  // Info del reservador (cuando está reservado)
  reserverName?: string;
  reservedAt?: string;
}

export enum GiftStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  PARTIALLY_FUNDED = 'PARTIALLY_FUNDED',
  FULLY_FUNDED = 'FULLY_FUNDED',
  INACTIVE = 'INACTIVE'
}

export interface CreateGiftRequest {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  allowSplit: boolean;
  priority?: number;
  quantity?: number;
  purchaseUrl?: string;
}

export interface UpdateGiftRequest {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  allowSplit?: boolean;
  priority?: number;
  isActive?: boolean;
  quantity?: number;
  purchaseUrl?: string;
}

export interface ReserveGiftRequest {
  userId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
}

export interface ContributeGiftRequest {
  userId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  contributionAmount: number;
  notes?: string;
}

export interface ImportGiftsRequest {
  gifts: CreateGiftRequest[];
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
