
import { Campaign, CampaignType } from "./campaign-types";

// Campaign validation utilities
export const validateCampaignBasics = (campaign: Partial<Campaign>): string[] => {
  const errors: string[] = [];
  
  if (!campaign.title || campaign.title.length < 3) {
    errors.push("Title must be at least 3 characters");
  }
  
  if (!campaign.description || campaign.description.length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  if (!campaign.totalBudget || campaign.totalBudget <= 0) {
    errors.push("Budget must be greater than 0");
  }
  
  if (!campaign.platforms || campaign.platforms.length === 0) {
    errors.push("At least one platform is required");
  }
  
  if (!campaign.endDate || campaign.endDate <= new Date()) {
    errors.push("End date must be in the future");
  }
  
  return errors;
};

export const formatCampaignBudget = (budget: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(budget);
};

export const calculateCampaignProgress = (campaign: Campaign): number => {
  const now = new Date();
  const start = campaign.createdAt ? new Date(campaign.createdAt) : now;
  const end = new Date(campaign.endDate);
  
  if (now < start) return 0;
  if (now > end) return 100;
  
  const total = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  
  return Math.round((elapsed / total) * 100);
};

export const getCampaignStatus = (campaign: Campaign): "draft" | "active" | "completed" | "expired" => {
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  
  if (endDate < now) {
    return "expired";
  }
  
  // For retainer campaigns, check application deadline
  if (campaign.type === "retainer" && "applicationDeadline" in campaign) {
    const appDeadline = new Date(campaign.applicationDeadline);
    if (appDeadline < now) {
      return "completed";
    }
  }
  
  // For challenge campaigns, check submission deadline
  if (campaign.type === "challenge" && "submissionDeadline" in campaign) {
    const subDeadline = new Date(campaign.submissionDeadline);
    if (subDeadline < now) {
      return "completed";
    }
  }
  
  return "active";
};

export const getDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCampaignDuration = (startDate: Date, endDate: Date): string => {
  const diffTime = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 day";
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
};

// Database conversion utility with proper type handling
export const convertCampaignToDatabase = (campaign: Campaign): any => {
  const base = {
    title: campaign.title,
    description: campaign.description,
    type: campaign.type,
    total_budget: campaign.totalBudget,
    currency: campaign.currency || "USD",
    content_type: campaign.contentType,
    category: campaign.category,
    country_availability: campaign.countryAvailability,
    platforms: campaign.platforms,
    end_date: campaign.endDate,
    requirements: campaign.requirements || [],
    visibility: campaign.visibility || "public",
    guidelines: campaign.guidelines ? JSON.stringify(campaign.guidelines) : null,
    requested_tracking_link: campaign.requestedTrackingLink || false,
    tracking_link: campaign.trackingLink || null,
    banner_image: campaign.bannerImage || null,
    brief: campaign.brief ? JSON.stringify(campaign.brief) : null,
    instruction_video: campaign.instructionVideo || null,
    example_videos: campaign.exampleVideos ? JSON.stringify(campaign.exampleVideos) : null,
  };

  // Handle type-specific fields with proper type checking
  if (campaign.type === "retainer" && "applicationDeadline" in campaign) {
    return {
      ...base,
      application_deadline: campaign.applicationDeadline,
    };
  }

  if (campaign.type === "challenge" && "submissionDeadline" in campaign) {
    const challengeFields: any = {
      submission_deadline: campaign.submissionDeadline,
    };

    if ("prizeDistributionType" in campaign) {
      challengeFields.prize_distribution_type = campaign.prizeDistributionType;
    }
    if ("prizeAmount" in campaign) {
      challengeFields.prize_amount = campaign.prizeAmount;
    }
    if ("winnersCount" in campaign) {
      challengeFields.winners_count = campaign.winnersCount;
    }
    if ("prizePool" in campaign) {
      challengeFields.prize_pool = JSON.stringify(campaign.prizePool);
    }

    return {
      ...base,
      ...challengeFields,
    };
  }

  if (campaign.type === "payPerView") {
    const payPerViewFields: any = {};
    
    if ("ratePerThousand" in campaign) {
      payPerViewFields.rate_per_thousand = campaign.ratePerThousand;
    }
    if ("maxPayoutPerSubmission" in campaign) {
      payPerViewFields.max_payout_per_submission = campaign.maxPayoutPerSubmission;
    }
    if ("viewValidationPeriod" in campaign) {
      payPerViewFields.view_validation_period = campaign.viewValidationPeriod;
    }

    return {
      ...base,
      ...payPerViewFields,
    };
  }

  return base;
};

// Type guards for campaign types
export const isRetainerCampaign = (campaign: Campaign): campaign is Campaign & { type: "retainer"; applicationDeadline: Date } => {
  return campaign.type === "retainer";
};

export const isPayPerViewCampaign = (campaign: Campaign): campaign is Campaign & { type: "payPerView"; ratePerThousand: number; maxPayoutPerSubmission: number } => {
  return campaign.type === "payPerView";
};

export const isChallengeCampaign = (campaign: Campaign): campaign is Campaign & { type: "challenge"; submissionDeadline: Date } => {
  return campaign.type === "challenge";
};
