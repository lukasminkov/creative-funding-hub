
import { motion } from "framer-motion";
import { Campaign, formatCurrency, getDaysLeft } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, CheckCircle, ChevronRight, TrendingUp, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface CampaignPreviewProps {
  campaign: Partial<Campaign>;
}

const CampaignPreview = ({ campaign }: CampaignPreviewProps) => {
  const daysLeft = campaign.endDate ? getDaysLeft(campaign.endDate) : 0;
  const isPPV = campaign.type === "payPerView";
  const isRetainer = campaign.type === "retainer";
  const isChallenge = campaign.type === "challenge";
  
  const getApplicationDate = () => {
    if (isRetainer && campaign.type === "retainer" && campaign.applicationDeadline) {
      return format(campaign.applicationDeadline, "MMMM do, yyyy");
    }
    return "";
  };

  const formatPlatforms = () => {
    if (!campaign.platforms || campaign.platforms.length === 0) return "";
    
    const platform = campaign.platforms[0];
    let icon;
    
    switch (platform) {
      case "TikTok":
      case "TikTok Shop":
        icon = "𝕏";
        break;
      case "Instagram Reels":
        icon = "📸";
        break;
      case "Twitter":
        icon = "𝕏";
        break;
      case "YouTube Shorts":
        icon = "▶️";
        break;
      default:
        icon = "";
    }
    
    return `${icon} ${platform}`;
  };

  const getPayout = () => {
    if (isPPV && campaign.type === "payPerView") {
      return `$${campaign.ratePerThousand || 0} Per 1000 Views`;
    } else if (isRetainer && campaign.totalBudget) {
      return `${formatCurrency(campaign.totalBudget, campaign.currency)} Budget`;
    } else if (isChallenge && campaign.type === "challenge" && campaign.prizePool) {
      const totalPrize = campaign.prizePool.places.reduce((sum, place) => sum + place.prize, 0);
      return `${formatCurrency(totalPrize, campaign.currency)} Prize Pool`;
    }
    return "";
  };

  const budget = campaign.totalBudget || 0;
  const claimed = 0; // This would be dynamic in a real app
  const percentClaimed = budget > 0 ? (claimed / budget) * 100 : 0;

  return (
    <div className="h-full">
      <Card className="h-full border border-border shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/60 py-3 px-4">
          <CardTitle className="text-sm font-normal flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground">9:41</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-xs">●●●</span>
              <span className="text-xs">📶</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-black text-white">
          <div className="relative">
            {/* Mobile App Style Preview */}
            <div className="mobile-preview">
              {/* Header with Back Button and Campaign Type */}
              <div className="p-3 flex justify-between items-center">
                <Button variant="ghost" size="icon" className="rounded-full bg-black/50 text-white h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Badge className="bg-red-500 text-white border-none font-medium">
                  {campaign.type === "payPerView" 
                    ? "Payper View" 
                    : campaign.type === "retainer" 
                      ? "Retainer" 
                      : "Challenge"}
                </Badge>
              </div>
              
              {/* Banner Image */}
              <div 
                className="w-full h-48 relative flex items-end" 
                style={{
                  backgroundImage: campaign.bannerImage 
                    ? `url(${campaign.bannerImage})` 
                    : 'linear-gradient(to bottom, #3490dc, #6574cd)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Brand and Payout */}
                <div className="absolute top-1/3 left-4 flex flex-col space-y-2 z-10">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 bg-black flex items-center justify-center rounded-md">
                      <span className="text-white font-bold">
                        {campaign.title 
                          ? campaign.title.charAt(0) 
                          : "A"}
                      </span>
                    </div>
                    <span className="text-white font-medium">
                      {campaign.title 
                        ? campaign.title.split(' ')[0] 
                        : "Brand Name"}
                    </span>
                  </div>
                  
                  <Badge className="bg-black/60 text-white border-none self-start py-1 px-2">
                    {isPPV && campaign.type === "payPerView" 
                      ? `$${campaign.ratePerThousand || 2} Per 1000 Views` 
                      : getPayout()}
                  </Badge>
                </div>
              </div>
              
              {/* Campaign Title */}
              <div className="p-4 bg-black">
                <h2 className="text-xl font-bold text-white mb-1">
                  {campaign.title || "Campaign for new product"}
                </h2>
                
                {/* Campaign Meta Information */}
                <div className="flex justify-between text-xs text-gray-400 mb-3">
                  <div className="flex flex-col">
                    <span>{getApplicationDate() || "March 28th, 2025"}</span>
                    <span>Application Deadline</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span>{campaign.contentType || "Video"}</span>
                    <span>Type</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span>{formatPlatforms() || "TikTok"}</span>
                    <span>Platforms</span>
                  </div>
                </div>
                
                {/* Budget Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{formatCurrency(claimed, campaign.currency)} / {formatCurrency(budget, campaign.currency)} Claimed</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${percentClaimed}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">
                    {campaign.description || "Create an engaging video showcasing the new product. We are looking for authentic content that highlights both the comfort and style aspects of our latest collection."}
                  </p>
                </div>
                
                {/* Guidelines */}
                {isRetainer && campaign.type === "retainer" && campaign.guidelines && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Brand Guidelines:</h3>
                    <div className="space-y-2">
                      {campaign.guidelines.dos.map((guideline, index) => (
                        <div key={`do-${index}`} className="bg-gray-800 rounded p-2 text-sm">
                          {guideline}
                        </div>
                      ))}
                      {campaign.guidelines.donts.map((guideline, index) => (
                        <div key={`dont-${index}`} className="bg-gray-800 rounded p-2 text-sm">
                          {guideline}
                        </div>
                      ))}
                      {campaign.guidelines.dos.length === 0 && campaign.guidelines.donts.length === 0 && (
                        <div className="bg-gray-800 rounded p-2 text-sm">
                          Submit As Many Clips As You Want
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Requirements */}
                {isRetainer && campaign.type === "retainer" && campaign.requirements && campaign.requirements.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Requirements:</h3>
                    <div className="space-y-2">
                      {campaign.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          <p className="text-sm text-gray-300">{req}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Payouts */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Payouts</h3>
                  <p className="text-gray-300 text-sm mb-1">
                    Must adhere to guidelines to get approved for a payout.
                  </p>
                  <p className="text-gray-300 text-sm">
                    You can post/submit as many videos as you want.
                  </p>
                </div>
                
                {/* Apply Button */}
                <div className="bg-white text-black rounded-lg p-4 flex justify-between items-center">
                  <span className="font-semibold">Swipe to apply</span>
                  <div className="flex items-center">
                    <ChevronRight className="h-5 w-5" />
                    <ChevronRight className="h-5 w-5 -ml-2" />
                    <ChevronRight className="h-5 w-5 -ml-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignPreview;
