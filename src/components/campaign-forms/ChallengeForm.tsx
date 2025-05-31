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
import { Progress } from "@/components/ui/progress";
import { DollarSign, Users, AlertCircle } from "lucide-react";

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

  // Calculate total prize allocation
  const totalPrizeAllocation = (campaign.prizeAmount || 0) * (campaign.winnersCount || 1);
  const totalBudget = campaign.totalBudget || 0;
  const allocationPercentage = totalBudget > 0 ? (totalPrizeAllocation / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - totalPrizeAllocation;
  
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="space-y-6">
          {/* Prize Distribution Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Prize Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prizeAmount">
                    Prize Amount per Winner <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prizeAmount"
                    type="number"
                    min="0"
                    value={campaign.prizeAmount || ""}
                    onChange={(e) => onChange({ prizeAmount: Number(e.target.value) })}
                    placeholder="Amount each winner receives"
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
                    placeholder="Total number of winners"
                    required
                  />
                </div>
              </div>

              {/* Budget Allocation Visual */}
              {totalBudget > 0 && (campaign.prizeAmount || campaign.winnersCount) && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Budget Allocation
                    </h4>
                    <span className="text-sm text-muted-foreground">
                      {allocationPercentage.toFixed(1)}% of total budget
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(allocationPercentage, 100)} 
                    className="h-3"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Total Prize Pool</span>
                      <span className="font-medium">${totalPrizeAllocation.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Campaign Budget</span>
                      <span className="font-medium">${totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Remaining Budget</span>
                      <span className={`font-medium ${remainingBudget < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        ${remainingBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {allocationPercentage > 100 && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                      <AlertCircle className="h-4 w-4" />
                      <span>Prize allocation exceeds campaign budget by ${(totalPrizeAllocation - totalBudget).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Timeline</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Platform Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
            </CardContent>
          </Card>

          {/* Challenge Requirements */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <RequirementsList
                requirements={campaign.requirements || []}
                onChange={(requirements) => onChange({ requirements })}
                title=""
              />
            </CardContent>
          </Card>
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
