
export const CONTENT_TYPES = ["UGC", "Faceless", "Clipping"] as const;
export const CATEGORIES = ["Fashion", "Beauty", "Tech", "Gaming", "Food", "Travel", "Lifestyle", "Fitness", "Education", "Entertainment", "Finance", "Business", "Health", "Sports", "Music", "News", "Politics", "Science", "Art", "Design", "Photography", "Film", "Writing", "DIY", "Automotive", "Real Estate", "Home", "Parenting", "Pets", "Nature"] as const;
export const PLATFORMS = ["TikTok", "TikTok Shop", "Instagram Reels", "Twitter", "YouTube Shorts"] as const;
export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"] as const;
export const DELIVERABLE_MODES = ["videosPerDay", "totalVideos"] as const;
export const VISIBILITY_TYPES = ["public", "applicationOnly", "restricted"] as const;
export const QUESTION_TYPES = ["text", "image", "number", "link"] as const;
export const COUNTRY_OPTIONS = ["worldwide", "usa", "mexico", "canada", "dach"] as const;
export const OFFER_OPTIONS = ["MediaLabs Creator", "MediaLabs Campus", "Brez Clipping", "GROWTH Clippers", "Freezertarps Clipping", "Banks Interns"] as const;
export const STATUS_OPTIONS = ["active", "draft", "completed", "paused"] as const;

export type ContentType = typeof CONTENT_TYPES[number];
export type Category = typeof CATEGORIES[number];
export type Platform = typeof PLATFORMS[number];
export type Currency = typeof CURRENCIES[number];
export type DeliverableMode = typeof DELIVERABLE_MODES[number];
export type VisibilityType = typeof VISIBILITY_TYPES[number];
export type QuestionType = typeof QUESTION_TYPES[number];
export type CountryOption = typeof COUNTRY_OPTIONS[number];
export type OfferOption = typeof OFFER_OPTIONS[number];
export type StatusType = typeof STATUS_OPTIONS[number];

export interface Brief {
  type: 'link' | 'file';
  value: string;
}

export interface CreatorTier {
  name: string;
  price: number;
}

export interface Guidelines {
  dos: string[];
  donts: string[];
}

export interface TikTokShopCommission {
  openCollabCommission: number;
  increasedCommission: number;
}

export interface ExampleVideo {
  platform: Platform;
  url: string;
}

export interface ApplicationQuestion {
  id: string;
  question: string;
  type: QuestionType;
  required: boolean;
}

export interface RestrictedAccess {
  type: 'offer' | 'invite';
  offerIds?: string[];
  inviteLink?: string;
}

interface BaseCampaign {
  id?: string;
  title: string;
  description?: string;
  type: 'retainer' | 'payPerView' | 'challenge';
  contentType: ContentType;
  category: Category;
  platforms: Platform[];
  totalBudget: number;
  currency: Currency;
  endDate: Date;
  bannerImage?: string;
  brief?: Brief;
  instructionVideo?: string;
  instructionVideoFile?: File | null;
  guidelines: Guidelines;
  trackingLink?: string;
  requestedTrackingLink?: boolean;
  tikTokShopCommission?: TikTokShopCommission;
  brandId?: string;
  brandName?: string;
  exampleVideos?: ExampleVideo[];
  visibility: VisibilityType;
  applicationQuestions?: ApplicationQuestion[];
  restrictedAccess?: RestrictedAccess;
  countryAvailability: CountryOption;
  requirements: string[];
  status?: StatusType;
  createdAt?: string | Date;
}

export interface RetainerCampaign extends BaseCampaign {
  type: 'retainer';
  applicationDeadline: Date;
  creatorTiers: CreatorTier[];
  deliverables: {
    mode: DeliverableMode;
    videosPerDay?: number;
    durationDays?: number;
    totalVideos?: number;
  };
}

export interface PayPerViewCampaign extends BaseCampaign {
  type: 'payPerView';
  ratePerThousand: number;
  maxPayoutPerSubmission: number;
  contentRequirements?: string;
  viewValidationPeriod?: number;
}

export interface ChallengeCampaign extends BaseCampaign {
  type: 'challenge';
  prizePool: {
    places: {
      position: number;
      prize: number;
    }[];
  };
  submissionDeadline: Date;
  prizeAmount?: number;
  winnersCount?: number;
}

export type Campaign = RetainerCampaign | PayPerViewCampaign | ChallengeCampaign;

export const formatCurrency = (amount: number, currency: Currency = "USD"): string => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
};

export const getDaysLeft = (date: Date): number => {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const getCountryLabel = (countryOption: CountryOption): string => {
  switch (countryOption) {
    case 'worldwide':
      return 'Worldwide';
    case 'usa':
      return 'United States';
    case 'mexico':
      return 'Mexico';
    case 'canada':
      return 'Canada';
    case 'dach':
      return 'DACH (Germany, Austria, Switzerland)';
    default:
      return 'Worldwide';
  }
};
