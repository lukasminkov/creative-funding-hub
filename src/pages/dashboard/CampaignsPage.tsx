
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/campaign-types";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";

export default function CampaignsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { data: campaigns, isLoading, error, refetch } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*');
      
      if (error) {
        console.error("Error fetching campaigns:", error);
        throw new Error("Failed to fetch campaigns");
      }
      
      return data.map(convertDatabaseCampaign);
    }
  });

  if (isLoading) {
    return <div className="container py-8">Loading campaigns...</div>;
  }

  if (error) {
    return <div className="container py-8">Error: {error.message}</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your creator campaigns</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Analytics Dashboard - Restored */}
      {campaigns && campaigns.length > 0 && (
        <CampaignAnalytics campaigns={campaigns} />
      )}

      <div className="grid gap-6">
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-card border border-border rounded-lg overflow-hidden">
                {campaign.bannerImage ? (
                  <div className="h-40 relative">
                    <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
                      <p className="text-sm text-white/80">
                        {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 border-b border-border/60">
                    <h3 className="text-lg font-medium">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                    </p>
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-sm">Budget: <span className="font-medium">{formatCurrency(campaign.totalBudget, campaign.currency)}</span></div>
                  </div>
                  
                  <Link to={`/dashboard/campaigns/${campaign.id}`}>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No campaigns found</h2>
            <p className="text-muted-foreground mb-6">
              Create your first campaign to get started
            </p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              Create Campaign
            </Button>
          </div>
        )}
      </div>
      
      {/* Campaign Creation Dialog */}
      <CampaignFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCampaignUpdated={() => {
          // Refresh campaigns data after creation
          if (refetch) refetch();
        }}
      />
    </div>
  );
}
