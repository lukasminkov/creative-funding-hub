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
import { Button } from "@/components/ui/button";
import { DollarSign, Users, AlertCircle, Plus, Trash2, Trophy } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  // Prize distribution type
  const distributionType = campaign.prizeDistributionType || 'equal';
  
  // Calculate total prize allocation
  let totalPrizeAllocation = 0;
  if (distributionType === 'equal') {
    totalPrizeAllocation = (campaign.prizeAmount || 0) * (campaign.winnersCount || 1);
  } else {
    totalPrizeAllocation = (campaign.prizePool?.places || []).reduce((sum, place) => sum + place.prize, 0);
  }
  
  const totalBudget = campaign.totalBudget || 0;
  const allocationPercentage = totalBudget > 0 ? (totalPrizeAllocation / totalBudget) * 100 : 0;
  const remainingBudget = totalBudget - totalPrizeAllocation;

  const handleDistributionTypeChange = (type: 'equal' | 'custom') => {
    if (type === 'equal') {
      onChange({ 
        prizeDistributionType: type,
        prizePool: undefined 
      });
    } else {
      const places = [];
      const count = campaign.winnersCount || 3;
      for (let i = 1; i <= count; i++) {
        places.push({ position: i, prize: 0 });
      }
      onChange({ 
        prizeDistributionType: type,
        prizePool: { places },
        prizeAmount: undefined 
      });
    }
  };

  const updateCustomPrize = (position: number, prize: number) => {
    const places = [...(campaign.prizePool?.places || [])];
    const index = places.findIndex(p => p.position === position);
    if (index >= 0) {
      places[index].prize = prize;
    }
    onChange({ prizePool: { places } });
  };

  const addCustomPlace = () => {
    const places = [...(campaign.prizePool?.places || [])];
    const nextPosition = places.length + 1;
    places.push({ position: nextPosition, prize: 0 });
    onChange({ prizePool: { places } });
  };

  const removeCustomPlace = (position: number) => {
    const places = (campaign.prizePool?.places || []).filter(p => p.position !== position);
    // Reorder positions
    const reorderedPlaces = places.map((place, index) => ({
      ...place,
      position: index + 1
    }));
    onChange({ prizePool: { places: reorderedPlaces } });
  };
  
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="space-y-6">
          {/* Prize Distribution Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Prize Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Distribution Type Selection */}
              <div className="space-y-4">
                <Label>Distribution Type</Label>
                <RadioGroup
                  value={distributionType}
                  onValueChange={(value) => handleDistributionTypeChange(value as 'equal' | 'custom')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="equal" id="equal" />
                    <Label htmlFor="equal" className="cursor-pointer">
                      Equal distribution (same amount for all winners)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">
                      Custom distribution (different amounts for each place)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {distributionType === 'equal' ? (
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
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Prize Amounts by Place</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addCustomPlace}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Place
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {(campaign.prizePool?.places || []).map((place) => (
                      <div key={place.position} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <span className="text-sm font-medium whitespace-nowrap">
                            {place.position === 1 ? '1st Place' : 
                             place.position === 2 ? '2nd Place' : 
                             place.position === 3 ? '3rd Place' : 
                             `${place.position}th Place`}
                          </span>
                          <Input
                            type="number"
                            min="0"
                            value={place.prize || ""}
                            onChange={(e) => updateCustomPrize(place.position, Number(e.target.value))}
                            placeholder="Prize amount"
                            className="flex-1"
                          />
                        </div>
                        {(campaign.prizePool?.places || []).length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeCustomPlace(place.position)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {(campaign.prizePool?.places || []).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No prize places configured</p>
                      <p className="text-sm">Click "Add Place" to start setting up your prize distribution</p>
                    </div>
                  )}
                </div>
              )}

              {/* Budget Allocation Visual */}
              {totalBudget > 0 && totalPrizeAllocation > 0 && (
                <div className="space-y-4 p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
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
