
import { 
  Campaign, 
  ContentType, 
  Category, 
  Platform, 
  Currency, 
  CountryOption, 
  VisibilityType,
  StatusType,
  RetainerCampaign,
  PayPerViewCampaign,
  ChallengeCampaign,
  CONTENT_TYPES,
  CATEGORIES,
  PLATFORMS,
  CURRENCIES,
  COUNTRY_OPTIONS,
  VISIBILITY_TYPES,
  STATUS_OPTIONS
} from "@/lib/campaign-types";
import { Json } from "@/integrations/supabase/types";

// Type guard functions to validate enum values
export const validateContentType = (value: string): ContentType => {
  return CONTENT_TYPES.includes(value as ContentType) 
    ? (value as ContentType) 
    : "UGC"; // Default fallback
};

export const validateCategory = (value: string): Category => {
  return CATEGORIES.includes(value as Category) 
    ? (value as Category) 
    : "Tech"; // Default fallback
};

export const validatePlatforms = (values: string[]): Platform[] => {
  return values.filter(v => PLATFORMS.includes(v as Platform)) as Platform[];
};

export const validateCurrency = (value: string): Currency => {
  return CURRENCIES.includes(value as Currency) 
    ? (value as Currency) 
    : "USD"; // Default fallback
};

export const validateCountryOption = (value: string): CountryOption => {
  return COUNTRY_OPTIONS.includes(value as CountryOption) 
    ? (value as CountryOption) 
    : "worldwide"; // Default fallback
};

export const validateVisibilityType = (value: string): VisibilityType => {
  return VISIBILITY_TYPES.includes(value as VisibilityType) 
    ? (value as VisibilityType) 
    : "public"; // Default fallback
};

export const validateStatusType = (value: string): StatusType => {
  return STATUS_OPTIONS.includes(value as StatusType)
    ? (value as StatusType)
    : "active"; // Default fallback
};

// Helper function to safely parse JSON
export const safeParseJson = (value: Json | null | string): any => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return null;
    }
  }
  return value; // If it's already an object
};

// Convert database data to a Campaign object
export const convertDatabaseCampaign = (data: any): Campaign => {
  // Base campaign properties shared across all types
  const baseCampaign = {
    id: data.id,
    title: data.title,
    description: data.description,
    type: data.type as "retainer" | "payPerView" | "challenge",
    contentType: validateContentType(data.content_type),
    category: validateCategory(data.category),
    platforms: validatePlatforms(data.platforms),
    requirements: data.requirements || [],
    currency: validateCurrency(data.currency),
    totalBudget: Number(data.total_budget),
    endDate: new Date(data.end_date),
    countryAvailability: validateCountryOption(data.country_availability),
    visibility: validateVisibilityType(data.visibility),
    bannerImage: data.banner_image,
    instructionVideo: data.instruction_video,
    brandId: data.brand_id,
    brandName: data.brand_name,
    trackingLink: data.tracking_link,
    requestedTrackingLink: data.requested_tracking_link,
    guidelines: safeParseJson(data.guidelines) || { dos: [], donts: [] },
    status: data.status ? validateStatusType(data.status) : "active",
    createdAt: data.created_at,
  };
  
  // Create the appropriate campaign type based on data.type
  let typedCampaign: Campaign;
  
  if (data.type === 'retainer') {
    const retainerCampaign: RetainerCampaign = {
      ...baseCampaign,
      type: 'retainer',
      applicationDeadline: data.application_deadline ? new Date(data.application_deadline) : new Date(),
      creatorTiers: safeParseJson(data.creator_tiers) || [],
      deliverables: safeParseJson(data.deliverables) || { mode: "videosPerDay" }
    };
    
    // Add optional fields
    if (data.application_questions) {
      retainerCampaign.applicationQuestions = safeParseJson(data.application_questions);
    }
    
    typedCampaign = retainerCampaign;
  } 
  else if (data.type === 'payPerView') {
    const payPerViewCampaign: PayPerViewCampaign = {
      ...baseCampaign,
      type: 'payPerView',
      ratePerThousand: data.rate_per_thousand ? Number(data.rate_per_thousand) : 0,
      maxPayoutPerSubmission: data.max_payout_per_submission ? Number(data.max_payout_per_submission) : 0,
      contentRequirements: data.content_requirements,
      viewValidationPeriod: data.view_validation_period ? Number(data.view_validation_period) : undefined
    };
    
    typedCampaign = payPerViewCampaign;
  } 
  else {
    // Challenge campaign
    const challengeCampaign: ChallengeCampaign = {
      ...baseCampaign,
      type: 'challenge',
      submissionDeadline: data.submission_deadline ? new Date(data.submission_deadline) : new Date(),
      prizePool: safeParseJson(data.prize_pool) || { places: [] },
      prizeAmount: data.prize_amount ? Number(data.prize_amount) : undefined,
      winnersCount: data.winners_count ? Number(data.winners_count) : undefined
    };
    
    typedCampaign = challengeCampaign;
  }
  
  // Add common optional fields
  if (data.example_videos) {
    typedCampaign.exampleVideos = safeParseJson(data.example_videos);
  }
  
  if (data.restricted_access) {
    typedCampaign.restrictedAccess = safeParseJson(data.restricted_access);
  }
  
  if (data.tiktok_shop_commission) {
    typedCampaign.tikTokShopCommission = safeParseJson(data.tiktok_shop_commission);
  }
  
  if (data.brief) {
    typedCampaign.brief = safeParseJson(data.brief);
  }
  
  return typedCampaign;
};

