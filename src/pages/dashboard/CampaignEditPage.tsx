
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import CampaignCreator from "@/components/CampaignCreator";
import { toast } from "sonner";

export default function CampaignEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign-edit', id],
    queryFn: async () => {
      // In a real app, this would be an API call
      const storedCampaigns = localStorage.getItem("campaigns");
      const campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];
      const campaign = campaigns.find((c: Campaign) => c.id === id);
      
      if (!campaign) {
        throw new Error("Campaign not found");
      }
      
      return campaign;
    }
  });

  const handleSubmitCampaign = (updatedCampaign: Campaign) => {
    // In a real app, this would be an API call
    const storedCampaigns = localStorage.getItem("campaigns") || "[]";
    const campaigns = JSON.parse(storedCampaigns);
    const index = campaigns.findIndex((c: Campaign) => c.id === id);
    
    if (index !== -1) {
      // Preserve the original ID
      updatedCampaign.id = id;
      
      // Save any File objects to URLs
      if (updatedCampaign.instructionVideoFile) {
        updatedCampaign.instructionVideo = URL.createObjectURL(updatedCampaign.instructionVideoFile);
      }
      
      campaigns[index] = updatedCampaign;
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
      
      toast.success("Campaign updated successfully!");
      navigate(`/dashboard/campaigns/${id}`);
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
        initialValues={campaign}
        isEditing={true}
      />
    </div>
  );
}
