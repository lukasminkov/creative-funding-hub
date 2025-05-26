
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import CampaignCard from "./CampaignCard";

interface CampaignsTabProps {
  isLoading: boolean;
  featuredCampaigns: any[];
  regularCampaigns: any[];
}

export default function CampaignsTab({ isLoading, featuredCampaigns, regularCampaigns }: CampaignsTabProps) {
  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="space-y-8">
      {/* Featured Campaigns */}
      {featuredCampaigns.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-semibold">Featured Campaigns</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} isFeatured={true} />
            ))}
          </div>
        </div>
      )}

      {/* All Campaigns */}
      <div>
        <h3 className="text-xl font-semibold mb-4">All Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularCampaigns.map((campaign: any) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
        {regularCampaigns.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No campaigns found</p>
          </div>
        )}
      </div>
    </div>
  );
}
