import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Submission, SubmissionStatusType } from "@/lib/campaign-types";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { PlusCircle, ChevronDown, CalendarDays, CircleDollarSign, Filter, LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import CampaignSummaryCard from "@/components/dashboard/CampaignSummaryCard";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CampaignSubmissions from "@/components/dashboard/CampaignSubmissions";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const generateSampleSubmissions = () => {
  const platforms = ["TikTok", "Instagram Reels", "YouTube Shorts"];
  const statuses = ["pending", "approved", "denied", "paid"];
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
    { id: "campaign-1", title: "Summer Fashion Collection", type: "retainer" },
    { id: "campaign-2", title: "Tech Gadget Review", type: "payPerView" },
    { id: "campaign-3", title: "Fitness Challenge", type: "challenge" },
    { id: "campaign-4", title: "Cooking Tutorial", type: "retainer" },
    { id: "campaign-5", title: "Beauty Product Showcase", type: "payPerView" }
  ];
  
  const generateDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    date.setSeconds(Math.floor(Math.random() * 60));
    return date;
  };
  
  const submissions = [];
  
  for (let i = 0; i < 20; i++) {
    const creator = creators[Math.floor(Math.random() * creators.length)];
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const status = i < 10 ? "pending" : statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.random() * 14;
    
    submissions.push({
      id: `${300 + i}`,
      creator_id: creator.id,
      creator_name: creator.name,
      creator_avatar: creator.avatar,
      campaign_id: campaign.id,
      campaign_title: campaign.title,
      campaign_type: campaign.type as 'retainer' | 'payPerView' | 'challenge',
      submitted_date: generateDate(daysAgo),
      platform,
      platformUsername: `@${creator.name.toLowerCase().replace(' ', '')}`,
      content: `https://example.com/${platform.toLowerCase().replace(' ', '')}/video${i + 100}`,
      payment_amount: Math.floor(Math.random() * 200) + 100,
      views: Math.floor(Math.random() * 50000) + 1000,
      status
    });
  }
  
  for (let i = 0; i < 3; i++) {
    const creator = creators[0];
    const platform = platforms[i % platforms.length];
    const status = i < 2 ? "approved" : "pending";
    const daysAgo = i * 2;
    
    submissions.push({
      id: `retainer-1-${i}`,
      creator_id: creator.id,
      creator_name: creator.name,
      creator_avatar: creator.avatar,
      campaign_id: "campaign-1",
      campaign_title: "Summer Fashion Collection",
      campaign_type: "retainer",
      submitted_date: generateDate(daysAgo),
      platform,
      platformUsername: `@${creator.name.toLowerCase().replace(' ', '')}`,
      content: `https://example.com/${platform.toLowerCase().replace(' ', '')}/retainer${i}`,
      payment_amount: 500,
      views: Math.floor(Math.random() * 10000) + 500,
      status
    });
  }
  
  for (let i = 0; i < 4; i++) {
    const creator = creators[3];
    const platform = platforms[i % platforms.length];
    const status = i < 1 ? "approved" : "pending";
    const daysAgo = i + 1;
    
    submissions.push({
      id: `retainer-2-${i}`,
      creator_id: creator.id,
      creator_name: creator.name,
      creator_avatar: creator.avatar,
      campaign_id: "campaign-4",
      campaign_title: "Cooking Tutorial",
      campaign_type: "retainer",
      submitted_date: generateDate(daysAgo),
      platform,
      platformUsername: `@${creator.name.toLowerCase().replace(' ', '')}`,
      content: `https://example.com/${platform.toLowerCase().replace(' ', '')}/cooking${i}`,
      payment_amount: 750,
      views: Math.floor(Math.random() * 15000) + 1000,
      status
    });
  }
  
  return submissions;
};

const mockSubmissions: Submission[] = generateSampleSubmissions();

