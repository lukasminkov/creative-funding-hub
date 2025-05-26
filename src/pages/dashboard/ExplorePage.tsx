import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Campaign } from "@/lib/campaign-types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, TrendingUp, Eye, Heart } from "lucide-react";

export default function ExplorePage() {
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
          platforms: ["Instagram Reels", "TikTok"]
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
          platforms: ["YouTube Shorts", "TikTok"]
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
          platforms: ["Instagram Reels", "TikTok"]
        }
      ];
    }
  });

  const { data: discoveredCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ['discover-creators'],
    queryFn: () => {
      // Simulated creator discovery data
      return [
        {
          id: "creator-1",
          name: "Alex Thompson",
          username: "@alexthompson",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          followers: "125K",
          category: "Lifestyle",
          engagement: "8.5%",
          platforms: ["TikTok", "Instagram"],
          recentViews: "2.1M"
        },
        {
          id: "creator-2",
          name: "Sarah Kim",
          username: "@sarahkim_fit",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face",
          followers: "89K",
          category: "Fitness",
          engagement: "12.3%",
          platforms: ["Instagram", "YouTube"],
          recentViews: "1.8M"
        },
        {
          id: "creator-3",
          name: "Mike Chen",
          username: "@mikecooks",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          followers: "203K",
          category: "Food",
          engagement: "6.7%",
          platforms: ["TikTok", "Instagram"],
          recentViews: "3.2M"
        },
        {
          id: "creator-4",
          name: "Emma Rodriguez",
          username: "@emmastyle",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
          followers: "167K",
          category: "Fashion",
          engagement: "9.8%",
          platforms: ["Instagram", "TikTok"],
          recentViews: "2.7M"
        }
      ];
    }
  });

  const isLoading = campaignsLoading || creatorsLoading;

  // Combine and shuffle campaigns and creators for mixed display
  const combinedContent = [];
  const maxLength = Math.max(discoveredCampaigns.length, discoveredCreators.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < discoveredCampaigns.length) {
      combinedContent.push({ ...discoveredCampaigns[i], type: 'campaign' });
    }
    if (i < discoveredCreators.length) {
      combinedContent.push({ ...discoveredCreators[i], type: 'creator' });
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Explore</h2>
        <p className="text-muted-foreground">
          Discover campaigns and creators on the platform
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combinedContent.map((item: any, index) => (
                item.type === 'campaign' ? (
                  <Card key={`campaign-${item.id}`} className="overflow-hidden">
                    <div className="h-48 relative">
                      <img 
                        src={item.bannerImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <p className="text-sm text-white/80">by {item.brandName}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                          {item.contentType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">Budget: </span>
                          <span className="font-medium">${item.totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-1">
                          {item.platforms.map((platform: string) => (
                            <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                              {platform.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full">View Campaign</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={`creator-${item.id}`} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={item.avatar} alt={item.name} />
                          <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-muted-foreground text-sm">{item.username}</p>
                          <Badge variant="secondary" className="mt-1">{item.category}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Users className="h-3 w-3" />
                            <span className="text-sm font-medium">{item.followers}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span className="text-sm font-medium">{item.engagement}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Engagement</p>
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span className="text-sm font-medium">{item.recentViews}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Recent Views</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-1 mb-4">
                        {item.platforms.map((platform: string) => (
                          <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                            {platform}
                          </span>
                        ))}
                      </div>
                      
                      <Button className="w-full" variant="outline">View Profile</Button>
                    </CardContent>
                  </Card>
                )
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoveredCampaigns.map((campaign: any) => (
                <Card key={campaign.id} className="overflow-hidden">
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
                    <Button className="w-full">View Details</Button>
                  </CardContent>
                </Card>
              ))}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoveredCreators.map((creator: any) => (
                <Card key={creator.id} className="overflow-hidden">
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
                    
                    <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Users className="h-3 w-3" />
                          <span className="text-sm font-medium">{creator.followers}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span className="text-sm font-medium">{creator.engagement}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span className="text-sm font-medium">{creator.recentViews}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Recent Views</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1 mb-4">
                      {creator.platforms.map((platform: string) => (
                        <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                          {platform}
                        </span>
                      ))}
                    </div>
                    
                    <Button className="w-full" variant="outline">View Profile</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
