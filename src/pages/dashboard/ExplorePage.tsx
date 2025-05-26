
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Campaign } from "@/lib/campaign-types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, TrendingUp, Eye, Heart, Star, Crown, Search, X, DollarSign, Activity } from "lucide-react";
import { useState } from "react";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // For demo purposes, we'll simulate discovering campaigns and creators
  const { data: discoveredCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['discover-campaigns'],
    queryFn: () => {
      // Simulated discovery data
      return [
        {
          id: "disc-1",
          title: "Summer Collection Showcase",
          brandName: "Fashion Nova",
          type: "retainer",
          contentType: "UGC",
          totalBudget: 5000,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=3786&auto=format&fit=crop",
          platforms: ["Instagram Reels", "TikTok"],
          featured: true,
          progress: 45
        },
        {
          id: "disc-2",
          title: "Workout Supplement Review",
          brandName: "GymShark",
          type: "payPerView",
          contentType: "UGC",
          totalBudget: 3000,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=3870&auto=format&fit=crop",
          platforms: ["YouTube Shorts", "TikTok"],
          featured: true,
          progress: 78
        },
        {
          id: "disc-3",
          title: "Food Plating Challenge",
          brandName: "Chef's Table",
          type: "challenge",
          contentType: "UGC",
          totalBudget: 2500,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=3870&auto=format&fit=crop",
          platforms: ["Instagram Reels", "TikTok"],
          featured: false,
          progress: 23
        },
        {
          id: "disc-4",
          title: "Tech Product Launch",
          brandName: "TechCorp",
          type: "retainer",
          contentType: "UGC",
          totalBudget: 4000,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=3870&auto=format&fit=crop",
          platforms: ["YouTube", "TikTok"],
          featured: false,
          progress: 89
        }
      ];
    }
  });

  const { data: discoveredCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['discover-creators'],
    queryFn: () => {
      // Simulated creator discovery data with enhanced information
      return [
        {
          id: "1",
          name: "Alex Thompson",
          username: "@alexthompson",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          followers: "125K",
          category: "Lifestyle",
          engagement: "8.5%",
          platforms: ["TikTok", "Instagram"],
          recentViews: "2.1M",
          campaigns: 12,
          earned: "$4,200",
          viewsGenerated: "850K",
          isTop: true,
          bio: "Lifestyle content creator passionate about fitness, travel, and authentic storytelling. I love creating content that inspires and connects with my audience.",
          location: "Los Angeles, CA",
          joinDate: "March 2022",
          isVerified: true,
          metrics: {
            totalCampaigns: 12,
            totalEarnings: 4200,
            totalGmv: 4800,
            avgEngagementRate: 8.5,
            rating: 4.8
          },
          categories: ["Lifestyle", "Fitness", "Travel"]
        },
        {
          id: "2",
          name: "Sarah Kim",
          username: "@sarahkim_fit",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face",
          followers: "89K",
          category: "Fitness",
          engagement: "12.3%",
          platforms: ["Instagram", "YouTube"],
          recentViews: "1.8M",
          campaigns: 8,
          earned: "$3,100",
          viewsGenerated: "620K",
          isTop: true,
          bio: "Fitness enthusiast and certified trainer helping others achieve their health goals through engaging workout content and nutrition tips.",
          location: "Austin, TX",
          joinDate: "January 2021",
          isVerified: true,
          metrics: {
            totalCampaigns: 8,
            totalEarnings: 3100,
            totalGmv: 3400,
            avgEngagementRate: 12.3,
            rating: 4.9
          },
          categories: ["Fitness", "Health", "Nutrition"]
        },
        {
          id: "3",
          name: "Mike Chen",
          username: "@mikecooks",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          followers: "203K",
          category: "Food",
          engagement: "6.7%",
          platforms: ["TikTok", "Instagram"],
          recentViews: "3.2M",
          campaigns: 15,
          earned: "$5,800",
          viewsGenerated: "1.2M",
          isTop: false,
          bio: "Food lover and chef creating delicious recipes and cooking tutorials. Passionate about sharing culinary adventures with my community.",
          location: "New York, NY",
          joinDate: "June 2020",
          isVerified: false,
          metrics: {
            totalCampaigns: 15,
            totalEarnings: 5800,
            totalGmv: 6200,
            avgEngagementRate: 6.7,
            rating: 4.6
          },
          categories: ["Food", "Cooking", "Recipes"]
        },
        {
          id: "4",
          name: "Emma Rodriguez",
          username: "@emmastyle",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          followers: "167K",
          category: "Fashion",
          engagement: "9.8%",
          platforms: ["Instagram", "TikTok"],
          recentViews: "2.7M",
          campaigns: 10,
          earned: "$4,500",
          viewsGenerated: "980K",
          isTop: false,
          bio: "Fashion stylist and trendsetter sharing the latest fashion finds and styling tips. Always on the hunt for the perfect outfit!",
          location: "Miami, FL",
          joinDate: "September 2021",
          isVerified: true,
          metrics: {
            totalCampaigns: 10,
            totalEarnings: 4500,
            totalGmv: 5100,
            avgEngagementRate: 9.8,
            rating: 4.7
          },
          categories: ["Fashion", "Style", "Beauty"]
        }
      ];
    }
  });

  const isLoading = campaignsLoading || creatorsLoading;

  // Filter data based on search query - now searches across ALL categories
  const filteredCampaigns = discoveredCampaigns.filter((campaign: any) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreators = discoveredCreators.filter((creator: any) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate featured and regular campaigns
  const featuredCampaigns = filteredCampaigns.filter((campaign: any) => campaign.featured);
  const regularCampaigns = filteredCampaigns.filter((campaign: any) => !campaign.featured);

  // Separate top and regular creators
  const topCreators = filteredCreators.filter((creator: any) => creator.isTop);
  const regularCreators = filteredCreators.filter((creator: any) => !creator.isTop);

  // Create "For you" feed by mixing campaigns and creators
  const forYouFeed = [];
  const maxLength = Math.max(filteredCampaigns.length, filteredCreators.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < filteredCampaigns.length) {
      forYouFeed.push({ ...filteredCampaigns[i], itemType: 'campaign' });
    }
    if (i < filteredCreators.length) {
      forYouFeed.push({ ...filteredCreators[i], itemType: 'creator' });
    }
  }

  const renderCampaignCard = (campaign: any, isFeatured = false) => (
    <Card key={campaign.id} className={`overflow-hidden ${isFeatured ? 'border-2 border-yellow-400 shadow-lg' : ''}`}>
      {isFeatured && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1 text-xs font-medium text-white flex items-center gap-1">
          <Star className="h-3 w-3" />
          Featured Campaign
        </div>
      )}
      <div className="h-48 relative">
        <img 
          src={campaign.bannerImage}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
          <p className="text-sm text-white/80">by {campaign.brandName}</p>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
          </span>
          <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
            {campaign.contentType}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Campaign Progress</span>
            <span className="text-sm font-medium">{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <div>
            <span className="text-muted-foreground">Budget: </span>
            <span className="font-medium">${campaign.totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex gap-1">
            {campaign.platforms.map((platform: string) => (
              <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                {platform.split(' ')[0]}
              </span>
            ))}
          </div>
        </div>
        <Link to={`/dashboard/campaigns/${campaign.id}`}>
          <Button className="w-full">View Campaign</Button>
        </Link>
      </CardContent>
    </Card>
  );

  const renderCreatorCard = (creator: any, isTop = false) => (
    <Card key={creator.id} className={`overflow-hidden ${isTop ? 'border-2 border-purple-400 shadow-lg' : ''}`}>
      {isTop && (
        <div className="bg-gradient-to-r from-purple-400 to-pink-400 px-3 py-1 text-xs font-medium text-white flex items-center gap-1">
          <Crown className="h-3 w-3" />
          Top Creator
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{creator.name}</h3>
            <p className="text-muted-foreground text-sm">{creator.username}</p>
            <Badge variant="secondary" className="mt-1">{creator.category}</Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="h-3 w-3" />
              <span className="font-medium">{creator.followers}</span>
            </div>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-3 w-3" />
              <span className="font-medium">{creator.engagement}</span>
            </div>
            <p className="text-xs text-muted-foreground">Engagement</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Activity className="h-3 w-3" />
              <span className="font-medium">{creator.campaigns}</span>
            </div>
            <p className="text-xs text-muted-foreground">Campaigns</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium">{creator.earned}</span>
            </div>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
          <div className="text-center col-span-2">
            <div className="flex items-center justify-center gap-1">
              <Eye className="h-3 w-3" />
              <span className="font-medium">{creator.viewsGenerated}</span>
            </div>
            <p className="text-xs text-muted-foreground">Views Generated</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4">
          {creator.platforms.map((platform: string) => (
            <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
              {platform}
            </span>
          ))}
        </div>
        
        <Link to={`/dashboard/creators/${creator.id}`}>
          <Button className="w-full" variant="outline">View Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );

  const renderForYouFeedItem = (item: any) => {
    if (item.itemType === 'campaign') {
      return (
        <div key={`campaign-${item.id}`} className="w-full max-w-md mx-auto mb-4">
          {renderCampaignCard(item, item.featured)}
        </div>
      );
    } else {
      return (
        <div key={`creator-${item.id}`} className="w-full max-w-md mx-auto mb-4">
          {renderCreatorCard(item, item.isTop)}
        </div>
      );
    }
  };

  return (
    <div className="container py-8 relative">
      {/* Header with Search */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Explore</h2>
          <p className="text-muted-foreground">
            Discover campaigns and creators on the platform
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="flex items-center gap-2 animate-fade-in">
              <Input
                placeholder="Search campaigns, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          {!showSearch && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowSearch(true)}
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="for-you" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="for-you">For you</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-muted-foreground">Loading feed...</div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 px-4">
                  {forYouFeed.map((item: any, index) => renderForYouFeedItem(item))}
                  {forYouFeed.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery ? "No results found" : "No content available"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg"></div>
                  <CardHeader className="pb-2">
                    <div className="h-5 w-3/4 bg-muted rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-1/2 bg-muted rounded mb-3"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-6 w-16 bg-muted rounded-full"></div>
                      <div className="h-6 w-16 bg-muted rounded-full"></div>
                    </div>
                    <div className="h-10 w-full bg-muted rounded mt-4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Featured Campaigns */}
              {featuredCampaigns.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h3 className="text-xl font-semibold">Featured Campaigns</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredCampaigns.map((campaign: any) => renderCampaignCard(campaign, true))}
                  </div>
                </div>
              )}

              {/* All Campaigns */}
              <div>
                <h3 className="text-xl font-semibold mb-4">All Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularCampaigns.map((campaign: any) => renderCampaignCard(campaign))}
                </div>
                {regularCampaigns.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No campaigns found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="h-16 w-16 bg-muted rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-5 w-3/4 bg-muted rounded mb-2"></div>
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                      </div>
                    </div>
                    <div className="h-10 w-full bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {/* Top Creators */}
              {topCreators.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="h-5 w-5 text-purple-500" />
                    <h3 className="text-xl font-semibold">Top Creators</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topCreators.map((creator: any) => renderCreatorCard(creator, true))}
                  </div>
                </div>
              )}

              {/* All Creators */}
              <div>
                <h3 className="text-xl font-semibold mb-4">All Creators</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularCreators.map((creator: any) => renderCreatorCard(creator))}
                </div>
                {regularCreators.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No creators found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
