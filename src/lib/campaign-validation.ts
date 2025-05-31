
import { z } from "zod";
import { CONTENT_TYPES, CATEGORIES, PLATFORMS } from "./campaign-types";

// Base campaign schema with common fields
const baseCampaignSchema = z.object({
  title: z.string().min(1, "Campaign title is required").min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Campaign description is required").min(10, "Description must be at least 10 characters"),
  totalBudget: z.number().positive("Budget must be positive").min(1, "Budget must be at least $1"),
  currency: z.string().default("USD"),
  contentType: z.enum(CONTENT_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid content type" })
  }),
  category: z.enum(CATEGORIES as [string, ...string[]], {
    errorMap: () => ({ message: "Please select a valid category" })
  }),
  countryAvailability: z.enum(["worldwide", "usa", "mexico", "canada", "dach"], {
    errorMap: () => ({ message: "Please select a valid region" })
  }),
  platforms: z.array(z.enum(PLATFORMS as [string, ...string[]])).min(1, "At least one platform is required"),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "Please select a valid end date"
  }).refine((date) => date > new Date(), {
    message: "End date must be in the future"
  }),
  requirements: z.array(z.string()).optional(),
  visibility: z.enum(["public", "private"]).default("public"),
  guidelines: z.object({
    dos: z.array(z.string()),
    donts: z.array(z.string())
  }).optional(),
  requestedTrackingLink: z.boolean().default(false),
  trackingLink: z.string().optional(),
  bannerImage: z.string().optional(),
  brief: z.any().optional(),
  instructionVideo: z.string().optional(),
  instructionVideoFile: z.any().optional(),
  exampleVideos: z.array(z.any()).optional()
});

// Retainer campaign schema
export const retainerCampaignSchema = baseCampaignSchema.extend({
  type: z.literal("retainer"),
  platforms: z.array(z.enum(PLATFORMS as [string, ...string[]])).length(1, "Retainer campaigns require exactly one platform"),
  applicationDeadline: z.date({
    required_error: "Application deadline is required",
    invalid_type_error: "Please select a valid application deadline"
  }).refine((date) => date > new Date(), {
    message: "Application deadline must be in the future"
  })
}).refine((data) => {
  return data.applicationDeadline < data.endDate;
}, {
  message: "Application deadline must be before campaign end date",
  path: ["applicationDeadline"]
});

// Pay Per View campaign schema
export const payPerViewCampaignSchema = baseCampaignSchema.extend({
  type: z.literal("payPerView"),
  ratePerThousand: z.number().positive("Rate per thousand must be positive").min(0.01, "Rate must be at least $0.01"),
  maxPayoutPerSubmission: z.number().positive("Max payout must be positive").min(1, "Max payout must be at least $1"),
  viewValidationPeriod: z.number().int().positive().default(10)
}).refine((data) => {
  const estimatedMaxViews = (data.maxPayoutPerSubmission / data.ratePerThousand) * 1000;
  return estimatedMaxViews > 0;
}, {
  message: "Max payout and rate per thousand must create a valid payment structure",
  path: ["maxPayoutPerSubmission"]
});

// Challenge campaign schema
export const challengeCampaignSchema = baseCampaignSchema.extend({
  type: z.literal("challenge"),
  submissionDeadline: z.date({
    required_error: "Submission deadline is required",
    invalid_type_error: "Please select a valid submission deadline"
  }).refine((date) => date > new Date(), {
    message: "Submission deadline must be in the future"
  }),
  prizeDistributionType: z.enum(["equal", "custom"], {
    errorMap: () => ({ message: "Please select a prize distribution type" })
  }),
  // Equal distribution fields
  prizeAmount: z.number().positive().optional(),
  winnersCount: z.number().int().positive().optional(),
  // Custom distribution fields
  prizePool: z.object({
    places: z.array(z.object({
      position: z.number().int().positive(),
      prize: z.number().positive()
    })).min(1, "At least one prize position is required")
  }).optional()
}).refine((data) => {
  return data.submissionDeadline < data.endDate;
}, {
  message: "Submission deadline must be before campaign end date",
  path: ["submissionDeadline"]
}).refine((data) => {
  if (data.prizeDistributionType === "equal") {
    return data.prizeAmount && data.winnersCount;
  }
  if (data.prizeDistributionType === "custom") {
    return data.prizePool && data.prizePool.places.length > 0;
  }
  return false;
}, {
  message: "Prize distribution must be properly configured",
  path: ["prizeDistributionType"]
}).refine((data) => {
  // Validate that total prize amount doesn't exceed budget
  if (data.prizeDistributionType === "equal" && data.prizeAmount && data.winnersCount) {
    const totalPrizeAmount = data.prizeAmount * data.winnersCount;
    return totalPrizeAmount <= data.totalBudget;
  }
  if (data.prizeDistributionType === "custom" && data.prizePool) {
    const totalPrizeAmount = data.prizePool.places.reduce((sum, place) => sum + place.prize, 0);
    return totalPrizeAmount <= data.totalBudget;
  }
  return true;
}, {
  message: "Total prize amount cannot exceed campaign budget",
  path: ["totalBudget"]
});

// Union type for all campaign schemas
export const campaignSchema = z.discriminatedUnion("type", [
  retainerCampaignSchema,
  payPerViewCampaignSchema,
  challengeCampaignSchema
]);

export type CampaignFormErrors = Record<string, string>;
