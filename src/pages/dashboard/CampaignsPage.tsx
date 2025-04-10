
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Submission, SubmissionStatusType } from "@/lib/campaign-types";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/campaign-types";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CampaignSubmissionsReview from "@/components/CampaignSubmissionsReview";
import { toast } from "sonner";

// Generate sample submission data with different dates
const generateSampleSubmissions = () => {
  const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts"];
  const statuses: SubmissionStatusType[] = ["pending", "approved", "rejected", "paid"];
  const creators = [
    { name: "Sarah Johnson", id: "1001", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { name: "Mike Peters", id: "1002", avatar: "https://i.pravatar.cc/150?u=mike" },
    { name: "Jessica Williams", id: "1003", avatar: "https://i.pravatar.cc/150?u=jessica" },
    { name: "David Chen", id: "1004", avatar: "https://i.pravatar.cc/150?u=david" },
    { name: "Emma Lopez", id: "1005", avatar: "https://i.pravatar.cc/150?u=emma" },
    { name: "Alex Wong", id: "1006", avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Taylor Reed", id: "1007", avatar: "https://i.pravatar.cc/150?u=taylor" },
    { name: "Jordan Martinez", id: "1008", avatar: "https://i.pravatar.cc/150?u=jordan" },
    { name: "Sophia Kim", id: "1009", avatar: "https://i.pravatar.cc/150?u=sophia" },
    { name: "Lucas Brown", id: "1010", avatar: "https://i.pravatar.cc/150?u=lucas" }
  ];
  
  const campaigns = [
    { id: "campaign-1", title: "Summer Fashion Collection" },
    { id: "campaign-2", title: "Tech Gadget Review" },
    { id: "campaign-3", title: "Fitness Challenge" },
    { id: "campaign-4", title: "Cooking Tutorial" },
    { id: "campaign-5", title: "Beauty Product Showcase" }
  ];
  
  // Generate date function
  const generateDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    // Add random hours, minutes, and seconds
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));
    return date;
  };
  
  const submissions: Submission[] = [];
  
  // Generate 20 submissions for variety
  for (let i = 0; i < 20; i++) {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    // Weighted status - more pending than others
    const status = i < 10 ? "pending" as SubmissionStatusType : statuses[Math.floor(Math.random() * statuses.length)];
    // Generate a date between now and 14 days ago
    const daysAgo = Math.random() * 14;
    
    submissions.push({
      id: `${300 + i}`,
      creator_id: creator.id,
      creator_name: creator.name,
      creator_avatar: creator.avatar,
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      submitted_date: generateDate(daysAgo),
      platform,
      content: `https://example.com/${platform.toLowerCase().replace(' ', '')}/video${i + 100}`,
      payment_amount: Math.floor(Math.random() * 200) + 100,
      views: Math.floor(Math.random() * 50000) + 1000,
      status
    });
  }
  
  return submissions;
};

// Generate sample submissions
const mockSubmissions: Submission[] = generateSampleSubmissions();

export default function CampaignsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  
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

  const handleApproveSubmission = async (submission: Submission) => {
    try {
      toast.success(`Approved submission from ${submission.creator_name}`);
      return Promise.resolve();
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
      return Promise.reject(error);
    }
  };

  const handleDenySubmission = async (submission: Submission, reason: string) => {
    try {
      toast.success(`Denied submission from ${submission.creator_name}`);
      console.log("Denial reason:", reason);
      return Promise.resolve();
    } catch (error) {
      console.error("Error denying submission:", error);
      toast.error("Failed to deny submission");
      return Promise.reject(error);
    }
  };

  const getCampaignProgress = (campaign: Campaign) => {
    let progress = 0;
    let progressText = "";
    let status = "Active";

    if (campaign.type === "payPerView") {
      progress = 30;
      progressText = `$${(campaign.totalBudget * 0.3).toFixed(2)}/$${campaign.totalBudget} spent`;
    } else if (campaign.type === "retainer") {
      const totalVideos = campaign.deliverables?.totalVideos || 10;
      progress = 40;
      progressText = `${Math.round(totalVideos * 0.4)}/${totalVideos} deliverables`;
      status = "Application Phase";
    } else {
      const now = new Date();
      const deadline = new Date(campaign.submissionDeadline);
      
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

      {campaigns && campaigns.length > 0 && activeTab === "campaigns" && (
        <CampaignAnalytics campaigns={campaigns} />
      )}

      <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="submissions">All Submissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="mt-6">
          <div className="grid gap-6">
            {campaigns && campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => {
                  const { progress, progressText, status } = getCampaignProgress(campaign);
                  
                  const views = Math.floor(Math.random() * 50000) + 10000;
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
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{progressText}</span>
                            <span className="font-medium">{status}</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                        
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
        </TabsContent>
        
        <TabsContent value="submissions" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="mb-4 bg-muted/30 p-4 rounded-md text-sm">
              <div className="font-medium mb-1">Campaign Types and Submission Rules</div>
              <ul className="list-disc ml-5 text-muted-foreground space-y-1">
                <li><strong>Pay-per-view:</strong> Submissions have 10 days to accumulate views and are paid based on the views after this period. Submissions auto-accept after 240 hours (10 days) if not reviewed.</li>
                <li><strong>Retainer:</strong> Fixed payment after all deliverables are successfully submitted. All submissions must be accepted to receive payment.</li>
                <li><strong>Challenge:</strong> Paid out after the campaign ends. Winners are selected from approved submissions.</li>
              </ul>
            </div>
            
            <CampaignSubmissionsReview 
              submissions={mockSubmissions}
              onApprove={handleApproveSubmission}
              onDeny={handleDenySubmission}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <CampaignFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCampaignUpdated={() => {
          if (refetch) refetch();
        }}
      />
    </div>
  );
}
