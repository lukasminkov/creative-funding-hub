
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

export interface Guidelines {
  dos: string[];
  donts: string[];
}

export interface TikTokShopCommission {
  openCollabCommission: number;
  increasedCommission: number;
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

// Helper functions
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
