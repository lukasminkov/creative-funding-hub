
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";

export default function CampaignCreatePage() {
  const navigate = useNavigate();

  const handleSubmitCampaign = (campaign: Campaign) => {
    // Convert File objects to URLs for storage and display
    const preparedCampaign = {
      ...campaign,
      id: crypto.randomUUID(),
    };
    
    // Create an object URL if we have a video file
    if (campaign.instructionVideoFile) {
      preparedCampaign.instructionVideo = URL.createObjectURL(campaign.instructionVideoFile);
    }
    
    // Store in localStorage
    const storedCampaigns = localStorage.getItem("campaigns") || "[]";
    const campaigns = JSON.parse(storedCampaigns);
    campaigns.push(preparedCampaign);
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
    
    toast.success("Campaign created successfully!");
    navigate(`/dashboard/campaigns/${preparedCampaign.id}`);
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
