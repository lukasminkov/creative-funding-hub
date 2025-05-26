import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreSearchModal from "@/components/explore/ExploreSearchModal";
import ForYouFeed from "@/components/explore/ForYouFeed";
import CampaignsTab from "@/components/explore/CampaignsTab";
import CreatorsTab from "@/components/explore/CreatorsTab";

export default function ExplorePage() {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('ExplorePage mounting');
    // Add a small delay to simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // For demo purposes, we'll simulate discovering campaigns and creators
  const { data: discoveredCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['discover-campaigns'],
    queryFn: () => {
      console.log('Fetching discovered campaigns...');
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
      console.log('Fetching discovered creators...');
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

  const combinedLoading = isLoading || campaignsLoading || creatorsLoading;

  if (combinedLoading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Separate featured and regular campaigns
  const featuredCampaigns = discoveredCampaigns.filter((campaign: any) => campaign.featured);
  const regularCampaigns = discoveredCampaigns.filter((campaign: any) => !campaign.featured);

  // Separate top and regular creators
  const topCreators = discoveredCreators.filter((creator: any) => creator.isTop);
  const regularCreators = discoveredCreators.filter((creator: any) => !creator.isTop);

  // Create "For you" feed by mixing campaigns and creators
  const forYouFeed = [];
  const maxLength = Math.max(discoveredCampaigns.length, discoveredCreators.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (i < discoveredCampaigns.length) {
      forYouFeed.push({ ...discoveredCampaigns[i], itemType: 'campaign' });
    }
    if (i < discoveredCreators.length) {
      forYouFeed.push({ ...discoveredCreators[i], itemType: 'creator' });
    }
  }

  return (
    <div className="container py-8 relative">
      <ExploreHeader onSearchClick={() => setShowSearchModal(true)} />

      <Tabs defaultValue="for-you" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="for-you">For you</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="creators">Creators</TabsTrigger>
        </TabsList>

        <TabsContent value="for-you" className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Explore Content</h3>
            <p className="text-sm text-muted-foreground">
              Discover new campaigns and creators tailored for you
            </p>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Campaign Discovery</h3>
            <p className="text-sm text-muted-foreground">
              Find exciting campaigns to participate in
            </p>
          </div>
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium mb-2">Creator Network</h3>
            <p className="text-sm text-muted-foreground">
              Connect with top creators in your niche
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <ExploreSearchModal
        open={showSearchModal}
        onOpenChange={setShowSearchModal}
        campaigns={discoveredCampaigns}
        creators={discoveredCreators}
      />
    </div>
  );
}
