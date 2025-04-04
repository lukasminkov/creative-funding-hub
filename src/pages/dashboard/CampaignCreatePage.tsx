
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertCampaignToDatabase } from "@/lib/campaign-utils";

export default function CampaignCreatePage() {
  const navigate = useNavigate();

  const handleSubmitCampaign = async (campaign: Campaign) => {
    try {
      // Format campaign for database using utility
      const formattedCampaign = convertCampaignToDatabase(campaign);
      
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
