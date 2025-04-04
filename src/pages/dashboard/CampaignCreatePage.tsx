
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CampaignCreatePage() {
  const navigate = useNavigate();

  const handleSubmitCampaign = async (campaign: Campaign) => {
    try {
      // Format dates properly for database
      const formattedCampaign = {
        ...campaign,
        end_date: campaign.endDate.toISOString(),
        application_deadline: campaign.type === 'retainer' && 'applicationDeadline' in campaign 
          ? campaign.applicationDeadline.toISOString() 
          : null,
        submission_deadline: campaign.type === 'challenge' && 'submissionDeadline' in campaign 
          ? campaign.submissionDeadline.toISOString() 
          : null,
        guidelines: JSON.stringify(campaign.guidelines),
        requirements: campaign.requirements || [],
        example_videos: campaign.exampleVideos 
          ? JSON.stringify(campaign.exampleVideos) 
          : null,
        restricted_access: campaign.restrictedAccess 
          ? JSON.stringify(campaign.restrictedAccess) 
          : null,
        application_questions: campaign.applicationQuestions 
          ? JSON.stringify(campaign.applicationQuestions) 
          : null,
        creator_tiers: campaign.type === 'retainer' && 'creatorTiers' in campaign 
          ? JSON.stringify(campaign.creatorTiers) 
          : null,
        deliverables: campaign.type === 'retainer' && 'deliverables' in campaign 
          ? JSON.stringify(campaign.deliverables) 
          : null,
        prize_pool: campaign.type === 'challenge' && 'prizePool' in campaign 
          ? JSON.stringify(campaign.prizePool) 
          : null,
        tiktok_shop_commission: campaign.tikTokShopCommission 
          ? JSON.stringify(campaign.tikTokShopCommission) 
          : null,
        brief: campaign.brief 
          ? JSON.stringify(campaign.brief) 
          : null,
        
        // Snake case fields for database
        content_type: campaign.contentType,
        total_budget: campaign.totalBudget,
        country_availability: campaign.countryAvailability,
        tracking_link: campaign.trackingLink,
        requested_tracking_link: campaign.requestedTrackingLink,
        banner_image: campaign.bannerImage,
        instruction_video: campaign.instructionVideo,
        brand_id: campaign.brandId,
        brand_name: campaign.brandName,
        
        // Pay per view specific fields
        rate_per_thousand: campaign.type === 'payPerView' && 'ratePerThousand' in campaign 
          ? campaign.ratePerThousand 
          : null,
        max_payout_per_submission: campaign.type === 'payPerView' && 'maxPayoutPerSubmission' in campaign 
          ? campaign.maxPayoutPerSubmission 
          : null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('campaigns')
        .insert([formattedCampaign])
        .select();
      
      if (error) {
        console.error("Error creating campaign:", error);
        toast.error("Failed to create campaign: " + error.message);
        return;
      }
      
      toast.success("Campaign created successfully!");
      if (data && data.length > 0) {
        navigate(`/dashboard/campaigns/${data[0].id}`);
      } else {
        // Fallback - go to campaigns list
        navigate("/dashboard/campaigns");
      }
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleCancelCreation = () => {
    navigate("/dashboard/campaigns");
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate("/dashboard/campaigns")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Create Campaign</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">Set up a new campaign to work with creators</p>
      </div>

      <CampaignCreator 
        onSubmit={handleSubmitCampaign}
        onCancel={handleCancelCreation}
      />
    </div>
  );
}
