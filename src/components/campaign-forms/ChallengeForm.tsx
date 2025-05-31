import React from "react";
import { ChallengeCampaign, Platform, Brief } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import PlatformSelector from "@/components/PlatformSelector";
import { DatePicker } from "@/components/ui/date-picker";
import { FormItem } from "@/components/ui/form";
import RequirementsList from "@/components/RequirementsList";
import GuidelinesList from "@/components/GuidelinesList";
import BannerImageUpload from "@/components/BannerImageUpload";
import ExampleVideos from "@/components/ExampleVideos";
import BriefUploader from "@/components/BriefUploader";
import InstructionVideoUploader from "@/components/InstructionVideoUploader";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
              showLabel={false}
              singleSelection={false}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select platforms where creators will post content
            </p>
          </div>

          <div className="space-y-2 col-span-2">
            <RequirementsList
              requirements={campaign.requirements || []}
              onChange={(requirements) => onChange({ requirements })}
              title="Challenge Requirements"
            />
          </div>
        </div>
      )}
      
      {showCreatorInfoSection && (
        <div className="space-y-6">
          <FormItem className="space-y-2">
            <Label>Guidelines for Creators</Label>
            <GuidelinesList
              dos={campaign.guidelines?.dos || []}
              donts={campaign.guidelines?.donts || []}
              onChange={(guidelines) => onChange({ guidelines })}
              showLabel={false}
            />
          </FormItem>

          <FormItem className="space-y-2">
            <BriefUploader
              brief={campaign.brief}
              onChange={(brief) => onChange({ brief })}
              label="Campaign Brief"
            />
          </FormItem>

          <FormItem className="space-y-2">
            <Label>Explanation Video</Label>
            <InstructionVideoUploader
              value={campaign.instructionVideo}
              onChange={(url) => onChange({ instructionVideo: url })}
              file={campaign.instructionVideoFile}
              onFileChange={(file) => onChange({ instructionVideoFile: file })}
            />
          </FormItem>

          <Separator className="my-4" />

          <Card>
            <CardHeader>
              <CardTitle>Tracking Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requestedTrackingLink"
                    checked={campaign.requestedTrackingLink || false}
                    onCheckedChange={(checked) => 
                      onChange({ requestedTrackingLink: checked as boolean })
                    }
                  />
                  <Label htmlFor="requestedTrackingLink" className="cursor-pointer">
                    Request tracking link in submissions
                  </Label>
                </div>
              </FormItem>

              {campaign.requestedTrackingLink && (
                <FormItem className="space-y-2">
                  <Label htmlFor="trackingLink">Link URL</Label>
                  <Input
                    id="trackingLink"
                    value={campaign.trackingLink || ""}
                    onChange={(e) => onChange({ trackingLink: e.target.value })}
                    placeholder="Enter tracking link"
                  />
                  <p className="text-xs text-muted-foreground">
                    This link will be provided to creators for tracking purposes
                  </p>
                </FormItem>
              )}
            </CardContent>
          </Card>

          <FormItem className="space-y-2">
            <ExampleVideos
              exampleVideos={campaign.exampleVideos || []}
              selectedPlatforms={campaign.platforms || []}
              onChange={(exampleVideos) => onChange({ exampleVideos })}
              showLabel={true}
            />
          </FormItem>
        </div>
      )}
    </div>
  );
};

export default ChallengeForm;
