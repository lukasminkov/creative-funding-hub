import { Campaign, formatCurrency, getDaysLeft, getCountryLabel } from "@/lib/campaign-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, XCircle } from "lucide-react";
import DefaultCampaignBanner from "./DefaultCampaignBanner";

interface CampaignPreviewProps {
  campaign: Partial<Campaign>;
}

const CampaignPreview = ({ campaign }: CampaignPreviewProps) => {
  if (!campaign.title) {
    return (
      <div className="sticky top-20 w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-6 text-gray-800">Campaign Preview</h2>
        <div className="text-gray-500 text-center py-12">
          Enter campaign details to see a preview
        </div>
      </div>
    );
  }

  const hasTikTokShop = campaign.platforms?.includes("TikTok Shop");
  
  const getPayoutRange = () => {
    if (campaign.type === "retainer" && campaign.creatorTiers && campaign.creatorTiers.length > 0) {
      const prices = campaign.creatorTiers.map(tier => tier.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      if (minPrice === maxPrice) {
        return formatCurrency(minPrice, campaign.currency || "USD");
      }
      
      return `${formatCurrency(minPrice, campaign.currency || "USD")} - ${formatCurrency(maxPrice, campaign.currency || "USD")}`;
    }
    return null;
  };

  const getDeliverablesSummary = () => {
    if (campaign.type === "retainer" && campaign.deliverables) {
      if (campaign.deliverables.mode === "videosPerDay" && campaign.deliverables.videosPerDay && campaign.deliverables.durationDays) {
        return `${campaign.deliverables.videosPerDay} videos per day for ${campaign.deliverables.durationDays} days (${campaign.deliverables.videosPerDay * campaign.deliverables.durationDays} total)`;
      } else if (campaign.deliverables.mode === "totalVideos" && campaign.deliverables.totalVideos) {
        return `${campaign.deliverables.totalVideos} total videos`;
      }
    }
    return null;
  };

  return (
    <div className="sticky top-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[calc(100vh-120px)]">
      <ScrollArea className="h-[calc(100vh-120px)]">
        {campaign.bannerImage ? (
          <div className="h-48 relative">
            <img 
              src={campaign.bannerImage} 
              alt={campaign.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6">
              <h2 className="text-2xl font-medium text-white">{campaign.title}</h2>
              <p className="text-white/80 mt-1">
                {campaign.type && campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
              </p>
            </div>
          </div>
        ) : (
          <DefaultCampaignBanner 
            title={campaign.title} 
            type={campaign.type || "campaign"}
            className="h-48"
          />
        )}
        
        <div className="p-6">
          {campaign.description && (
            <p className="text-sm text-gray-700 mb-6">{campaign.description}</p>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            {campaign.contentType && (
              <div>
                <p className="text-sm text-gray-500">Content Type</p>
                <p className="font-medium text-gray-800">{campaign.contentType}</p>
              </div>
            )}
            
            {campaign.category && (
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-800">{campaign.category}</p>
              </div>
            )}
            
            {campaign.type !== "retainer" && campaign.totalBudget && campaign.currency && (
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium text-gray-800">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
              </div>
            )}
            
            {campaign.type === "retainer" && getPayoutRange() && (
              <div>
                <p className="text-sm text-gray-500">Payout Range</p>
                <p className="font-medium text-gray-800">{getPayoutRange()}</p>
              </div>
            )}
            
            {campaign.endDate && (
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium text-gray-800">{campaign.endDate.toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">
                  {getDaysLeft(campaign.endDate)} days left
                </p>
              </div>
            )}
            
            {campaign.countryAvailability && (
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium text-gray-800">{getCountryLabel(campaign.countryAvailability)}</p>
              </div>
            )}
          </div>
          
          {campaign.platforms && campaign.platforms.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Platforms</p>
              <div className="flex flex-wrap gap-2">
                {campaign.platforms.map((platform) => (
                  <span 
                    key={platform}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Guidelines section */}
          {campaign.guidelines && (campaign.guidelines.dos?.length > 0 || campaign.guidelines.donts?.length > 0) && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Guidelines</p>
              
              <div className="space-y-3">
                {campaign.guidelines.dos && campaign.guidelines.dos.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-green-800 flex items-center mb-2">
                      <CheckCircle className="h-4 w-4 mr-1.5" /> Do's
                    </p>
                    <ul className="space-y-1.5">
                      {campaign.guidelines.dos.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex">
                          <span className="text-green-500 mr-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-red-800 flex items-center mb-2">
                      <XCircle className="h-4 w-4 mr-1.5" /> Don'ts
                    </p>
                    <ul className="space-y-1.5">
                      {campaign.guidelines.donts.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex">
                          <span className="text-red-500 mr-1.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Deliverables section */}
          {campaign.type === "retainer" && getDeliverablesSummary() && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Deliverables</p>
              <p className="font-medium text-gray-800">{getDeliverablesSummary()}</p>
            </div>
          )}
          
          {hasTikTokShop && campaign.tikTokShopCommission && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">TikTok Shop Commission</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Open Collab</p>
                  <p className="font-medium text-gray-800">{campaign.tikTokShopCommission.openCollabCommission}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Increased</p>
                  <p className="font-medium text-gray-800">{campaign.tikTokShopCommission.increasedCommission}%</p>
                </div>
              </div>
            </div>
          )}
          
          {campaign.type === "retainer" && campaign.creatorTiers && campaign.creatorTiers.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Creator Tiers</p>
              <div className="space-y-2">
                {campaign.creatorTiers.map((tier, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">{tier.name}</span>
                    <span className="text-gray-800">{formatCurrency(tier.price, campaign.currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {campaign.type === "payPerView" && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Pay Per View</p>
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                {campaign.ratePerThousand !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500">Rate per 1k Views</p>
                    <p className="font-medium text-gray-800">
                      {formatCurrency(campaign.ratePerThousand, campaign.currency)}
                    </p>
                  </div>
                )}
                {campaign.maxPayoutPerSubmission !== undefined && (
                  <div>
                    <p className="text-xs text-gray-500">Max per Submission</p>
                    <p className="font-medium text-gray-800">
                      {formatCurrency(campaign.maxPayoutPerSubmission, campaign.currency)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {campaign.type === "challenge" && campaign.prizePool && campaign.prizePool.places && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Prize Pool</p>
              <div className="space-y-2">
                {campaign.prizePool.places.slice(0, 3).map((place) => (
                  <div key={place.position} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium text-gray-800">{place.position}{getOrdinal(place.position)} Place</span>
                    <span className="text-gray-800">{formatCurrency(place.prize, campaign.currency)}</span>
                  </div>
                ))}
                {campaign.prizePool.places.length > 3 && (
                  <p className="text-xs text-gray-500 text-right">
                    +{campaign.prizePool.places.length - 3} more prize places
                  </p>
                )}
              </div>
            </div>
          )}
          
          {campaign.trackingLink && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                {hasTikTokShop ? "TAP Link" : "Tracking Link"}
              </p>
              <a 
                href={campaign.trackingLink.startsWith('http') ? campaign.trackingLink : `https://${campaign.trackingLink}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm break-all"
              >
                {campaign.trackingLink}
              </a>
            </div>
          )}
          
          {campaign.requestedTrackingLink && (
            <div className="p-3 bg-gray-50 rounded-lg text-sm mb-6">
              <p className="text-gray-600">
                {hasTikTokShop ? "TAP link will be provided by Payper" : "Tracking link will be provided by Payper"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

export default CampaignPreview;
