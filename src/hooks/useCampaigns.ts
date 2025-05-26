
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Campaign, ContentType, Category, Platform, Currency, VisibilityType, CountryOption, Guidelines, CreatorTier, ApplicationQuestion, Brief, ExampleVideo, RestrictedAccess } from "@/lib/campaign-types";

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
      return data.map((campaign): Campaign => {
        // Helper function to safely parse JSON fields
        const safeJsonParse = (jsonField: any, fallback: any = null) => {
          if (!jsonField) return fallback;
          if (typeof jsonField === 'string') {
            try {
              return JSON.parse(jsonField);
            } catch {
              return fallback;
            }
          }
          return jsonField;
        };

        // Map database content_type to our ContentType enum
        const mapContentType = (dbContentType: string): ContentType => {
          switch (dbContentType.toLowerCase()) {
            case 'video':
            case 'ugc':
              return 'UGC';
            case 'image':
            case 'faceless':
              return 'Faceless';
            case 'audio':
            case 'clipping':
              return 'Clipping';
            default:
              return 'UGC';
          }
        };

        // Map database platforms to our Platform enum
        const mapPlatforms = (dbPlatforms: string[]): Platform[] => {
          return dbPlatforms.map(platform => {
            switch (platform.toLowerCase()) {
              case 'instagram':
                return 'Instagram Reels';
              case 'tiktok':
                return 'TikTok';
              case 'youtube':
                return 'YouTube Shorts';
              case 'twitter':
                return 'Twitter';
              case 'twitch':
                return 'TikTok'; // Fallback since Twitch isn't in our enum
              default:
                return 'TikTok';
            }
          }) as Platform[];
        };

        // Map database visibility to our VisibilityType enum
        const mapVisibility = (dbVisibility: string): VisibilityType => {
          switch (dbVisibility) {
            case 'public':
              return 'public';
            case 'private':
            case 'applicationOnly':
              return 'applicationOnly';
            case 'restricted':
              return 'restricted';
            default:
              return 'public';
          }
        };

        // Map database country to our CountryOption enum
        const mapCountryAvailability = (dbCountry: string): CountryOption => {
          switch (dbCountry.toLowerCase()) {
            case 'global':
            case 'worldwide':
              return 'worldwide';
            case 'usa':
            case 'united states':
              return 'usa';
            case 'mexico':
              return 'mexico';
            case 'canada':
              return 'canada';
            case 'dach':
              return 'dach';
            default:
              return 'worldwide';
          }
        };

        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description || "",
          type: campaign.type as "retainer" | "payPerView" | "challenge",
          contentType: mapContentType(campaign.content_type),
          category: campaign.category as Category,
          platforms: mapPlatforms(campaign.platforms || []),
          totalBudget: Number(campaign.total_budget),
          currency: campaign.currency as Currency,
          endDate: new Date(campaign.end_date),
          visibility: mapVisibility(campaign.visibility),
          countryAvailability: mapCountryAvailability(campaign.country_availability),
          brandName: campaign.brand_name,
          brandId: campaign.brand_id,
          bannerImage: campaign.banner_image,
          trackingLink: campaign.tracking_link,
          guidelines: safeJsonParse(campaign.guidelines, { dos: [], donts: [] }) as Guidelines,
          requirements: campaign.requirements || [],
          applicationDeadline: campaign.application_deadline ? new Date(campaign.application_deadline) : undefined,
          submissionDeadline: campaign.submission_deadline ? new Date(campaign.submission_deadline) : undefined,
          creatorTiers: safeJsonParse(campaign.creator_tiers, []) as CreatorTier[],
          deliverables: safeJsonParse(campaign.deliverables),
          ratePerThousand: campaign.rate_per_thousand ? Number(campaign.rate_per_thousand) : undefined,
          maxPayoutPerSubmission: campaign.max_payout_per_submission ? Number(campaign.max_payout_per_submission) : undefined,
          prizePool: safeJsonParse(campaign.prize_pool),
          applicationQuestions: safeJsonParse(campaign.application_questions, []) as ApplicationQuestion[],
          requestedTrackingLink: campaign.requested_tracking_link || false,
          tiktokShopCommission: safeJsonParse(campaign.tiktok_shop_commission),
          instructionVideo: campaign.instruction_video,
          brief: safeJsonParse(campaign.brief) as Brief,
          exampleVideos: safeJsonParse(campaign.example_videos, []) as ExampleVideo[],
          restrictedAccess: safeJsonParse(campaign.restricted_access) as RestrictedAccess,
        };
      });
    },
  });
};
