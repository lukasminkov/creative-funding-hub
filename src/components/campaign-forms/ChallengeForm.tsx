
import React from "react";
import { ChallengeCampaign, Platform, Brief, CONTENT_TYPES, CATEGORIES } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import PlatformSelector from "@/components/PlatformSelector";
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
import { Info, Trophy, Calendar } from "lucide-react";
import CountrySelector from "@/components/CountrySelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

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

  const handlePrizeDistributionChange = (type: 'equal' | 'custom') => {
    if (type === 'equal') {
      onChange({
        prizeDistributionType: type,
        prizePool: undefined,
      });
    } else {
      onChange({
        prizeDistributionType: type,
        prizeAmount: undefined,
        winnersCount: undefined,
        prizePool: {
          places: [
            { position: 1, prize: 0 },
            { position: 2, prize: 0 },
            { position: 3, prize: 0 },
          ]
        }
      });
    }
  };

  const handlePrizePoolChange = (index: number, field: 'position' | 'prize', value: number) => {
    const newPlaces = [...(campaign.prizePool?.places || [])];
    newPlaces[index] = { ...newPlaces[index], [field]: value };
    onChange({
      prizePool: { places: newPlaces }
    });
  };

  const addPrizePlace = () => {
    const currentPlaces = campaign.prizePool?.places || [];
    const newPosition = currentPlaces.length + 1;
    onChange({
      prizePool: {
        places: [...currentPlaces, { position: newPosition, prize: 0 }]
      }
    });
  };

  const removePrizePlace = (index: number) => {
    const newPlaces = [...(campaign.prizePool?.places || [])];
    newPlaces.splice(index, 1);
    onChange({
      prizePool: { places: newPlaces }
    });
  };
  
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="submissionDeadline">
                Submission Deadline <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id="submissionDeadline"
                date={campaign.submissionDeadline ? new Date(campaign.submissionDeadline) : undefined}
                onSelect={(date) => onChange({ submissionDeadline: date })}
                placeholder="Select submission deadline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                Campaign End Date <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                id="endDate"
                date={campaign.endDate ? new Date(campaign.endDate) : undefined}
                onSelect={(date) => onChange({ endDate: date })}
                placeholder="Select end date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">
                Content Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={campaign.contentType || ""}
                onValueChange={(value) => onChange({ contentType: value as typeof CONTENT_TYPES[number] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={campaign.category || ""}
                onValueChange={(value) => onChange({ category: value as typeof CATEGORIES[number] })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <CountrySelector
                selectedCountry={campaign.countryAvailability || "worldwide"}
                onChange={(country) => onChange({ countryAvailability: country })}
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
                title="Specific Requirements"
              />
            </div>
          </div>

          {/* Prize Distribution Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Prize Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Distribution Type <span className="text-destructive">*</span></Label>
                <Select
                  value={campaign.prizeDistributionType || "equal"}
                  onValueChange={(value) => handlePrizeDistributionChange(value as 'equal' | 'custom')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select distribution type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Equal Distribution</SelectItem>
                    <SelectItem value="custom">Custom Distribution</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {campaign.prizeDistributionType === "equal" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prizeAmount">
                      Prize per Winner <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="prizeAmount"
                      type="number"
                      min="0"
                      value={campaign.prizeAmount || ""}
                      onChange={(e) => onChange({ prizeAmount: Number(e.target.value) })}
                      placeholder="Amount per winner"
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
                      placeholder="Number of winners"
                      required
                    />
                  </div>
                </div>
              )}

              {campaign.prizeDistributionType === "custom" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Prize Breakdown</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addPrizePlace}>
                      <Plus className="h-4 w-4 mr-1" /> Add Place
                    </Button>
                  </div>
                  
                  {(campaign.prizePool?.places || []).map((place, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-border rounded-md bg-muted/20">
                      <div className="space-y-2">
                        <Label>Position</Label>
                        <Input
                          type="number"
                          min="1"
                          value={place.position}
                          onChange={(e) => handlePrizePoolChange(index, 'position', Number(e.target.value))}
                          placeholder="Position"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Prize Amount</Label>
                        <Input
                          type="number"
                          min="0"
                          value={place.prize}
                          onChange={(e) => handlePrizePoolChange(index, 'prize', Number(e.target.value))}
                          placeholder="Prize amount"
                        />
                      </div>
                      
                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removePrizePlace(index)}
                          className="h-10 w-10"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
