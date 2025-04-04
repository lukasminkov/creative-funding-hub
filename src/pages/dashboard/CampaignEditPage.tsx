
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Campaign, ContentType, Category, Currency, Platform, VisibilityType, CountryOption, RetainerCampaign, PayPerViewCampaign, ChallengeCampaign } from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import CampaignCreator from "@/components/CampaignCreator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function CampaignEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-edit', id],
    queryFn: async () => {
      if (!id) throw new Error("Campaign ID is required");
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error("Error fetching campaign:", error);
        throw new Error("Campaign not found");
      }
      
      if (!data) {
        throw new Error("Campaign not found");
      }
      
      // Base campaign properties shared across all types
      const baseCampaign = {
        id: data.id,
        title: data.title,
        description: data.description,
        type: data.type as "retainer" | "payPerView" | "challenge",
        contentType: data.content_type as ContentType,
        category: data.category as Category,
        platforms: data.platforms as Platform[],
        totalBudget: data.total_budget,
        currency: data.currency as Currency,
        endDate: new Date(data.end_date),
        bannerImage: data.banner_image,
        trackingLink: data.tracking_link,
        requestedTrackingLink: data.requested_tracking_link,
        guidelines: data.guidelines ? JSON.parse(data.guidelines.toString()) : { dos: [], donts: [] },
        visibility: data.visibility as VisibilityType,
        countryAvailability: data.country_availability as CountryOption,
        requirements: data.requirements || [],
        brandId: data.brand_id,
        brandName: data.brand_name
      };

      // Add optional fields with proper type handling
      const addOptionalFields = (campaign: any) => {
        if (data.brief) campaign.brief = JSON.parse(data.brief.toString());
        if (data.instruction_video) campaign.instructionVideo = data.instruction_video;
        if (data.example_videos) campaign.exampleVideos = JSON.parse(data.example_videos.toString());
        if (data.tiktok_shop_commission) campaign.tikTokShopCommission = JSON.parse(data.tiktok_shop_commission.toString());
        if (data.application_questions) campaign.applicationQuestions = JSON.parse(data.application_questions.toString());
        if (data.restricted_access) campaign.restrictedAccess = JSON.parse(data.restricted_access.toString());
        return campaign;
      };
      
      // Create the appropriate campaign type based on data.type
      let typedCampaign: Campaign;
      
      if (data.type === 'retainer') {
        const retainerCampaign: RetainerCampaign = {
          ...baseCampaign,
          type: 'retainer',
          applicationDeadline: data.application_deadline ? new Date(data.application_deadline) : new Date(),
          creatorTiers: data.creator_tiers ? JSON.parse(data.creator_tiers.toString()) : [],
          deliverables: data.deliverables ? JSON.parse(data.deliverables.toString()) : { mode: "videosPerDay" }
        };
        typedCampaign = addOptionalFields(retainerCampaign);
      } 
      else if (data.type === 'payPerView') {
        const payPerViewCampaign: PayPerViewCampaign = {
          ...baseCampaign,
          type: 'payPerView',
          ratePerThousand: data.rate_per_thousand || 0,
          maxPayoutPerSubmission: data.max_payout_per_submission || 0
        };
        typedCampaign = addOptionalFields(payPerViewCampaign);
      } 
      else {
        // Challenge campaign
        const challengeCampaign: ChallengeCampaign = {
          ...baseCampaign,
          type: 'challenge',
          submissionDeadline: data.submission_deadline ? new Date(data.submission_deadline) : new Date(),
          prizePool: data.prize_pool ? JSON.parse(data.prize_pool.toString()) : { places: [] }
        };
        typedCampaign = addOptionalFields(challengeCampaign);
      }
      
      return typedCampaign;
    }
  });

  const handleSubmitCampaign = async (updatedCampaign: Campaign) => {
    try {
      if (!id) return;
      
      // Format for database
      const formattedCampaign = {
        title: updatedCampaign.title,
        description: updatedCampaign.description,
        type: updatedCampaign.type,
        content_type: updatedCampaign.contentType,
        category: updatedCampaign.category,
        platforms: updatedCampaign.platforms,
        total_budget: updatedCampaign.totalBudget,
        currency: updatedCampaign.currency,
        end_date: new Date(updatedCampaign.endDate).toISOString(),
        banner_image: updatedCampaign.bannerImage,
        tracking_link: updatedCampaign.trackingLink,
        requested_tracking_link: updatedCampaign.requestedTrackingLink,
        guidelines: JSON.stringify(updatedCampaign.guidelines),
        visibility: updatedCampaign.visibility,
        country_availability: updatedCampaign.countryAvailability,
        requirements: updatedCampaign.requirements || [],
        
        // Type-specific fields
        application_deadline: updatedCampaign.type === 'retainer' && 'applicationDeadline' in updatedCampaign && updatedCampaign.applicationDeadline
          ? new Date(updatedCampaign.applicationDeadline).toISOString()
          : null,
        creator_tiers: updatedCampaign.type === 'retainer' && 'creatorTiers' in updatedCampaign && updatedCampaign.creatorTiers
          ? JSON.stringify(updatedCampaign.creatorTiers)
          : null,
        deliverables: updatedCampaign.type === 'retainer' && 'deliverables' in updatedCampaign && updatedCampaign.deliverables
          ? JSON.stringify(updatedCampaign.deliverables)
          : null,
        
        rate_per_thousand: updatedCampaign.type === 'payPerView' && 'ratePerThousand' in updatedCampaign
          ? updatedCampaign.ratePerThousand
          : null,
        max_payout_per_submission: updatedCampaign.type === 'payPerView' && 'maxPayoutPerSubmission' in updatedCampaign
          ? updatedCampaign.maxPayoutPerSubmission
          : null,
        
        submission_deadline: updatedCampaign.type === 'challenge' && 'submissionDeadline' in updatedCampaign && updatedCampaign.submissionDeadline
          ? new Date(updatedCampaign.submissionDeadline).toISOString()
          : null,
        prize_pool: updatedCampaign.type === 'challenge' && 'prizePool' in updatedCampaign && updatedCampaign.prizePool
          ? JSON.stringify(updatedCampaign.prizePool)
          : null,
        
        // Optional fields
        brief: updatedCampaign.brief ? JSON.stringify(updatedCampaign.brief) : null,
        instruction_video: updatedCampaign.instructionVideo || null,
        example_videos: updatedCampaign.exampleVideos ? JSON.stringify(updatedCampaign.exampleVideos) : null,
        tiktok_shop_commission: updatedCampaign.tikTokShopCommission 
          ? JSON.stringify(updatedCampaign.tikTokShopCommission) 
          : null,
        application_questions: updatedCampaign.applicationQuestions 
          ? JSON.stringify(updatedCampaign.applicationQuestions) 
          : null,
        restricted_access: updatedCampaign.restrictedAccess 
          ? JSON.stringify(updatedCampaign.restrictedAccess) 
          : null,
        brand_id: updatedCampaign.brandId || null,
        brand_name: updatedCampaign.brandName || null
      };
      
      // Update in Supabase
      const { error } = await supabase
        .from('campaigns')
        .update(formattedCampaign)
        .eq('id', id);
      
      if (error) {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign: " + error.message);
        return;
      }
      
      toast.success("Campaign updated successfully!");
      navigate(`/dashboard/campaigns/${id}`);
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign: " + (error instanceof Error ? error.message : "Unknown error"));
    }
  };

  const handleCancelEdit = () => {
    navigate(`/dashboard/campaigns/${id}`);
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
        </div>
        <div className="h-[500px] w-full bg-muted rounded"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're trying to edit doesn't exist or was deleted.</p>
        <Button onClick={() => navigate("/dashboard/campaigns")}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate(`/dashboard/campaigns/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to={`/dashboard/campaigns/${id}`} className="hover:underline">{campaign.title}</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">Edit</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Campaign</h1>
        <p className="text-muted-foreground">Update your campaign details and settings</p>
      </div>

      <CampaignCreator 
        onSubmit={handleSubmitCampaign}
        onCancel={handleCancelEdit}
        campaign={campaign}
        isEditing={true}
      />
    </div>
  );
}
