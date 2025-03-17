
export type CreatorTier = {
  name: string;
  price: number;
  requirements: string;
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
};

export type RetainerCampaign = CampaignBase & {
  type: 'retainer';
  creatorTiers: CreatorTier[];
  deliverables: {
    videosPerDay: number;
    durationDays: number;
  };
};

export type PayPerViewCampaign = CampaignBase & {
  type: 'payPerView';
  ratePerThousand: number;
  maxPayoutPerSubmission: number;
};

export type ChallengeCampaign = CampaignBase & {
  type: 'challenge';
  prizePool: {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    runnerUps: number;
    runnerUpsCount: number;
  };
  submissionDeadline: Date;
};

export type Campaign = RetainerCampaign | PayPerViewCampaign | ChallengeCampaign;

export const CONTENT_TYPES = [
  'Product Review',
  'Unboxing',
  'Tutorial',
  'Day in the Life',
  'Behind the Scenes',
  'Testimonial',
  'Challenge',
  'Trending Format',
  'Educational',
  'Entertainment'
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
  'TikTok',
  'Instagram',
  'YouTube',
  'Twitter',
  'Facebook',
  'LinkedIn',
  'Pinterest',
  'Snapchat',
  'Twitch'
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
      return (
        campaign.prizePool.firstPlace +
        campaign.prizePool.secondPlace +
        campaign.prizePool.thirdPlace +
        campaign.prizePool.runnerUps * campaign.prizePool.runnerUpsCount
      );
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
