
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/lib/campaign-types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

export default function ExplorePage() {
  // For demo purposes, we'll simulate discovering other campaigns
  const { data: discoveredCampaigns = [], isLoading } = useQuery({
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
        },
        {
          id: "disc-4",
          title: "Tech Unboxing Series",
          brandName: "TechZone",
          type: "retainer",
          contentType: "UGC",
          totalBudget: 8000,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=3870&auto=format&fit=crop",
          platforms: ["YouTube Shorts", "TikTok"]
        },
        {
          id: "disc-5",
          title: "Skincare Transformation",
          brandName: "GlowUp Beauty",
          type: "payPerView",
          contentType: "UGC",
          totalBudget: 4500,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=3870&auto=format&fit=crop",
          platforms: ["Instagram Reels", "TikTok"]
        },
        {
          id: "disc-6",
          title: "Home Decor Ideas",
          brandName: "Modern Living",
          type: "challenge",
          contentType: "UGC",
          totalBudget: 3500,
          currency: "USD",
          bannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=3776&auto=format&fit=crop",
          platforms: ["Instagram Reels", "TikTok"]
        }
      ];
    }
  });

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Explore Campaigns</h2>
        <p className="text-muted-foreground">
          Discover campaigns from other brands on the platform
        </p>
      </div>

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
    </div>
  );
}
