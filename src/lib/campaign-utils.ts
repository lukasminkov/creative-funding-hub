
import { Campaign, CampaignType, formatCurrency } from "./campaign-types";

// Campaign validation utilities
export const validateCampaignBudget = (campaign: Partial<Campaign>): boolean => {
  if (!campaign.totalBudget || campaign.totalBudget <= 0) return false;
  
  // For challenge campaigns, ensure prize amounts don't exceed budget
  if (campaign.type === "challenge") {
    if (campaign.prizeDistributionType === "equal" && campaign.prizeAmount && campaign.winnersCount) {
      const totalPrizeAmount = campaign.prizeAmount * campaign.winnersCount;
      return totalPrizeAmount <= campaign.totalBudget;
    }
    
    if (campaign.prizeDistributionType === "custom" && campaign.prizePool) {
      const totalPrizeAmount = campaign.prizePool.places.reduce((sum, place) => sum + place.prize, 0);
      return totalPrizeAmount <= campaign.totalBudget;
    }
  }
  
  return true;
};

export const validateCampaignDates = (campaign: Partial<Campaign>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const now = new Date();
  
  if (!campaign.endDate) {
    errors.push("End date is required");
    return { isValid: false, errors };
  }
  
  const endDate = new Date(campaign.endDate);
  if (endDate <= now) {
    errors.push("End date must be in the future");
  }
  
  // Type-specific date validation
  if (campaign.type === "retainer" && campaign.applicationDeadline) {
    const appDeadline = new Date(campaign.applicationDeadline);
    if (appDeadline <= now) {
      errors.push("Application deadline must be in the future");
    }
    if (appDeadline >= endDate) {
      errors.push("Application deadline must be before campaign end date");
    }
  }
  
  if (campaign.type === "challenge" && campaign.submissionDeadline) {
    const subDeadline = new Date(campaign.submissionDeadline);
    if (subDeadline <= now) {
      errors.push("Submission deadline must be in the future");
    }
    if (subDeadline >= endDate) {
      errors.push("Submission deadline must be before campaign end date");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Campaign formatting utilities
export const formatCampaignSummary = (campaign: Campaign): string => {
  const parts = [
    `${campaign.type} campaign`,
    `${formatCurrency(campaign.totalBudget)} budget`,
    `${campaign.platforms.join(", ")} platforms`,
    `${campaign.category} category`
  ];
  
  return parts.join(" • ");
};

export const getCampaignTypeConfig = (type: CampaignType) => {
  const configs = {
    retainer: {
      name: "Retainer Campaign",
      description: "Long-term creator partnerships",
      icon: "users",
      color: "blue"
    },
    payPerView: {
      name: "Pay Per View",
      description: "Performance-based payments",
      icon: "eye",
      color: "green"
    },
    challenge: {
      name: "Challenge Campaign",
      description: "Competition with prizes",
      icon: "trophy",
      color: "purple"
    }
  };
  
  return configs[type];
};

// Campaign status utilities
export const calculateCampaignProgress = (campaign: Campaign): {
  status: "draft" | "active" | "ending_soon" | "ended";
  daysRemaining: number;
  progressPercentage: number;
} => {
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  let status: "draft" | "active" | "ending_soon" | "ended";
  if (daysRemaining <= 0) {
    status = "ended";
  } else if (daysRemaining <= 7) {
    status = "ending_soon";
  } else {
    status = "active";
  }
  
  // Calculate progress based on time elapsed
  const createdAt = campaign.createdAt ? new Date(campaign.createdAt) : now;
  const totalDuration = endDate.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();
  const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  
  return {
    status,
    daysRemaining: Math.max(0, daysRemaining),
    progressPercentage
  };
};

// Data conversion utilities for database operations
export const convertCampaignToDatabase = (campaign: Campaign) => {
  return {
    ...campaign,
    end_date: campaign.endDate,
    application_deadline: campaign.applicationDeadline,
    submission_deadline: campaign.submissionDeadline,
    total_budget: campaign.totalBudget,
    content_type: campaign.contentType,
    country_availability: campaign.countryAvailability,
    rate_per_thousand: campaign.ratePerThousand,
    max_payout_per_submission: campaign.maxPayoutPerSubmission,
    view_validation_period: campaign.viewValidationPeriod,
    prize_amount: campaign.prizeAmount,
    winners_count: campaign.winnersCount,
    prize_distribution_type: campaign.prizeDistributionType,
    prize_pool: campaign.prizePool,
    requested_tracking_link: campaign.requestedTrackingLink,
    tracking_link: campaign.trackingLink,
    banner_image: campaign.bannerImage,
    instruction_video: campaign.instructionVideo,
    example_videos: campaign.exampleVideos,
    application_questions: campaign.applicationQuestions,
    restricted_access: campaign.restrictedAccess,
    creator_tiers: campaign.creatorTiers,
    deliverables: campaign.deliverables
  };
};

export const convertDatabaseToCampaign = (dbCampaign: any): Campaign => {
  return {
    ...dbCampaign,
    endDate: dbCampaign.end_date,
    applicationDeadline: dbCampaign.application_deadline,
    submissionDeadline: dbCampaign.submission_deadline,
    totalBudget: dbCampaign.total_budget,
    contentType: dbCampaign.content_type,
    countryAvailability: dbCampaign.country_availability,
    ratePerThousand: dbCampaign.rate_per_thousand,
    maxPayoutPerSubmission: dbCampaign.max_payout_per_submission,
    viewValidationPeriod: dbCampaign.view_validation_period,
    prizeAmount: dbCampaign.prize_amount,
    winnersCount: dbCampaign.winners_count,
    prizeDistributionType: dbCampaign.prize_distribution_type,
    prizePool: dbCampaign.prize_pool,
    requestedTrackingLink: dbCampaign.requested_tracking_link,
    trackingLink: dbCampaign.tracking_link,
    bannerImage: dbCampaign.banner_image,
    instructionVideo: dbCampaign.instruction_video,
    exampleVideos: dbCampaign.example_videos,
    applicationQuestions: dbCampaign.application_questions,
    restrictedAccess: dbCampaign.restricted_access,
    creatorTiers: dbCampaign.creator_tiers,
    deliverables: dbCampaign.deliverables
  };
};

// Form state utilities
export const getRequiredFieldsForStep = (step: number, campaignType: CampaignType): string[] => {
  const stepFieldMap = {
    0: ["title", "description", "totalBudget"],
    1: ["type"],
    2: ["platforms", "contentType", "category", "countryAvailability", "endDate"],
    3: [],
    4: []
  };
  
  const baseFields = stepFieldMap[step as keyof typeof stepFieldMap] || [];
  
  // Add type-specific required fields
  if (step === 2) {
    switch (campaignType) {
      case "retainer":
        return [...baseFields, "applicationDeadline"];
      case "payPerView":
        return [...baseFields, "ratePerThousand", "maxPayoutPerSubmission"];
      case "challenge":
        return [...baseFields, "submissionDeadline", "prizeDistributionType"];
    }
  }
  
  return baseFields;
};
