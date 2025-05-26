
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign } from "@/lib/campaign-types";

export const useCampaigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
      }

      // Transform the database data to match our Campaign type
      return data.map((campaign): Campaign => ({
        id: campaign.id,
        title: campaign.title,
        description: campaign.description || "",
        type: campaign.type as "retainer" | "payPerView" | "challenge",
        contentType: campaign.content_type as "video" | "image" | "audio",
        category: campaign.category,
        platforms: campaign.platforms,
        totalBudget: Number(campaign.total_budget),
        currency: campaign.currency as "USD" | "EUR" | "GBP",
        endDate: new Date(campaign.end_date),
        visibility: campaign.visibility as "public" | "private",
        countryAvailability: campaign.country_availability,
        brandName: campaign.brand_name,
        brandId: campaign.brand_id,
        bannerImage: campaign.banner_image,
        trackingLink: campaign.tracking_link,
        guidelines: campaign.guidelines,
        requirements: campaign.requirements,
        applicationDeadline: campaign.application_deadline ? new Date(campaign.application_deadline) : undefined,
        submissionDeadline: campaign.submission_deadline ? new Date(campaign.submission_deadline) : undefined,
        creatorTiers: campaign.creator_tiers,
        deliverables: campaign.deliverables,
        ratePerThousand: campaign.rate_per_thousand ? Number(campaign.rate_per_thousand) : undefined,
        maxPayoutPerSubmission: campaign.max_payout_per_submission ? Number(campaign.max_payout_per_submission) : undefined,
        prizePool: campaign.prize_pool,
        applicationQuestions: campaign.application_questions,
        requestedTrackingLink: campaign.requested_tracking_link || false,
        tiktokShopCommission: campaign.tiktok_shop_commission,
        instructionVideo: campaign.instruction_video,
        brief: campaign.brief,
        exampleVideos: campaign.example_videos,
        restrictedAccess: campaign.restricted_access,
      }));
    },
  });
};
