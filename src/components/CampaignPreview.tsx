
import { Campaign, formatCurrency, getDaysLeft } from "@/lib/campaign-types";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  
  // Calculate payout range for retainer campaigns
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

  return (
    <div className="sticky top-20 w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm max-h-[calc(100vh-120px)]">
      <ScrollArea className="h-[calc(100vh-120px)]">
        {/* Banner and Title */}
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
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-medium text-gray-800">{campaign.title}</h2>
            <p className="text-gray-500 mt-1">
              {campaign.type && campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
            </p>
          </div>
        )}
        
        <div className="p-6">
          {/* Description */}
          {campaign.description && (
            <p className="text-sm text-gray-700 mb-6">{campaign.description}</p>
          )}
          
          {/* Key Details */}
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
            
            {/* For non-retainer campaigns, show budget */}
            {campaign.type !== "retainer" && campaign.totalBudget && campaign.currency && (
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p className="font-medium text-gray-800">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
              </div>
            )}
            
            {/* For retainer campaigns, show payout range */}
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
          </div>
          
          {/* Platforms */}
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
          
          {/* TikTok Shop Commission */}
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
          
          {/* Retainer Specific */}
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
          
          {/* Pay Per View Specific */}
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
          
          {/* Challenge Specific */}
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
          
          {/* Guidelines */}
          {campaign.guidelines && (
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Guidelines</p>
              
              {campaign.guidelines.dos && campaign.guidelines.dos.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-green-600 mb-1">Do's</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    {campaign.guidelines.dos.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-red-600 mb-1">Don'ts</p>
                  <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                    {campaign.guidelines.donts.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {/* Tracking Link */}
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
          
          {/* Requested Tracking Link */}
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

// Helper function to get ordinal suffix
function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}

export default CampaignPreview;
