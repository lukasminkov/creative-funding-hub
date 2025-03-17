export type CreatorTier = {
  name: string;
  price: number;
};

export type CampaignBase = {
  id?: string;
  title: string;
  description: string;
  contentType: string;
  category: string;
  totalBudget: number;
  currency: string;
  endDate: Date;
  platforms: string[];
  bannerImage?: string;
  brief?: {
    type: 'link' | 'file';
    value: string; // URL for link, filename for file
  };
  instructionVideo?: string; // URL to the instruction video
};

export type RetainerCampaign = CampaignBase & {
  type: 'retainer';
  creatorTiers: CreatorTier[];
  deliverables: {
    videosPerDay: number;
    durationDays: number;
  };
  requirements: string[]; // New field for individual requirements
  guidelines: { // New field for guidelines
    dos: string[];
    donts: string[];
  };
  trackingLink?: string; // New field for tracking link
  requestedTrackingLink?: boolean; // New field to request tracking link
  applicationDeadline: Date; // New field for application deadline
};

export type PayPerViewCampaign = CampaignBase & {
  type: 'payPerView';
  ratePerThousand: number;
  maxPayoutPerSubmission: number;
};

export type ChallengeCampaign = CampaignBase & {
  type: 'challenge';
  prizePool: {
    places: Array<{
      position: number;
      prize: number;
    }>;
  };
  submissionDeadline: Date;
};

export type Campaign = RetainerCampaign | PayPerViewCampaign | ChallengeCampaign;

export const CONTENT_TYPES = [
  'UGC',
  'Faceless',
  'Clipping'
];

export const CATEGORIES = [
  'Technology',
  'Beauty',
  'Fashion',
  'Food',
  'Fitness',
  'Travel',
  'Lifestyle',
  'Gaming',
  'Education',
  'Entertainment',
  'Business',
  'Health',
  'Home',
  'Parenting',
  'Sports'
];

export const PLATFORMS = [
  'TikTok Shop',
  'TikTok',
  'Instagram Reels',
  'Twitter',
  'YouTube Shorts'
];

export const CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'CAD',
  'AUD',
  'JPY',
  'CNY',
  'INR'
];

// Helper functions
export function calculatePayout(campaign: Campaign): number {
  switch(campaign.type) {
    case 'retainer':
      return campaign.creatorTiers.reduce((sum, tier) => sum + tier.price, 0);
    case 'payPerView':
      return campaign.totalBudget;
    case 'challenge':
      return campaign.prizePool.places.reduce((sum, place) => sum + place.prize, 0);
  }
}

export function getDaysLeft(endDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
