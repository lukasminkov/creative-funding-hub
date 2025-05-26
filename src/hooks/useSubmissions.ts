
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/lib/campaign-types";

export const useSubmissions = (campaignId?: string) => {
  return useQuery({
    queryKey: ["submissions", campaignId],
    queryFn: async () => {
      let query = supabase
        .from("submissions")
        .select("*")
        .order("submitted_date", { ascending: false });

      if (campaignId) {
        query = query.eq("campaign_id", campaignId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching submissions:", error);
        throw error;
      }

      // Transform the database data to match our Submission type
      return data.map((submission): Submission => ({
        id: submission.id,
        creator_id: submission.creator_id,
        creator_name: submission.creator_name,
        creator_avatar: submission.creator_avatar,
        campaign_id: submission.campaign_id,
        campaign_title: submission.campaign_title,
        campaign_type: "retainer", // We'll need to join with campaigns table or store this
        submitted_date: new Date(submission.submitted_date),
        payment_amount: Number(submission.payment_amount),
        views: submission.views,
        status: submission.status as "pending" | "approved" | "denied",
        platform: submission.platform,
        platformUsername: `@${submission.creator_name.toLowerCase().replace(" ", "")}`,
        content: submission.content,
      }));
    },
  });
};