export default function CampaignsPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
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
  
  const handleDeleteCampaign = (id: string) => {
    toast.success("Campaign deleted successfully");
  };

  const filteredCampaigns = campaigns?.filter(campaign => {
    if (campaignTypeFilter !== "all" && campaign.type !== campaignTypeFilter) {
      return false;
    }
    
    if (statusFilter === "all") {
      return true;
    }
    
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    
    if (statusFilter === "active" && endDate > now) {
      return true;
    }
    
    if (statusFilter === "ended" && endDate < now) {
      return true;
    }
    
    if (statusFilter === "application" && campaign.type === "retainer") {
      const appDeadline = new Date(campaign.applicationDeadline);
      return appDeadline > now;
    }
    
    return false;
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6 animate-pulse">
          <div className="h-10 w-48 bg-muted rounded"></div>
          <div className="h-10 w-36 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm animate-pulse">
              <div className="h-40 bg-muted"></div>
              <div className="p-4">
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-3 bg-muted rounded mb-4 w-2/3"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j}>
                      <div className="h-3 bg-muted rounded mb-2 w-1/2"></div>
                      <div className="h-5 bg-muted rounded w-full"></div>
                    </div>
                  ))}
                </div>
                <div className="h-9 bg-muted rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Campaigns</h2>
          <p className="mb-6">{error.message}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage your creator campaigns</p>
        </div>
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      <Card glass className="overflow-hidden mb-6">
        <CardContent className="p-4">
          <Tabs defaultValue="campaigns" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <TabsList className="w-full md:w-auto bg-secondary/50 backdrop-blur-sm">
                <TabsTrigger value="campaigns" className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Campaigns
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex items-center">
                  <CircleDollarSign className="h-4 w-4 mr-2" />
                  Submissions
                </TabsTrigger>
              </TabsList>
              
              {activeTab === "campaigns" && (
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <Select value={campaignTypeFilter} onValueChange={setCampaignTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-background/80 backdrop-blur-sm">
                      <SelectValue placeholder="Campaign Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="retainer">Retainer</SelectItem>
                      <SelectItem value="payPerView">Pay Per View</SelectItem>
                      <SelectItem value="challenge">Challenge</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px] bg-background/80 backdrop-blur-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                      <SelectItem value="application">Application Phase</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-10 w-10 bg-background/80 backdrop-blur-sm">
                        {viewMode === "grid" ? (
                          <LayoutGrid className="h-4 w-4" />
                        ) : (
                          <LayoutList className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setViewMode("grid")}>
                        <LayoutGrid className="h-4 w-4 mr-2" />
                        Grid View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewMode("list")}>
                        <LayoutList className="h-4 w-4 mr-2" />
                        List View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
            
            <TabsContent value="campaigns" className="mt-6">
              {campaigns && campaigns.length > 0 && activeTab === "campaigns" && (
                <CampaignAnalytics campaigns={campaigns} />
              )}
              
              <div className="grid gap-6 mt-6">
                {filteredCampaigns && filteredCampaigns.length > 0 ? (
                  <div className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                      : "space-y-4"
                  }>
                    {filteredCampaigns.map((campaign) => (
                      <CampaignSummaryCard 
                        key={campaign.id} 
                        campaign={campaign}
                        onDelete={handleDeleteCampaign} 
                      />
                    ))}
                  </div>
                ) : campaigns && campaigns.length > 0 ? (
                  <Card glass className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">No matching campaigns</h2>
                    <p className="text-muted-foreground mb-6">
                      Try changing your filters to see more results
                    </p>
                    <Button variant="outline" onClick={() => {
                      setCampaignTypeFilter("all");
                      setStatusFilter("all");
                    }}>
                      Clear Filters
                    </Button>
                  </Card>
                ) : (
                  <Card glass className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4">No campaigns found</h2>
                    <p className="text-muted-foreground mb-6">
                      Create your first campaign to get started
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      Create Campaign
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="submissions" className="mt-6">
              <Card glass className="border-0">
                <CardContent className="p-4">
                  <CampaignSubmissions 
                    submissions={mockSubmissions}
                    onApprove={handleApproveSubmission}
                    onDeny={handleDenySubmission}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
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
