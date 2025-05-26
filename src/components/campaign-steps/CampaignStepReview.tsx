
import { Campaign, formatCurrency } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Eye, Users, MapPin, Tag } from "lucide-react";

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
              <span className="font-medium">{formatCurrency(campaign.maxPayoutPerSubmission || 0, campaign.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">View validation period:</span>
              <span className="font-medium">{campaign.viewValidationPeriod} days</span>
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.type === "challenge" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Challenge Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prize amount:</span>
              <span className="font-medium">{formatCurrency(campaign.prizeAmount || 0, campaign.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number of winners:</span>
              <span className="font-medium">{campaign.winnersCount}</span>
            </div>
            {campaign.submissionDeadline && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Submission deadline:</span>
                <span className="font-medium">{new Date(campaign.submissionDeadline).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {campaign.type === "retainer" && campaign.applicationDeadline && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Retainer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Application deadline:</span>
              <span className="font-medium">{new Date(campaign.applicationDeadline).toLocaleDateString()}</span>
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
    </div>
  );
}
