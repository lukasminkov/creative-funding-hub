
import React from "react";
import { PayPerViewCampaign, Platform } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";
import GuidelinesList from "@/components/GuidelinesList";
import ExampleVideos from "@/components/ExampleVideos";
import BriefUploader from "@/components/BriefUploader";
import InstructionVideoUploader from "@/components/InstructionVideoUploader";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";
import ContentTypeSelector from "./shared/ContentTypeSelector";
import CategorySelector from "./shared/CategorySelector";
import CampaignAvailabilitySelector from "./shared/CampaignAvailabilitySelector";
import PlatformSection from "./shared/PlatformSection";
import RequirementsSection from "./shared/RequirementsSection";
import TrackingLinkSection from "./shared/TrackingLinkSection";

interface PayPerViewFormProps {
  campaign: Partial<PayPerViewCampaign>;
  onChange: (updatedCampaign: Partial<PayPerViewCampaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const PayPerViewForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: PayPerViewFormProps) => {
  // Set the view validation period to 10 days when component initializes
  React.useEffect(() => {
    if (!campaign.viewValidationPeriod) {
      onChange({ viewValidationPeriod: 10 });
    }
  }, [campaign.viewValidationPeriod, onChange]);

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
            <Label htmlFor="ratePerThousand">
              Rate per 1,000 Views <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ratePerThousand"
              type="number"
              min="0"
              step="0.01"
              value={campaign.ratePerThousand || ""}
              onChange={(e) => onChange({ ratePerThousand: Number(e.target.value) })}
              placeholder="Amount per 1k views"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="maxPayoutPerSubmission">
              Max Payout per Submission <span className="text-destructive">*</span>
            </Label>
            <Input
              id="maxPayoutPerSubmission"
              type="number"
              min="0"
              value={campaign.maxPayoutPerSubmission || ""}
              onChange={(e) => onChange({ maxPayoutPerSubmission: Number(e.target.value) })}
              placeholder="Maximum amount per submission"
              required
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>View Validation Period:</strong> Views will be counted for 10 days after content is published (app standard).
              </p>
            </div>
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
            singleSelection={false}
          />

          <RequirementsSection
            requirements={campaign.requirements || []}
            onChange={(requirements) => onChange({ requirements })}
          />
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

export default PayPerViewForm;
