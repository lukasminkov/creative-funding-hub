
import React from "react";
import { ChallengeCampaign, Platform } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PlatformSelector from "@/components/PlatformSelector";
import { DatePicker } from "@/components/ui/date-picker";
import { FormItem } from "@/components/ui/form";

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
            <Label htmlFor="title">
              Campaign Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={campaign.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter a title for your campaign"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalBudget">
              Total Budget <span className="text-destructive">*</span>
            </Label>
            <Input
              id="totalBudget"
              type="number"
              min="0"
              value={campaign.totalBudget || ""}
              onChange={(e) => onChange({ totalBudget: Number(e.target.value) })}
              placeholder="Campaign budget"
              disabled={disableBudgetEdit}
              className={disableBudgetEdit ? "bg-muted cursor-not-allowed" : ""}
              required
            />
            {disableBudgetEdit && (
              <p className="text-xs text-muted-foreground mt-1">
                Budget can only be increased using the "Add Budget" button
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prizeAmount">
              Prize Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="prizeAmount"
              type="number"
              min="0"
              value={campaign.prizeAmount || ""}
              onChange={(e) => onChange({ prizeAmount: Number(e.target.value) })}
              placeholder="Prize amount per winner"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="winnersCount">
              Number of Winners <span className="text-destructive">*</span>
            </Label>
            <Input
              id="winnersCount"
              type="number"
              min="1"
              value={campaign.winnersCount || ""}
              onChange={(e) => onChange({ winnersCount: Number(e.target.value) })}
              placeholder="How many winners"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="submissionDeadline">
              Submission Deadline <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              id="submissionDeadline"
              date={campaign.submissionDeadline ? new Date(campaign.submissionDeadline) : undefined}
              onSelect={(date) => onChange({ submissionDeadline: date })}
              placeholder="Select deadline"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label>
              Platforms <span className="text-destructive">*</span>
            </Label>
            <PlatformSelector
              selectedPlatforms={campaign.platforms || []}
              onChange={handlePlatformChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select platforms where creators will post content
            </p>
          </div>
        </div>
      )}
      
      {showCreatorInfoSection && (
        <div className="space-y-6">
          <FormItem className="space-y-2">
            <Label htmlFor="description">
              Challenge Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              className="min-h-[120px]"
              value={campaign.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell creators about your challenge"
              required
            />
            <p className="text-xs text-muted-foreground">
              Explain your challenge in detail. What should creators do? What are the rules?
            </p>
          </FormItem>
        </div>
      )}
    </div>
  );
};

export default ChallengeForm;
