
import React from "react";
import { ChallengeCampaign, Platform, PLATFORMS } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PlatformSelector from "@/components/PlatformSelector";
import { DatePicker } from "@/components/ui/date-picker";

interface ChallengeFormProps {
  campaign: Partial<ChallengeCampaign>;
  onChange: (updatedCampaign: Partial<ChallengeCampaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const ChallengeForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: ChallengeFormProps) => {
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
            <Label htmlFor="submissionDeadline">Submission Deadline</Label>
            <DatePicker
              id="submissionDeadline"
              date={campaign.submissionDeadline ? new Date(campaign.submissionDeadline) : undefined}
              onSelect={(date) => onChange({ submissionDeadline: date })}
              placeholder="Select deadline"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prizeAmount">Prize Amount</Label>
            <Input
              id="prizeAmount"
              type="number"
              min="0"
              value={campaign.prizeAmount || ""}
              onChange={(e) => onChange({ prizeAmount: Number(e.target.value) })}
              placeholder="Prize amount per winner"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="winnersCount">Number of Winners</Label>
            <Input
              id="winnersCount"
              type="number"
              min="1"
              value={campaign.winnersCount || ""}
              onChange={(e) => onChange({ winnersCount: Number(e.target.value) })}
              placeholder="How many winners"
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
            <Label htmlFor="description">Challenge Description</Label>
            <textarea
              id="description"
              className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background"
              value={campaign.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell creators about your challenge"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeForm;
