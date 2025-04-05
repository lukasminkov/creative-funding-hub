
import React from "react";
import { PayPerViewCampaign, Platform, PLATFORMS } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlatformSelector from "@/components/PlatformSelector";

interface PayPerViewFormProps {
  campaign: Partial<PayPerViewCampaign>;
  onChange: (updatedCampaign: Partial<PayPerViewCampaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const PayPerViewForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: PayPerViewFormProps) => {
  const handlePlatformChange = (platform: string) => {
    const platformValue = platform as Platform;
    const currentPlatforms = [...(campaign.platforms || [])];
    
    if (currentPlatforms.includes(platformValue)) {
      onChange({
        platforms: currentPlatforms.filter(p => p !== platformValue),
      });
    } else {
      onChange({
        platforms: [...currentPlatforms, platformValue],
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={campaign.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter a title for your campaign"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalBudget">Total Budget</Label>
            <Input
              id="totalBudget"
              type="number"
              min="0"
              value={campaign.totalBudget || ""}
              onChange={(e) => onChange({ totalBudget: Number(e.target.value) })}
              placeholder="Campaign budget"
              disabled={disableBudgetEdit}
              className={disableBudgetEdit ? "bg-muted cursor-not-allowed" : ""}
            />
            {disableBudgetEdit && (
              <p className="text-xs text-muted-foreground mt-1">
                Budget can only be increased using the "Add Budget" button
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ratePerThousand">Rate per 1,000 Views</Label>
            <Input
              id="ratePerThousand"
              type="number"
              min="0"
              step="0.01"
              value={campaign.ratePerThousand || ""}
              onChange={(e) => onChange({ ratePerThousand: Number(e.target.value) })}
              placeholder="Amount per 1k views"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPayoutPerSubmission">Max Payout per Submission</Label>
            <Input
              id="maxPayoutPerSubmission"
              type="number"
              min="0"
              value={campaign.maxPayoutPerSubmission || ""}
              onChange={(e) => onChange({ maxPayoutPerSubmission: Number(e.target.value) })}
              placeholder="Maximum amount per submission"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <PlatformSelector
              selectedPlatforms={campaign.platforms as Platform[]}
              onChange={handlePlatformChange}
            />
          </div>
        </div>
      )}
      
      {showCreatorInfoSection && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
              value={campaign.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell creators about your campaign"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contentRequirements">Content Requirements</Label>
            <textarea
              id="contentRequirements"
              className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
              value={campaign.contentRequirements || ""}
              onChange={(e) => onChange({ contentRequirements: e.target.value })}
              placeholder="Describe what you want creators to include in their content"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="viewValidationPeriod">View Validation Period (days)</Label>
            <Input
              id="viewValidationPeriod"
              type="number"
              min="1"
              value={campaign.viewValidationPeriod || ""}
              onChange={(e) => onChange({ viewValidationPeriod: Number(e.target.value) })}
              placeholder="Days to count views"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Number of days to count views after content is published
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPerViewForm;
