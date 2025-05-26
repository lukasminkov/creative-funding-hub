
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, UserPlus, MapPin, Calendar, Star, TrendingUp } from "lucide-react";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { toast } from "sonner";

// Enhanced mock creator data
const mockCreatorData = {
  "1": {
    id: 1,
    name: "Alex Thompson",
    username: "@alexthompson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Lifestyle content creator passionate about fitness, travel, and authentic storytelling. I love creating content that inspires and connects with my audience.",
    location: "Los Angeles, CA",
    joinDate: "March 2022",
    isVerified: true,
    platforms: ["instagram", "tiktok", "youtube"],
    followers: {
      instagram: 85000,
      tiktok: 40000,
      youtube: 0
    },
    metrics: {
      totalCampaigns: 12,
      totalEarnings: 4200,
      totalGmv: 4800,
      avgEngagementRate: 8.5,
      rating: 4.8
    },
    categories: ["Lifestyle", "Fitness", "Travel"],
    recentWork: [
      { id: 1, title: "Summer Fashion Haul", thumbnail: "https://picsum.photos/300/300?random=1", views: 125000, platform: "instagram" },
      { id: 2, title: "Sustainable Brand Review", thumbnail: "https://picsum.photos/300/300?random=2", views: 89000, platform: "tiktok" },
      { id: 3, title: "Morning Routine GRWM", thumbnail: "https://picsum.photos/300/300?random=3", views: 156000, platform: "youtube" },
      { id: 4, title: "Outfit of the Day", thumbnail: "https://picsum.photos/300/300?random=4", views: 98000, platform: "instagram" },
      { id: 5, title: "Brand Collaboration", thumbnail: "https://picsum.photos/300/300?random=5", views: 112000, platform: "tiktok" },
      { id: 6, title: "Fashion Week Vlog", thumbnail: "https://picsum.photos/300/300?random=6", views: 203000, platform: "youtube" }
    ],
    testimonials: [
      { brand: "Nike", text: "Alex delivered exceptional content that exceeded our expectations. Professional and creative!", rating: 5 },
      { brand: "Sephora", text: "Amazing collaboration! Alex's content drove incredible engagement for our campaign.", rating: 5 }
    ]
  },
  "2": {
    id: 2,
    name: "Sarah Kim",
    username: "@sarahkim_fit",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b820?w=150&h=150&fit=crop&crop=face",
    bio: "Fitness enthusiast and certified trainer helping others achieve their health goals through engaging workout content and nutrition tips.",
    location: "Austin, TX",
    joinDate: "January 2021",
    isVerified: true,
    platforms: ["instagram", "youtube"],
    followers: {
      instagram: 65000,
      youtube: 24000,
      tiktok: 0
    },
    metrics: {
      totalCampaigns: 8,
      totalEarnings: 3100,
      totalGmv: 3400,
      avgEngagementRate: 12.3,
      rating: 4.9
    },
    categories: ["Fitness", "Health", "Nutrition"],
    recentWork: [
      { id: 1, title: "30 Day Fitness Challenge", thumbnail: "https://picsum.photos/300/300?random=7", views: 220000, platform: "instagram" },
      { id: 2, title: "Healthy Meal Prep", thumbnail: "https://picsum.photos/300/300?random=8", views: 180000, platform: "youtube" },
      { id: 3, title: "Morning Workout Routine", thumbnail: "https://picsum.photos/300/300?random=9", views: 340000, platform: "instagram" }
    ],
    testimonials: [
      { brand: "Nike", text: "Sarah's fitness content is authentic and engaging. Great partnership!", rating: 5 },
      { brand: "Protein World", text: "Professional creator with excellent audience engagement.", rating: 4 }
    ]
  },
  "3": {
    id: 3,
    name: "Mike Chen",
    username: "@mikecooks",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Food lover and chef creating delicious recipes and cooking tutorials. Passionate about sharing culinary adventures with my community.",
    location: "New York, NY",
    joinDate: "June 2020",
    isVerified: false,
    platforms: ["tiktok", "instagram"],
    followers: {
      tiktok: 150000,
      instagram: 53000,
      youtube: 0
    },
    metrics: {
      totalCampaigns: 15,
      totalEarnings: 5800,
      totalGmv: 6200,
      avgEngagementRate: 6.7,
      rating: 4.6
    },
    categories: ["Food", "Cooking", "Recipes"],
    recentWork: [
      { id: 1, title: "Easy Pasta Recipe", thumbnail: "https://picsum.photos/300/300?random=10", views: 450000, platform: "tiktok" },
      { id: 2, title: "Kitchen Gadget Review", thumbnail: "https://picsum.photos/300/300?random=11", views: 280000, platform: "instagram" },
      { id: 3, title: "5-Minute Breakfast", thumbnail: "https://picsum.photos/300/300?random=12", views: 380000, platform: "tiktok" }
    ],
    testimonials: [
      { brand: "HelloFresh", text: "Mike's cooking content is entertaining and drives great engagement!", rating: 5 },
      { brand: "Kitchen Aid", text: "Professional creator with authentic food content.", rating: 4 }
    ]
  },
  "4": {
    id: 4,
    name: "Emma Rodriguez",
    username: "@emmastyle",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Fashion stylist and trendsetter sharing the latest fashion finds and styling tips. Always on the hunt for the perfect outfit!",
    location: "Miami, FL",
    joinDate: "September 2021",
    isVerified: true,
    platforms: ["instagram", "tiktok"],
    followers: {
      instagram: 120000,
      tiktok: 47000,
      youtube: 0
    },
    metrics: {
      totalCampaigns: 10,
      totalEarnings: 4500,
      totalGmv: 5100,
      avgEngagementRate: 9.8,
      rating: 4.7
    },
    categories: ["Fashion", "Style", "Beauty"],
    recentWork: [
      { id: 1, title: "Fall Fashion Trends", thumbnail: "https://picsum.photos/300/300?random=13", views: 320000, platform: "instagram" },
      { id: 2, title: "Get Ready With Me", thumbnail: "https://picsum.photos/300/300?random=14", views: 180000, platform: "tiktok" },
      { id: 3, title: "Thrift Store Haul", thumbnail: "https://picsum.photos/300/300?random=15", views: 250000, platform: "instagram" }
    ],
    testimonials: [
      { brand: "Zara", text: "Emma's fashion content is on-trend and drives amazing engagement!", rating: 5 },
      { brand: "Sephora", text: "Great collaboration with authentic styling content.", rating: 5 }
    ]
  }
};

