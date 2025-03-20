
import { 
  Campaign, 
  formatCurrency, 
  getDaysLeft, 
  RetainerCampaign,
  PayPerViewCampaign,
  ChallengeCampaign,
} from "@/lib/campaign-types";
import { 
  Book, 
  Calendar, 
  CheckCircle, 
  FileText, 
  Link2, 
  ScrollText, 
  Video, 
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface AcceptedUserPreviewProps {
  campaign: Campaign;
}

const AcceptedUserPreview = ({ campaign }: AcceptedUserPreviewProps) => {
  if (!campaign.title) {
    return (
      <div className="w-full bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-6 text-gray-800">Creator View</h2>
        <div className="text-gray-500 text-center py-12">
          No campaign selected
        </div>
      </div>
    );
  }

  const hasTikTokShop = campaign.platforms?.includes("TikTok Shop");
  
  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Banner and Title Section */}
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
      
      {/* Instruction Video Section (high priority for accepted creators) */}
      {campaign.instructionVideo && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Video className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-gray-800">Instruction Video</h3>
          </div>
          <div className="aspect-video rounded-md overflow-hidden border">
            <video
              src={campaign.instructionVideo}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
      
      <div className="p-6">
        {/* Description */}
        {campaign.description && (
          <div className="mb-6">
            <p className="text-sm text-gray-700">{campaign.description}</p>
          </div>
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
          
          {campaign.endDate && (
            <div>
              <p className="text-sm text-gray-500">Campaign End</p>
              <p className="font-medium text-gray-800">{campaign.endDate.toLocaleDateString()}</p>
              <p className="text-xs text-gray-500">
                {getDaysLeft(campaign.endDate)} days left
              </p>
            </div>
          )}
          
          {campaign.type === "retainer" && (
            <div>
              <p className="text-sm text-gray-500">Payout Range</p>
              <p className="font-medium text-gray-800">
                {formatCurrency((campaign as RetainerCampaign).creatorTiers[0]?.price || 0, campaign.currency)} - 
                {formatCurrency(
                  (campaign as RetainerCampaign).creatorTiers[(campaign as RetainerCampaign).creatorTiers.length - 1]?.price || 0, 
                  campaign.currency
                )}
              </p>
            </div>
          )}
          
          {campaign.type === "payPerView" && (campaign as PayPerViewCampaign).ratePerThousand !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Rate per 1k Views</p>
              <p className="font-medium text-gray-800">
                {formatCurrency((campaign as PayPerViewCampaign).ratePerThousand, campaign.currency)}
              </p>
            </div>
          )}
          
          {campaign.type === "payPerView" && (campaign as PayPerViewCampaign).maxPayoutPerSubmission !== undefined && (
            <div>
              <p className="text-sm text-gray-500">Max per Submission</p>
              <p className="font-medium text-gray-800">
                {formatCurrency((campaign as PayPerViewCampaign).maxPayoutPerSubmission, campaign.currency)}
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
        
        {/* Retainer Campaign Specific */}
        {campaign.type === "retainer" && (
          <>
            {/* Deliverables */}
            {(campaign as RetainerCampaign).deliverables && (
              <Card className="mb-6 border-blue-100">
                <CardHeader className="pb-2">
                  <h3 className="text-sm font-medium text-blue-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Deliverables
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">{(campaign as RetainerCampaign).deliverables.videosPerDay}</span> videos per day</p>
                    <p>For <span className="font-medium">{(campaign as RetainerCampaign).deliverables.durationDays}</span> days</p>
                    <p className="font-medium">Total: {(campaign as RetainerCampaign).deliverables.videosPerDay * (campaign as RetainerCampaign).deliverables.durationDays} videos</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Tiers */}
            {(campaign as RetainerCampaign).creatorTiers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Creator Tiers</p>
                <div className="space-y-2">
                  {(campaign as RetainerCampaign).creatorTiers.map((tier, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="font-medium text-gray-800">{tier.name}</span>
                      <span className="text-gray-800">{formatCurrency(tier.price, campaign.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Requirements */}
            {(campaign as RetainerCampaign).requirements && (campaign as RetainerCampaign).requirements.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Requirements</p>
                <ul className="space-y-2">
                  {(campaign as RetainerCampaign).requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 bg-gray-50 p-2 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
        
        {/* Challenge Campaign Specific */}
        {campaign.type === "challenge" && (campaign as ChallengeCampaign).prizePool && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Prize Pool</p>
            <div className="space-y-2">
              {(campaign as ChallengeCampaign).prizePool.places.map((place) => (
                <div key={place.position} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium text-gray-800">{place.position}{getOrdinal(place.position)} Place</span>
                  <span className="text-gray-800">{formatCurrency(place.prize, campaign.currency)}</span>
                </div>
              ))}
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
                <ul className="space-y-1">
                  {campaign.guidelines.dos.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 bg-green-50 p-2 rounded-md">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-red-600 mb-1">Don'ts</p>
                <ul className="space-y-1">
                  {campaign.guidelines.donts.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 bg-red-50 p-2 rounded-md">
                      <XCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Brief */}
        {campaign.brief && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <ScrollText className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-gray-800">Campaign Brief</p>
            </div>
            
            {campaign.brief.type === 'link' ? (
              <a 
                href={campaign.brief.value}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline text-sm"
              >
                <Link2 className="h-4 w-4" />
                View Brief
              </a>
            ) : (
              <div className="flex items-center gap-2 text-gray-800 text-sm">
                <FileText className="h-4 w-4" />
                {campaign.brief.value}
              </div>
            )}
          </div>
        )}
        
        {/* Tracking Link */}
        {campaign.trackingLink && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-gray-800">
                {hasTikTokShop ? "TAP Link" : "Tracking Link"}
              </p>
            </div>
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
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4 text-primary" />
              <p className="text-gray-600">
                {hasTikTokShop ? "TAP link provided by Payper" : "Tracking link provided by Payper"}
              </p>
            </div>
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

export default AcceptedUserPreview;
