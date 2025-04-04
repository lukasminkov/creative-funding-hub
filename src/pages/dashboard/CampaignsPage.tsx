import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      // In a real app, this would be an API call
      const storedCampaigns = localStorage.getItem("campaigns");
      return storedCampaigns ? JSON.parse(storedCampaigns) : [];
    }
  });

  // Filter campaigns based on search and type
  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || campaign.type === activeTab;
    return matchesSearch && matchesTab;
  });

  function getCampaignStatus(campaign: Campaign): string {
    const now = new Date();
    const endDate = new Date(campaign.endDate);
    
    if (endDate < now) {
      return "Ended";
    }

    if (campaign.type === "retainer") {
      const appDeadline = new Date(campaign.applicationDeadline);
      if (appDeadline > now) {
        return "Application Phase";
      }
      return "Active";
    }
    
    if (campaign.type === "challenge") {
      const submitDeadline = new Date(campaign.submissionDeadline);
      if (submitDeadline < now) {
        return "Judging";
      }
      return "Submission Phase";
    }
    
    return "Ongoing";
  }

  // Helper function to render the campaign card based on type
  const renderCampaignCard = (campaign: Campaign) => {
    const status = getCampaignStatus(campaign);
    let progress = 0;
    let progressText = "";
    let statusColor = "bg-blue-100 text-blue-800";
    
    if (status === "Ended") {
      statusColor = "bg-gray-100 text-gray-800";
    } else if (status.includes("Application")) {
      statusColor = "bg-purple-100 text-purple-800";
    } else if (status === "Judging") {
      statusColor = "bg-yellow-100 text-yellow-800";
    } else {
      statusColor = "bg-green-100 text-green-800";
    }

    switch(campaign.type) {
      case "payPerView":
        // Simulate 30% of budget spent for active campaigns
        progress = status === "Ended" ? 100 : 30;
        progressText = `$${(campaign.totalBudget * (progress/100)).toFixed(2)}/$${campaign.totalBudget} spent`;
        break;
        
      case "retainer":
        // Simulate 40% of deliverables submitted
        const totalVideos = campaign.deliverables?.totalVideos || 10;
        progress = status === "Ended" ? 100 : (status === "Application Phase" ? 0 : 40);
        progressText = `${Math.round(totalVideos * (progress/100))}/${totalVideos} deliverables`;
        break;
        
      case "challenge":
        // Calculate progress based on time remaining
        const now = new Date();
        if (status === "Ended" || status === "Judging") {
          progress = 100;
          progressText = "100% complete";
        } else {
          const deadline = new Date(campaign.submissionDeadline);
          const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // Assume started 2 weeks ago
          const total = deadline.getTime() - startDate.getTime();
          const elapsed = now.getTime() - startDate.getTime();
          progress = Math.min(100, Math.floor((elapsed / total) * 100));
          progressText = `${Math.round(progress)}% complete`;
        }
        break;
    }

    return (
      <Link to={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
        <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
          {campaign.bannerImage ? (
            <div className="h-40 relative">
              <img 
                src={campaign.bannerImage} 
                alt={campaign.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h3 className="text-white font-medium">{campaign.title}</h3>
              </div>
            </div>
          ) : (
            <CardHeader>
              <CardTitle>{campaign.title}</CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
              </span>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                {campaign.contentType}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm">
                <span>{progressText}</span>
                <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
                  {status}
                </span>
              </div>
              <Progress 
                value={progress} 
                className={`h-2 ${campaign.type === 'payPerView' ? 'bg-green-100' : ''}`}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center space-x-1">
                <div className="text-muted-foreground">
                  Budget: <span className="font-medium">${campaign.totalBudget.toLocaleString()}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="ml-auto" asChild>
                <Link to={`/dashboard/campaigns/${campaign.id}/chat`}>
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="mt-2">
              <div className="flex justify-between items-center text-sm">
                <div className="text-muted-foreground">
                  Creators: <span className="font-medium">3</span>
                </div>
                <div className="flex gap-1">
                  {campaign.platforms && campaign.platforms.slice(0, 2).map(platform => (
                    <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                      {platform.split(' ')[0]}
                    </span>
                  ))}
                  {campaign.platforms && campaign.platforms.length > 2 && (
                    <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                      +{campaign.platforms.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Your Campaigns</h2>
          <p className="text-muted-foreground">
            Manage and monitor all your creator campaigns
          </p>
        </div>
        <Link to="/dashboard/campaigns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Analytics Dashboard */}
      <CampaignAnalytics />

      <div className="flex flex-col md:flex-row md:justify-between gap-4 items-start md:items-center mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="retainer">Retainer</TabsTrigger>
            <TabsTrigger value="payPerView">Pay Per View</TabsTrigger>
            <TabsTrigger value="challenge">Challenge</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-40 bg-muted" />
              <CardContent className="p-4">
                <div className="h-4 w-2/3 bg-muted rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-muted rounded mb-6"></div>
                <div className="h-2 w-full bg-muted rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-20 bg-muted rounded"></div>
                  <div className="h-8 w-20 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map(renderCampaignCard)}
        </div>
      ) : (
        <div className="text-center p-8 border border-dashed rounded-lg">
          <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">Try changing your search or create a new campaign</p>
          <Link to="/dashboard/campaigns/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
