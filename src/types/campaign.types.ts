
// Strict TypeScript types for campaign system
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type CampaignType = 'retainer' | 'payPerView' | 'challenge';
export type CampaignVisibility = 'public' | 'private' | 'applicationOnly' | 'restricted';
export type ContentType = 'video' | 'image' | 'article' | 'livestream' | 'ugc' | 'UGC' | 'Faceless' | 'Clipping';
export type Platform = 'tiktok' | 'instagram' | 'youtube' | 'twitter' | 'facebook' | 'linkedin' | 'TikTok' | 'TikTok Shop' | 'Instagram Reels' | 'Twitter' | 'YouTube Shorts';
export type Category = 'fashion' | 'beauty' | 'tech' | 'gaming' | 'food' | 'travel' | 'fitness' | 'lifestyle' | 'Fashion' | 'Beauty' | 'Tech' | 'Gaming' | 'Food' | 'Travel' | 'Lifestyle' | 'Fitness' | 'Education' | 'Entertainment' | 'Finance' | 'Business' | 'Health' | 'Sports' | 'Music' | 'News' | 'Politics' | 'Science' | 'Art' | 'Design' | 'Photography' | 'Film' | 'Writing' | 'DIY' | 'Automotive' | 'Real Estate' | 'Home' | 'Parenting' | 'Pets' | 'Nature' | 'entertainment' | 'art';
export type Country = 'worldwide' | 'usa' | 'mexico' | 'canada' | 'dach';
export type PrizeDistributionType = 'equal' | 'custom';

// Base interfaces with strict null safety
export interface CampaignGuidelines {
  dos: string[];
  donts: string[];
}

export interface PrizePoolPlace {
  position: number;
  prize: number;
}

export interface PrizePool {
  places: PrizePoolPlace[];
}

// Brief interface to match original types
export interface Brief {
  type: 'link' | 'file';
  value: string;
}

// Campaign validation errors with specific field types and index signature
export interface CampaignValidationErrors {
  [key: string]: string | undefined;
  title?: string;
  description?: string;
  totalBudget?: string;
  endDate?: string;
  platforms?: string;
  contentType?: string;
  category?: string;
  countryAvailability?: string;
  applicationDeadline?: string;
  submissionDeadline?: string;
  ratePerThousand?: string;
  maxPayoutPerSubmission?: string;
  prizeDistributionType?: string;
  prizeAmount?: string;
  winnersCount?: string;
  general?: string;
}

// Form state interface
export interface CampaignFormState {
  isLoading: boolean;
  isSaving: boolean;
  isSubmitting: boolean;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  errors: CampaignValidationErrors;
}

// Development tools types
export interface CampaignTestScenario {
  id: string;
  name: string;
  description: string;
  campaignData: Partial<Campaign>;
  expectedValidation: 'valid' | 'invalid';
  expectedErrors?: string[];
}

export interface DebugLogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  category: string;
  message: string;
  data?: any;
}

// Re-export existing Campaign type with better typing - made compatible with original
export interface Campaign {
  id?: string;
  title: string;
  description: string;
  type: CampaignType;
  status?: CampaignStatus;
  visibility: CampaignVisibility;
  contentType: ContentType;
  category: Category;
  platforms: Platform[];
  countryAvailability: Country;
  totalBudget: number;
  currency: string;
  endDate: Date;
  createdAt?: string | Date; // Made compatible with original type
  updatedAt?: Date;
  
  // Optional fields with strict null checking
  bannerImage?: string | null;
  guidelines?: CampaignGuidelines | null;
  requirements?: string[] | null;
  brief?: Brief | null; // Changed to Brief interface to match original
  instructionVideo?: string | null;
  instructionVideoFile?: File | null;
  exampleVideos?: File[] | null;
  requestedTrackingLink?: boolean;
  trackingLink?: string | null;
  
  // Brand information
  brandId?: string | null;
  brandName?: string | null;
  
  // Type-specific fields
  applicationDeadline?: Date | null; // For retainer campaigns
  submissionDeadline?: Date | null; // For challenge campaigns
  ratePerThousand?: number | null; // For pay-per-view campaigns
  maxPayoutPerSubmission?: number | null; // For pay-per-view campaigns
  viewValidationPeriod?: number | null; // For pay-per-view campaigns
  prizeDistributionType?: PrizeDistributionType | null; // For challenge campaigns
  prizeAmount?: number | null; // For challenge campaigns (equal distribution)
  winnersCount?: number | null; // For challenge campaigns (equal distribution)
  prizePool?: PrizePool | null; // For challenge campaigns (custom distribution)
  
  // Additional fields from original type to maintain compatibility
  creatorTiers?: any[];
  deliverables?: any;
  tikTokShopCommission?: any;
  applicationQuestions?: any[];
  restrictedAccess?: any;
}
