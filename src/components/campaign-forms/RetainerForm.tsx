
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RetainerFormProps {
  campaign: Partial<RetainerCampaign>;
  onChange: (updatedCampaign: Partial<RetainerCampaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const RetainerForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: RetainerFormProps) => {
  const handlePlatformChange = (platform: string) => {
    const platformValue = platform as Platform;
    // For Retainer campaigns, we only allow a single platform selection
    onChange({
      platforms: [platformValue],
    });
  };
  
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="space-y-6">
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
                Platform <span className="text-destructive">*</span>
              </Label>
              <PlatformSelector
                selectedPlatform={campaign.platforms?.[0] || ""}
                onChange={handlePlatformChange}
                showLabel={false}
                singleSelection={true}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Select the platform where creators will post content
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

export default RetainerForm;
