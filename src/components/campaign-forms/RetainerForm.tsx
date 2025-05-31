
import React from "react";
import { RetainerCampaign, Platform, DeliverableMode, DELIVERABLE_MODES } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import GuidelinesList from "@/components/GuidelinesList";
import ExampleVideos from "@/components/ExampleVideos";
import BriefUploader from "@/components/BriefUploader";
import InstructionVideoUploader from "@/components/InstructionVideoUploader";
import ContentTypeSelector from "./shared/ContentTypeSelector";
import CategorySelector from "./shared/CategorySelector";
import CampaignAvailabilitySelector from "./shared/CampaignAvailabilitySelector";
import PlatformSection from "./shared/PlatformSection";
import RequirementsSection from "./shared/RequirementsSection";
import TrackingLinkSection from "./shared/TrackingLinkSection";

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

            <ContentTypeSelector
              value={campaign.contentType || ""}
              onChange={(value) => onChange({ contentType: value as typeof campaign.contentType })}
            />

            <CategorySelector
              value={campaign.category || ""}
              onChange={(value) => onChange({ category: value as typeof campaign.category })}
            />

            <CampaignAvailabilitySelector
              selectedCountry={campaign.countryAvailability || "worldwide"}
              onChange={(country) => onChange({ countryAvailability: country })}
            />
            
            <PlatformSection
              selectedPlatforms={campaign.platforms || []}
              onChange={handlePlatformChange}
              singleSelection={true}
            />

            <RequirementsSection
              requirements={campaign.requirements || []}
              onChange={(requirements) => onChange({ requirements })}
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

          <TrackingLinkSection
            requestedTrackingLink={campaign.requestedTrackingLink || false}
            trackingLink={campaign.trackingLink || ""}
            onRequestedChange={(checked) => onChange({ requestedTrackingLink: checked })}
            onLinkChange={(link) => onChange({ trackingLink: link })}
          />

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
