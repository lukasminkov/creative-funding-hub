
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/lib/campaign-types";

export const useSubmissions = (campaignId?: string) => {
  return useQuery({
    queryKey: ["submissions", campaignId],
    queryFn: async () => {
      let submissionsQuery = supabase
        .from("submissions")
        .select("*")
        .order("submitted_date", { ascending: false });

      if (campaignId) {
        submissionsQuery = submissionsQuery.eq("campaign_id", campaignId);
      }

      const [submissionsResult, campaignsResult] = await Promise.all([
        submissionsQuery,
        supabase.from("campaigns").select("id, type")
      ]);

      if (submissionsResult.error) {
        console.error("Error fetching submissions:", submissionsResult.error);
        throw submissionsResult.error;
      }

      if (campaignsResult.error) {
        console.error("Error fetching campaigns for type mapping:", campaignsResult.error);
        throw campaignsResult.error;
      }

      // Create a map of campaign IDs to their types
      const campaignTypeMap = new Map(
        campaignsResult.data?.map(campaign => [campaign.id, campaign.type]) || []
      );

      // Transform the database data to match our Submission type
      return submissionsResult.data.map((submission): Submission => ({
        id: submission.id,
        creator_id: submission.creator_id,
        creator_name: submission.creator_name,
        creator_avatar: submission.creator_avatar,
        campaign_id: submission.campaign_id,
        campaign_title: submission.campaign_title,
        campaign_type: campaignTypeMap.get(submission.campaign_id) as "retainer" | "payPerView" | "challenge" || "payPerView",
        submitted_date: new Date(submission.submitted_date),
        payment_amount: Number(submission.payment_amount),
        views: submission.views,
        status: submission.status as "pending" | "approved" | "denied",
        platform: submission.platform,
        platformUsername: `@${submission.creator_name.toLowerCase().replace(/\s+/g, "")}`,
        content: submission.content,
      }));
    },
  });
};
