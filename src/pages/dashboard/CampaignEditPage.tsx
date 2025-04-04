import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import CampaignCreator from "@/components/CampaignCreator";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign, convertCampaignToDatabase } from "@/lib/campaign-utils";

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
      
      return convertDatabaseCampaign(data);
    }
  });

  const handleSubmitCampaign = async (updatedCampaign: Campaign) => {
    try {
      if (!id) return;
      
      // Format for database using the utility
      const formattedCampaign = convertCampaignToDatabase(updatedCampaign);
      
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
