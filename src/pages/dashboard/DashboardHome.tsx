import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Eye, FileCheck, Plus, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Progress } from "@/components/ui/progress";
export default function DashboardHome() {
  // For demo purposes, we'll load from localStorage
  const {
    data: campaigns = [],
    isLoading
  } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      // In a real app, this would be an API call
      // For now, we'll simulate with stored data
      const storedCampaigns = localStorage.getItem("campaigns");
      return storedCampaigns ? JSON.parse(storedCampaigns) : [];
    }
  });
  const stats = {
    totalSpent: campaigns.reduce((sum: number, c: Campaign) => {
      // For payPerView, we'll simulate a spend of 20% of the budget
      if (c.type === "payPerView") {
        return sum + c.totalBudget * 0.2;
      }
      return sum + c.totalBudget * 0.1; // Base spend for other types
    }, 0),
    totalViews: campaigns.length * 5000,
    // Simulated view count
    totalSubmissions: campaigns.length * 12,
    // Simulated submission count
    totalCreators: campaigns.length * 3 // Simulated creator count
  };
  return <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Track your campaign performance and metrics
          </p>
        </div>
        <Link to="/dashboard/campaigns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalSpent.toLocaleString('en-US', {
              maximumFractionDigits: 2
            })}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all active campaigns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From creator content
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
            <p className="text-xs text-muted-foreground">
              Content submissions received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCreators}</div>
            <p className="text-xs text-muted-foreground">
              Working on your campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Recent Campaigns</h3>
      </div>

      {isLoading ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => <Card key={i} className="animate-pulse">
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
            </Card>)}
        </div> : campaigns.length > 0 ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.slice(0, 3).map((campaign: Campaign) => {
        // Calculate progress based on campaign type
        let progress = 0;
        let progressText = "";
        let status = "Active";
        if (campaign.type === "payPerView") {
          // Simulate 30% of budget spent
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
          const total = deadline.getTime() - new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
          const elapsed = now.getTime() - new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime();
          progress = Math.min(100, Math.floor(elapsed / total * 100));
          progressText = `${Math.round(progress)}% complete`;
        }
        return <Link to={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                  {campaign.bannerImage ? <div className="h-40 relative">
                      <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-4">
                        <h3 className="text-white font-medium">{campaign.title}</h3>
                      </div>
                    </div> : <CardHeader>
                      <CardTitle className="text-base">{campaign.title}</CardTitle>
                    </CardHeader>}
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
                        <span className="text-muted-foreground">
                          {status}
                        </span>
                      </div>
                      <Progress value={progress} className={`h-2 ${campaign.type === 'payPerView' ? 'bg-green-100' : ''}`} />
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">
                        Creators: <span className="font-medium">3</span>
                      </div>
                      <div className="flex gap-1">
                        {campaign.platforms && campaign.platforms.slice(0, 2).map(platform => <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                            {platform.split(' ')[0]}
                          </span>)}
                        {campaign.platforms && campaign.platforms.length > 2 && <span className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                            +{campaign.platforms.length - 2}
                          </span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>;
      })}
        </div> : <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-4">No campaigns yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first campaign to get started
          </p>
          <Link to="/dashboard/campaigns/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Campaign
            </Button>
          </Link>
        </div>}
    </div>;
}