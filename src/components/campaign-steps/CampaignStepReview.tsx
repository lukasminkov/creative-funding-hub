import { Campaign, formatCurrency, getDaysLeft, getCountryLabel } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Target, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CampaignFormErrors } from "@/lib/campaign-validation";

interface CampaignStepReviewProps {
  campaign: Campaign;
  errors?: CampaignFormErrors;
}

export default function CampaignStepReview({ campaign, errors = {} }: CampaignStepReviewProps) {
  const hasErrors = Object.keys(errors).length > 0;
  const daysLeft = getDaysLeft(new Date(campaign.endDate));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Review Your Campaign</h3>
        <p className="text-muted-foreground">
          Double-check everything before launching your campaign
        </p>
      </div>

      {hasErrors && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors before launching:
            <ul className="mt-2 list-disc list-inside">
              {Object.entries(errors).map(([field, error]) => (
                <li key={field} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Campaign Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg">{campaign.title}</h4>
              <p className="text-muted-foreground mt-1">{campaign.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{campaign.type}</Badge>
              <Badge variant="outline">{campaign.contentType}</Badge>
              <Badge variant="outline">{campaign.category}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Budget:</span>
                <span className="font-semibold">{formatCurrency(campaign.totalBudget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{daysLeft} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Date:</span>
                <span>{new Date(campaign.endDate).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Region:</span>
                <span>{getCountryLabel(campaign.countryAvailability)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platforms:</span>
                <div className="flex flex-wrap gap-1">
                  {campaign.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {campaign.requirements && campaign.requirements.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {campaign.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {requirement}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
