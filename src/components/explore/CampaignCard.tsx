
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface CampaignCardProps {
  campaign: any;
  isFeatured?: boolean;
}

export default function CampaignCard({ campaign, isFeatured = false }: CampaignCardProps) {
  return (
    <Card className={`overflow-hidden ${isFeatured ? 'border-2 border-yellow-400 shadow-lg' : ''}`}>
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
}
