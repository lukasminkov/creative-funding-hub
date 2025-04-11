import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Activity, Eye, FileCheck, Plus, Users, TrendingUp, Target, ChevronRight, ArrowUpRight, Clock, Award, BarChart2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { Progress } from "@/components/ui/progress";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

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
  
  // Generate some sample data for the chart
  const chartData = [
    { name: 'Mon', views: 2400, submissions: 5 },
    { name: 'Tue', views: 1398, submissions: 8 },
    { name: 'Wed', views: 9800, submissions: 12 },
    { name: 'Thu', views: 3908, submissions: 7 },
    { name: 'Fri', views: 4800, submissions: 9 },
    { name: 'Sat', views: 3800, submissions: 6 },
    { name: 'Sun', views: 4300, submissions: 8 },
  ];
  
  // Sample top creators
  const topCreators = [
    { id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?u=sarah', stats: { views: 24800, engagement: '8.2%' }, progress: 95 },
    { id: 2, name: 'Alex Chen', avatar: 'https://i.pravatar.cc/150?u=alex', stats: { views: 19200, engagement: '7.1%' }, progress: 68 },
    { id: 3, name: 'Taylor Smith', avatar: 'https://i.pravatar.cc/150?u=taylor', stats: { views: 15400, engagement: '6.5%' }, progress: 32 },
  ];
  
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
    totalCreators: campaigns.length * 3, // Simulated creator count
    overallProgress: 45 // Percentage completion across all campaigns
  };
  
  return (
    <div className="container py-8">
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

      <div className="grid gap-8 grid-cols-12">
        {/* Left column - 8/12 width */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Stats overview - 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card glass className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col items-center p-3">
                  <div className="mb-2 p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-sm text-muted-foreground">Total Budget</h4>
                  <p className="text-2xl font-bold">
                    ${stats.totalSpent.toLocaleString('en-US', {
                    maximumFractionDigits: 0
                  })}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card glass className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col items-center p-3">
                  <div className="mb-2 p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                    <Eye className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-sm text-muted-foreground">Total Views</h4>
                  <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card glass className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col items-center p-3">
                  <div className="mb-2 p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <FileCheck className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h4 className="text-sm text-muted-foreground">Submissions</h4>
                  <p className="text-2xl font-bold">{stats.totalSubmissions}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card glass className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col items-center p-3">
                  <div className="mb-2 p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h4 className="text-sm text-muted-foreground">Creators</h4>
                  <p className="text-2xl font-bold">{stats.totalCreators}</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Performance chart */}
          <Card glass className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Top creators section */}
          <Card glass className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Top Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {topCreators.map(creator => (
                  <div key={creator.id} className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{creator.name}</h4>
                        <span className="text-sm text-muted-foreground">{creator.progress}%</span>
                      </div>
                      <Progress value={creator.progress} className="h-2" />
                      <div className="flex gap-2 pt-1 text-xs text-muted-foreground">
                        <span>{creator.stats.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span>{creator.stats.engagement} engagement</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" size="sm" className="w-full mt-2">
                  View All Creators
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column - 4/12 width */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Overall Progress Card */}
          <Card highlight className="overflow-hidden h-[260px]">
            <CardContent className="p-6 flex flex-col items-center justify-center h-full">
              <div className="relative h-32 w-32 flex items-center justify-center mb-4">
                <svg className="h-32 w-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.9)"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 45 * stats.overallProgress / 100} ${2 * Math.PI * 45 * (100 - stats.overallProgress) / 100}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-bold">{stats.overallProgress}%</span>
                </div>
              </div>
              <div className="text-center">
                <p className="mb-1 text-white/80">Campaign Completion</p>
                <div className="flex justify-around text-sm mt-3">
                  <div>
                    <p className="text-white/60">Campaigns</p>
                    <p className="font-medium">{campaigns.length}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Active</p>
                    <p className="font-medium">{Math.floor(campaigns.length * 0.7)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Notifications/Activity Card */}
          <NotificationCenter glass className="glass-card" />
          
          {/* Upcoming Deadlines Card */}
          <Card glass className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.slice(0, 2).map((campaign: Campaign, index: number) => (
                  <div key={index} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="p-2 rounded-md bg-primary/10 dark:bg-primary/20 text-primary h-fit">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm line-clamp-1">{campaign.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(campaign.endDate).toLocaleDateString()} • {campaign.type}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Link to="/dashboard/campaigns">
                  <Button variant="ghost" size="sm" className="w-full mt-2">
                    View All Campaigns
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          {/* Campaign Types Distribution */}
          <Card glass className="overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Campaign Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Pay Per View</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(campaigns.filter((c: Campaign) => c.type === 'payPerView').length / Math.max(1, campaigns.length) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm">Retainer</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(campaigns.filter((c: Campaign) => c.type === 'retainer').length / Math.max(1, campaigns.length) * 100)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                    <span className="text-sm">Challenge</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(campaigns.filter((c: Campaign) => c.type === 'challenge').length / Math.max(1, campaigns.length) * 100)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Recent Campaigns</h3>
          <Link to="/dashboard/campaigns">
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
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
        ) : campaigns.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.slice(0, 3).map((campaign: Campaign) => {
              // Calculate progress based on campaign type
              let progress = 0;
              let progressText = "";
              let status = "Active";
              if (campaign.type === "payPerView") {
                // Simulate 30% of budget spent
                progress = 30;
                progressText = `$${(campaign.totalBudget * 0.3).toFixed(2)}/$${campaign.totalBudget} claimed`;
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
              return (
                <Link to={`/dashboard/campaigns/${campaign.id}`} key={campaign.id}>
                  <Card glass className="h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    {campaign.bannerImage ? (
                      <div className="h-40 relative">
                        <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 w-full p-4">
                          <h3 className="text-white font-medium">{campaign.title}</h3>
                        </div>
                      </div>
                    ) : (
                      <CardHeader>
                        <CardTitle className="text-base">{campaign.title}</CardTitle>
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
                          <span className="text-muted-foreground">
                            {status}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>

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
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
