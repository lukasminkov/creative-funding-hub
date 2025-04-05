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
import { Progress } from "@/components/ui/progress";

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

  // Helper function to calculate progress and status text
  const getCampaignProgress = (campaign: Campaign) => {
    let progress = 0;
    let progressText = "";
    let status = "Active";

    if (campaign.type === "payPerView") {
      // Simulate 30% of budget spent for demo
      progress = 30;
      progressText = `$${(campaign.totalBudget * 0.3).toFixed(2)}/$${campaign.totalBudget} spent`;
    } else if (campaign.type === "retainer") {
      // Simulate 40% of deliverables submitted
      const totalVideos = campaign.deliverables?.totalVideos || 10;
      progress = 40;
      progressText = `${Math.round(totalVideos * 0.4)}/${totalVideos} deliverables`;
      status = "Application Phase";
    } else {
      // Challenge campaign
      const now = new Date();
      const deadline = new Date(campaign.submissionDeadline);
      
      // Fallback if submission_deadline is missing
      if (!deadline) {
        return { progress: 50, progressText: "50% complete", status: "In Progress" };
      }
      
      const total = deadline.getTime() - new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
      const elapsed = now.getTime() - (new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime());
      progress = Math.min(100, Math.floor((elapsed / total) * 100));
      progressText = `${Math.round(progress)}% complete`;
    }

    return { progress, progressText, status };
  };

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

      {/* Analytics Dashboard */}
      {campaigns && campaigns.length > 0 && (
        <CampaignAnalytics campaigns={campaigns} />
      )}

      <div className="grid gap-6">
        {campaigns && campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              // Get campaign progress information
              const { progress, progressText, status } = getCampaignProgress(campaign);
              
              // Calculate simulated metrics for the demo
              const views = Math.floor(Math.random() * 50000) + 10000; // Random views between 10k and 60k
              const cpm = Number(((campaign.totalBudget * 0.3) / (views / 1000)).toFixed(2));
              
              return (
                <div key={campaign.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
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
                    {/* Progress bar and status */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{progressText}</span>
                        <span className="font-medium">{status}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    
                    {/* Platforms */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {campaign.platforms && campaign.platforms.slice(0, 3).map(platform => (
                        <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
                          {platform.split(' ')[0]}
                        </span>
                      ))}
                      {campaign.platforms && campaign.platforms.length > 3 && (
                        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
                          +{campaign.platforms.length - 3}
                        </span>
                      )}
                    </div>
                    
                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Budget:</p>
                        <p className="font-medium">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Views:</p>
                        <p className="font-medium">{views.toLocaleString()}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">CPM:</p>
                        <p className="font-medium">{formatCurrency(cpm, campaign.currency)}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Creators:</p>
                        <p className="font-medium">{Math.floor(Math.random() * 5) + 1}</p>
                      </div>
                    </div>
                    
                    <Link to={`/dashboard/campaigns/${campaign.id}`}>
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
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