export default function CreatorProfilePage() {
  const { creatorId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("showcase");
  
  const creator = mockCreatorData[creatorId as keyof typeof mockCreatorData];
  
  if (!creator) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
          <Button onClick={() => navigate("/dashboard/creators")}>
            Back to Creators
          </Button>
        </div>
      </div>
    );
  }

  const handleMessageCreator = () => {
    toast.success(`Opening message with ${creator.name}`);
    navigate("/dashboard/messages", { 
      state: { 
        creatorId: creator.id, 
        creatorName: creator.name,
        initiateMessage: true 
      } 
    });
  };

  const handleFollowCreator = () => {
    toast.success(`Following ${creator.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/dashboard/explore")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Explore
          </Button>
        </div>
      </div>

      <div className="container py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="glass-card mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="text-2xl">{creator.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">{creator.name}</h1>
                    {creator.isVerified && (
                      <Badge variant="default" className="bg-blue-500">
                        <Star className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{creator.username}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {creator.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {creator.joinDate}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{creator.metrics.totalCampaigns}</div>
                    <div className="text-sm text-muted-foreground">Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">${(creator.metrics.totalEarnings / 1000).toFixed(1)}k</div>
                    <div className="text-sm text-muted-foreground">Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">${(creator.metrics.totalGmv / 1000).toFixed(1)}k</div>
                    <div className="text-sm text-muted-foreground">GMV</div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <p className="text-sm leading-relaxed">{creator.bio}</p>
                </div>

                {/* Platforms */}
                <div className="space-y-2">
                  <h3 className="font-medium">Platforms</h3>
                  <div className="flex gap-3">
                    {creator.platforms.map(platform => (
                      <div key={platform} className="flex items-center gap-2 bg-secondary/50 px-3 py-2 rounded-full">
                        <SocialIcon platform={platform} />
                        <span className="text-sm font-medium">
                          {creator.followers[platform as keyof typeof creator.followers]?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <h3 className="font-medium">Categories</h3>
                  <div className="flex gap-2 flex-wrap">
                    {creator.categories.map(category => (
                      <Badge key={category} variant="outline">{category}</Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button onClick={handleMessageCreator} className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" onClick={handleFollowCreator}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-2xl font-bold">{creator.metrics.avgEngagementRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Creator Rating</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">{creator.metrics.rating}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(creator.metrics.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-2xl font-bold">
                    {Object.values(creator.followers).reduce((sum, count) => sum + count, 0).toLocaleString()}
                  </p>
                </div>
                <UserPlus className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Tabs */}
        <Card className="glass-card">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="showcase">Showcase</TabsTrigger>
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="showcase" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {creator.recentWork.map(work => (
                    <Card key={work.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img 
                          src={work.thumbnail} 
                          alt={work.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/70 p-1 rounded-full">
                            <SocialIcon platform={work.platform} />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{work.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {work.views.toLocaleString()} views
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="space-y-4">
                {creator.testimonials.map((testimonial, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-medium">{testimonial.brand}</h4>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{testimonial.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">Detailed Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Contact {creator.name} to discuss detailed performance metrics and campaign analytics.
                  </p>
                  <Button onClick={handleMessageCreator}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Analytics
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