// Convert Campaign object to database format
export const convertCampaignToDatabase = (campaign: Campaign) => {
  // Base properties for all campaign types
  const databaseCampaign = {
    title: campaign.title,
    description: campaign.description,
    type: campaign.type,
    content_type: campaign.contentType,
    category: campaign.category,
    platforms: campaign.platforms,
    total_budget: campaign.totalBudget,
    currency: campaign.currency,
    end_date: new Date(campaign.endDate).toISOString(),
    banner_image: campaign.bannerImage,
    tracking_link: campaign.trackingLink,
    requested_tracking_link: campaign.requestedTrackingLink,
    guidelines: JSON.stringify(campaign.guidelines),
    visibility: campaign.visibility,
    country_availability: campaign.countryAvailability,
    requirements: campaign.requirements || [],
    brand_id: campaign.brandId,
    brand_name: campaign.brandName,
    instruction_video: campaign.instructionVideo,
    status: campaign.status,
    created_at: campaign.createdAt ? new Date(campaign.createdAt).toISOString() : new Date().toISOString(),
    
    // Optional fields common to all campaign types
    brief: campaign.brief ? JSON.stringify(campaign.brief) : null,
    example_videos: campaign.exampleVideos ? JSON.stringify(campaign.exampleVideos) : null,
    tiktok_shop_commission: campaign.tikTokShopCommission 
      ? JSON.stringify(campaign.tikTokShopCommission) 
      : null,
    restricted_access: campaign.restrictedAccess 
      ? JSON.stringify(campaign.restrictedAccess) 
      : null,
    
    // Campaign-specific fields (all nullable)
    application_deadline: null,
    creator_tiers: null,
    deliverables: null,
    rate_per_thousand: null,
    max_payout_per_submission: null,
    content_requirements: null,
    view_validation_period: null,
    submission_deadline: null,
    prize_pool: null,
    prize_amount: null,
    winners_count: null,
    application_questions: null
  };
  
  // Add campaign type-specific properties
  if (campaign.type === 'retainer') {
    const retainerCampaign = campaign as RetainerCampaign;
    databaseCampaign.application_deadline = retainerCampaign.applicationDeadline 
      ? new Date(retainerCampaign.applicationDeadline).toISOString() 
      : null;
    databaseCampaign.creator_tiers = retainerCampaign.creatorTiers 
      ? JSON.stringify(retainerCampaign.creatorTiers) 
      : null;
    databaseCampaign.deliverables = retainerCampaign.deliverables 
      ? JSON.stringify(retainerCampaign.deliverables) 
      : null;
    databaseCampaign.application_questions = retainerCampaign.applicationQuestions 
      ? JSON.stringify(retainerCampaign.applicationQuestions) 
      : null;
  } 
  else if (campaign.type === 'payPerView') {
    const payPerViewCampaign = campaign as PayPerViewCampaign;
    databaseCampaign.rate_per_thousand = payPerViewCampaign.ratePerThousand || null;
    databaseCampaign.max_payout_per_submission = payPerViewCampaign.maxPayoutPerSubmission || null;
    databaseCampaign.content_requirements = payPerViewCampaign.contentRequirements || null;
    databaseCampaign.view_validation_period = payPerViewCampaign.viewValidationPeriod || null;
  } 
  else if (campaign.type === 'challenge') {
    const challengeCampaign = campaign as ChallengeCampaign;
    databaseCampaign.submission_deadline = challengeCampaign.submissionDeadline 
      ? new Date(challengeCampaign.submissionDeadline).toISOString() 
      : null;
    databaseCampaign.prize_pool = challengeCampaign.prizePool 
      ? JSON.stringify(challengeCampaign.prizePool) 
      : null;
    databaseCampaign.prize_amount = challengeCampaign.prizeAmount || null;
    databaseCampaign.winners_count = challengeCampaign.winnersCount || null;
  }
  
  return databaseCampaign;
};
