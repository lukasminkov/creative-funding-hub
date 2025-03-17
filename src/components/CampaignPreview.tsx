
import { Campaign, formatCurrency, getDaysLeft, TikTokShopCommission } from "@/lib/campaign-types";

interface CampaignPreviewProps {
  campaign: Partial<Campaign>;
}

const CampaignPreview = ({ campaign }: CampaignPreviewProps) => {
  if (!campaign.title) {
    return (
      <div className="sticky top-20 w-full bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-6">Campaign Preview</h2>
        <div className="text-muted-foreground text-center py-12">
          Enter campaign details to see a preview
        </div>
      </div>
    );
  }

  const hasTikTokShop = campaign.platforms?.includes("TikTok Shop");

  return (
    <div className="sticky top-20 w-full bg-card border border-border rounded-lg overflow-hidden shadow-sm">
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
        <div className="p-6 border-b border-border/60">
          <h2 className="text-2xl font-medium">{campaign.title}</h2>
          <p className="text-muted-foreground mt-1">
            {campaign.type && campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
          </p>
        </div>
      )}
      
      <div className="p-6">
        {campaign.description && (
          <p className="text-sm mb-6">{campaign.description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {campaign.contentType && (
            <div>
              <p className="text-sm text-muted-foreground">Content Type</p>
              <p className="font-medium">{campaign.contentType}</p>
            </div>
          )}
          
          {campaign.category && (
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{campaign.category}</p>
            </div>
          )}
          
          {campaign.totalBudget && campaign.currency && (
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
            </div>
          )}
          
          {campaign.endDate && (
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p className="font-medium">{campaign.endDate.toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {getDaysLeft(campaign.endDate)} days left
              </p>
            </div>
          )}
        </div>
        
        {campaign.platforms && campaign.platforms.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {campaign.platforms.map((platform) => (
                <span 
                  key={platform}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {hasTikTokShop && campaign.tikTokShopCommission && (
          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium mb-2">TikTok Shop Commission</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Open Collab</p>
                <p className="font-medium">{campaign.tikTokShopCommission.openCollabCommission}%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Increased</p>
                <p className="font-medium">{campaign.tikTokShopCommission.increasedCommission}%</p>
              </div>
            </div>
          </div>
        )}
        
        {campaign.type === "retainer" && campaign.creatorTiers && campaign.creatorTiers.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Creator Tiers</p>
            <div className="space-y-2">
              {campaign.creatorTiers.map((tier, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-medium">{tier.name}</span>
                  <span>{formatCurrency(tier.price, campaign.currency)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {campaign.type === "payPerView" && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Pay Per View</p>
            <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg">
              {campaign.ratePerThousand !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Rate per 1k Views</p>
                  <p className="font-medium">
                    {formatCurrency(campaign.ratePerThousand, campaign.currency)}
                  </p>
                </div>
              )}
              {campaign.maxPayoutPerSubmission !== undefined && (
                <div>
                  <p className="text-xs text-muted-foreground">Max per Submission</p>
                  <p className="font-medium">
                    {formatCurrency(campaign.maxPayoutPerSubmission, campaign.currency)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {campaign.type === "challenge" && campaign.prizePool && campaign.prizePool.places && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Prize Pool</p>
            <div className="space-y-2">
              {campaign.prizePool.places.slice(0, 3).map((place) => (
                <div key={place.position} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                  <span className="font-medium">{place.position}{getOrdinal(place.position)} Place</span>
                  <span>{formatCurrency(place.prize, campaign.currency)}</span>
                </div>
              ))}
              {campaign.prizePool.places.length > 3 && (
                <p className="text-xs text-muted-foreground text-right">
                  +{campaign.prizePool.places.length - 3} more prize places
                </p>
              )}
            </div>
          </div>
        )}
        
        {campaign.guidelines && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">Guidelines</p>
            
            {campaign.guidelines.dos && campaign.guidelines.dos.length > 0 && (
              <div className="mb-2">
                <p className="text-xs font-medium text-green-600 mb-1">Do's</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {campaign.guidelines.dos.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">Don'ts</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {campaign.guidelines.donts.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {campaign.trackingLink && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              {hasTikTokShop ? "TAP Link" : "Tracking Link"}
            </p>
            <a 
              href={campaign.trackingLink.startsWith('http') ? campaign.trackingLink : `https://${campaign.trackingLink}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline text-sm break-all"
            >
              {campaign.trackingLink}
            </a>
          </div>
        )}
        
        {campaign.requestedTrackingLink && (
          <div className="p-3 bg-muted/30 rounded-lg text-sm mb-6">
            <p className="text-muted-foreground">
              {hasTikTokShop ? "TAP link will be provided by Payper" : "Tracking link will be provided by Payper"}
            </p>
          </div>
        )}
      </div>
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
