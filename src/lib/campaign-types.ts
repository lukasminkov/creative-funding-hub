
export const CONTENT_TYPES = ["UGC", "Faceless", "Clipping"] as const;
export const CATEGORIES = ["Fashion", "Beauty", "Tech", "Gaming", "Food", "Travel", "Lifestyle", "Fitness", "Education", "Entertainment", "Finance", "Business", "Health", "Sports", "Music", "News", "Politics", "Science", "Art", "Design", "Photography", "Film", "Writing", "DIY", "Automotive", "Real Estate", "Home", "Parenting", "Pets", "Nature"] as const;
export const PLATFORMS = ["TikTok", "TikTok Shop", "Instagram Reels", "Twitter", "YouTube Shorts"] as const;
export const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "INR"] as const;

export type ContentType = typeof CONTENT_TYPES[number];
export type Category = typeof CATEGORIES[number];
export type Platform = typeof PLATFORMS[number];
export type Currency = typeof CURRENCIES[number];

export interface Brief {
  type: 'link' | 'file';
  value: string;
}

export interface CreatorTier {
  name: string;
  price: number;
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
}

export interface RetainerCampaign extends BaseCampaign {
  type: 'retainer';
  applicationDeadline: Date;
  creatorTiers: CreatorTier[];
  deliverables: {
    videosPerDay: number;
    durationDays: number;
  };
  requirements: string[];
  guidelines: {
    dos: string[];
    donts: string[];
  };
  trackingLink?: string;
  requestedTrackingLink?: boolean;
}

export interface PayPerViewCampaign extends BaseCampaign {
  type: 'payPerView';
  ratePerThousand: number;
  maxPayoutPerSubmission: number;
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
}

export type Campaign = RetainerCampaign | PayPerViewCampaign | ChallengeCampaign;
