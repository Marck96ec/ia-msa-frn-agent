// Event models
export interface Event {
  id: number;
  slug: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  locationUrl?: string;
  welcomeMessage?: string;
  imageUrl?: string;
  allowSharedGifts?: boolean;
  allowBabyMessages?: boolean;
  allowIdeas?: boolean;
  // Campos calculados/helper para compatibilidad
  babyName?: string; // Derivado de name
  parentNames?: string[]; // Derivado de organizerName
  coverImageUrl?: string; // Alias de imageUrl
}

export interface Location {
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  mapsUrl?: string;
}

export interface CreateEventRequest {
  slug: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  locationUrl?: string;
  welcomeMessage?: string;
  closingMessage?: string;
  chatbotInstructions?: string;
  maxAttendees?: number;
  giftBudget?: number;
  organizerUserId: string;
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  allowSharedGifts?: boolean;
  allowBabyMessages?: boolean;
  allowIdeas?: boolean;
  imageUrl?: string;
}

export interface UpdateEventRequest {
  name?: string;
  description?: string;
  eventDate?: string;
  location?: string;
  locationUrl?: string;
  welcomeMessage?: string;
  closingMessage?: string;
  chatbotInstructions?: string;
  isActive?: boolean;
  maxAttendees?: number;
  giftBudget?: number;
  organizerName?: string;
  organizerEmail?: string;
  organizerPhone?: string;
  allowSharedGifts?: boolean;
  allowBabyMessages?: boolean;
  allowIdeas?: boolean;
  imageUrl?: string;
}
