
import { Campaign, formatCurrency } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Eye, Users, MapPin, Tag, Video, Trophy } from "lucide-react";

interface CampaignStepReviewProps {
  campaign: Campaign;
}

export default function CampaignStepReview({ campaign }: CampaignStepReviewProps) {
  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case "retainer": return "Retainer";
      case "payPerView": return "Pay Per View";
      case "challenge": return "Challenge";
      default: return type;
    }
  };

  const getTotalPrizeAllocation = () => {
    if (campaign.type === "challenge") {
      if (campaign.prizeDistributionType === "custom" && campaign.prizePool?.places) {
        return campaign.prizePool.places.reduce((sum, place) => sum + place.prize, 0);
      } else if (campaign.prizeDistributionType === "equal" || !campaign.prizeDistributionType) {
        return (campaign.prizeAmount || 0) * (campaign.winnersCount || 1);
      }
    }
    return 0;
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Review Your Campaign</h3>
        <p className="text-muted-foreground">
          Please review all details before launching your campaign
        </p>
      </div>

      {/* Campaign Banner Preview */}
      {campaign.bannerImage && (
        <Card className="border-border/50 overflow-hidden">
          <div className="h-40 relative">
            <img 
              src={campaign.bannerImage} 
              alt={campaign.title} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4">
              <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
              <Badge className="mt-1 bg-white/20 text-white border-white/30">
                {getCampaignTypeLabel(campaign.type)}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      {/* Basic Information */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-lg">{campaign.title}</h4>
            <p className="text-muted-foreground mt-1">{campaign.description}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="font-medium">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-medium">{campaign.category}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Content Type</p>
                <p className="font-medium">{campaign.contentType}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Availability</p>
                <p className="font-medium">{campaign.countryAvailability}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platforms */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {campaign.platforms?.map((platform) => (
              <Badge key={platform} variant="outline" className="px-3 py-1">
                {platform}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Type-specific Details */}
      {campaign.type === "payPerView" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Pay Per View Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate per 1,000 views:</span>
              <span className="font-medium">${campaign.ratePerThousand?.toFixed(4)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max payout per submission:</span>
              <span className="font-medium">
                {campaign.maxPayoutPerSubmission === null 
                  ? "Unlimited" 
                  : formatCurrency(campaign.maxPayoutPerSubmission || 0, campaign.currency)
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">View validation period:</span>
              <span className="font-medium">10 days (app standard)</span>
            </div>
            {campaign.contentRequirements && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground mb-1">Content Requirements:</p>
                <p className="text-sm">{campaign.contentRequirements}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {campaign.type === "challenge" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Challenge Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prize Distribution Summary */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distribution type:</span>
                <span className="font-medium capitalize">
                  {campaign.prizeDistributionType === "custom" ? "Custom distribution" : "Equal distribution"}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total prize pool:</span>
                <span className="font-medium">{formatCurrency(getTotalPrizeAllocation(), campaign.currency)}</span>
              </div>
              
              {campaign.submissionDeadline && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submission deadline:</span>
                  <span className="font-medium">{new Date(campaign.submissionDeadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Prize Breakdown */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Prize Breakdown:</p>
              {campaign.prizeDistributionType === "custom" && campaign.prizePool?.places ? (
                <div className="space-y-2">
                  {campaign.prizePool.places.map((place) => (
                    <div key={place.position} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="font-medium">
                        {place.position === 1 ? '1st Place' : 
                         place.position === 2 ? '2nd Place' : 
                         place.position === 3 ? '3rd Place' : 
                         `${place.position}th Place`}
                      </span>
                      <span className="font-medium">{formatCurrency(place.prize, campaign.currency)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prize per winner:</span>
                    <span className="font-medium">{formatCurrency(campaign.prizeAmount || 0, campaign.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Number of winners:</span>
                    <span className="font-medium">{campaign.winnersCount || 1}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Budget Allocation Warning */}
            {getTotalPrizeAllocation() > campaign.totalBudget && (
              <div className="border-t pt-4">
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-sm text-destructive font-medium">
                    ⚠️ Prize allocation exceeds campaign budget by {formatCurrency(getTotalPrizeAllocation() - campaign.totalBudget, campaign.currency)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {campaign.type === "retainer" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Retainer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.applicationDeadline && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Application deadline:</span>
                <span className="font-medium">{new Date(campaign.applicationDeadline).toLocaleDateString()}</span>
              </div>
            )}
            
            {/* Deliverables */}
            {getDeliverablesSummary() && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Deliverables:</p>
                <p className="text-sm text-muted-foreground">{getDeliverablesSummary()}</p>
              </div>
            )}
            
            {/* Creator Tiers */}
            {campaign.creatorTiers && campaign.creatorTiers.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Creator Tiers:</p>
                <div className="space-y-2">
                  {campaign.creatorTiers.map((tier, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                      <span className="font-medium">{tier.name}</span>
                      <span className="font-medium">{formatCurrency(tier.price, campaign.currency)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instruction Video */}
      {campaign.instructionVideo && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              Instruction Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <video 
                src={campaign.instructionVideo} 
                controls 
                className="w-full h-full object-cover"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {campaign.requirements && campaign.requirements.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {campaign.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <span className="text-sm">{requirement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Guidelines */}
      {(campaign.guidelines?.dos?.length || campaign.guidelines?.donts?.length) && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {campaign.guidelines?.dos && campaign.guidelines.dos.length > 0 && (
              <div>
                <h5 className="font-medium text-green-600 mb-2">✓ Do's</h5>
                <ul className="space-y-1">
                  {campaign.guidelines.dos.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {campaign.guidelines?.donts && campaign.guidelines.donts.length > 0 && (
              <div>
                <h5 className="font-medium text-red-600 mb-2">✗ Don'ts</h5>
                <ul className="space-y-1">
                  {campaign.guidelines.donts.map((item, index) => (
                    <li key={index} className="text-sm text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tracking Link */}
      {(campaign.trackingLink || campaign.requestedTrackingLink) && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Tracking Link</CardTitle>
          </CardHeader>
          <CardContent>
            {campaign.trackingLink ? (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Link URL:</p>
                <a 
                  href={campaign.trackingLink.startsWith('http') ? campaign.trackingLink : `https://${campaign.trackingLink}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {campaign.trackingLink}
                </a>
              </div>
            ) : campaign.requestedTrackingLink ? (
              <p className="text-sm text-muted-foreground">
                Tracking link will be requested from creators in their submissions
              </p>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
