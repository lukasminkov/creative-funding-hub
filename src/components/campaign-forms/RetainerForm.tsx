import React from "react";
import { RetainerCampaign, Platform, DeliverableMode, DELIVERABLE_MODES, CreatorTier, Brief } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import PlatformSelector from "@/components/PlatformSelector";
import { FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import RequirementsList from "@/components/RequirementsList";
import GuidelinesList from "@/components/GuidelinesList";
import BannerImageUpload from "@/components/BannerImageUpload";
import ExampleVideos from "@/components/ExampleVideos";
import BriefUploader from "@/components/BriefUploader";
import InstructionVideoUploader from "@/components/InstructionVideoUploader";
import { Checkbox } from "@/components/ui/checkbox";

interface RetainerFormProps {
  campaign: Partial<RetainerCampaign>;
  onChange: (updatedCampaign: Partial<RetainerCampaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const RetainerForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: RetainerFormProps) => {
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

  const handleDeliverableModeChange = (mode: DeliverableMode) => {
    onChange({
      deliverables: {
        ...campaign.deliverables,
        mode,
      },
    });
  };

  const handleAddCreatorTier = () => {
    const tiers = [...(campaign.creatorTiers || [])];
    tiers.push({ name: "", price: 0 });
    onChange({ creatorTiers: tiers });
  };

  const handleUpdateCreatorTier = (index: number, field: keyof CreatorTier, value: string | number) => {
    const tiers = [...(campaign.creatorTiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    onChange({ creatorTiers: tiers });
  };

  const handleRemoveCreatorTier = (index: number) => {
    const tiers = [...(campaign.creatorTiers || [])];
    tiers.splice(index, 1);
    onChange({ creatorTiers: tiers });
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
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">
              Campaign Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              className="min-h-[120px]"
              value={campaign.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Tell creators about your campaign"
              required
            />
            <p className="text-xs text-muted-foreground">
              Explain your campaign details and goals
            </p>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Banner Image</Label>
            <BannerImageUpload
              value={campaign.bannerImage}
              onChange={(url) => onChange({ bannerImage: url })}
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
            <Label htmlFor="applicationDeadline">
              Application Deadline <span className="text-destructive">*</span>
            </Label>
            <DatePicker
              id="applicationDeadline" 
              date={campaign.applicationDeadline ? new Date(campaign.applicationDeadline) : undefined}
              onSelect={(date) => onChange({ applicationDeadline: date })}
              placeholder="Select deadline"
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
          
          <div className="space-y-2 col-span-2">
            <Label>
              Platforms <span className="text-destructive">*</span>
            </Label>
            <PlatformSelector
              selectedPlatforms={campaign.platforms || []}
              onChange={handlePlatformChange}
              showLabel={false}
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
      )}
      
      {showCreatorInfoSection && (
        <div className="space-y-6">
          <div className="space-y-4">
            <FormItem className="space-y-2">
              <Label>Deliverable Structure <span className="text-destructive">*</span></Label>
              <Select
                value={campaign.deliverables?.mode || "videosPerDay"}
                onValueChange={(value) => handleDeliverableModeChange(value as DeliverableMode)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select deliverable mode" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERABLE_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode === "videosPerDay" ? "Videos Per Day" : "Total Videos"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>

            {campaign.deliverables?.mode === "videosPerDay" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem className="space-y-2">
                  <Label htmlFor="videosPerDay">
                    Videos Per Day <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="videosPerDay"
                    type="number"
                    min="1"
                    value={campaign.deliverables?.videosPerDay || ""}
                    onChange={(e) => onChange({
                      deliverables: {
                        ...campaign.deliverables,
                        videosPerDay: Number(e.target.value),
                      },
                    })}
                    placeholder="Number of videos per day"
                  />
                </FormItem>
                
                <FormItem className="space-y-2">
                  <Label htmlFor="durationDays">
                    Duration (days) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min="1"
                    value={campaign.deliverables?.durationDays || ""}
                    onChange={(e) => onChange({
                      deliverables: {
                        ...campaign.deliverables,
                        durationDays: Number(e.target.value),
                      },
                    })}
                    placeholder="Number of days"
                  />
                </FormItem>
              </div>
            )}

            {campaign.deliverables?.mode === "totalVideos" && (
              <FormItem className="space-y-2">
                <Label htmlFor="totalVideos">
                  Total Videos <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="totalVideos"
                  type="number"
                  min="1"
                  value={campaign.deliverables?.totalVideos || ""}
                  onChange={(e) => onChange({
                    deliverables: {
                      ...campaign.deliverables,
                      totalVideos: Number(e.target.value),
                    },
                  })}
                  placeholder="Total number of videos"
                />
              </FormItem>
            )}
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Creator Tiers</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddCreatorTier}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Tier
              </Button>
            </div>
            
            {(campaign.creatorTiers || []).length === 0 && (
              <p className="text-sm text-muted-foreground">
                No tiers defined. Add tiers to classify creators by different pricing.
              </p>
            )}
            
            {(campaign.creatorTiers || []).map((tier, index) => (
              <div 
                key={index} 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-border rounded-md"
              >
                <FormItem className="space-y-2">
                  <Label htmlFor={`tier-${index}-name`}>Tier Name</Label>
                  <Input
                    id={`tier-${index}-name`}
                    value={tier.name}
                    onChange={(e) => handleUpdateCreatorTier(index, "name", e.target.value)}
                    placeholder="e.g. Premium, Standard"
                  />
                </FormItem>
                
                <FormItem className="space-y-2">
                  <Label htmlFor={`tier-${index}-price`}>Price</Label>
                  <Input
                    id={`tier-${index}-price`}
                    type="number"
                    min="0"
                    value={tier.price}
                    onChange={(e) => handleUpdateCreatorTier(index, "price", Number(e.target.value))}
                    placeholder="Price for this tier"
                  />
                </FormItem>
                
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveCreatorTier(index)}
                    className="h-10 w-10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <FormItem className="space-y-2">
            <Label>Guidelines for Creators</Label>
            <GuidelinesList
              dos={campaign.guidelines?.dos || []}
              donts={campaign.guidelines?.donts || []}
              onChange={(guidelines) => onChange({ guidelines })}
            />
          </FormItem>

          <FormItem className="space-y-2">
            <Label>Content Brief</Label>
            <BriefUploader
              brief={campaign.brief}
              onChange={(brief) => onChange({ brief })}
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
              <Label htmlFor="trackingLink">Tracking Link</Label>
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

          <FormItem className="space-y-2">
            <Label>Example Videos</Label>
            <ExampleVideos
              exampleVideos={campaign.exampleVideos || []}
              selectedPlatforms={campaign.platforms || []}
              onChange={(exampleVideos) => onChange({ exampleVideos })}
            />
          </FormItem>
        </div>
      )}
    </div>
  );
};

export default RetainerForm;
