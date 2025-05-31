
import { Campaign } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { CampaignFormErrors } from "@/lib/campaign-validation";
import ContentTypeSelector from "@/components/campaign-forms/shared/ContentTypeSelector";
import CategorySelector from "@/components/campaign-forms/shared/CategorySelector";
import CampaignAvailabilitySelector from "@/components/campaign-forms/shared/CampaignAvailabilitySelector";
import PlatformSection from "@/components/campaign-forms/shared/PlatformSection";
import RequirementsSection from "@/components/campaign-forms/shared/RequirementsSection";

interface CampaignStepDetailsProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  errors?: CampaignFormErrors;
}

export default function CampaignStepDetails({ campaign, onChange, errors = {} }: CampaignStepDetailsProps) {
  const handlePlatformChange = (platform: string) => {
    const currentPlatforms = [...(campaign.platforms || [])];
    const platformValue = platform as any;
    
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

  const handleCountryChange = (country: "worldwide" | "usa" | "mexico" | "canada" | "dach") => {
    onChange({ countryAvailability: country });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Campaign Details</h3>
        <p className="text-muted-foreground">
          Configure your campaign requirements and targeting
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            {errors.endDate && (
              <p className="text-sm font-medium text-destructive">{errors.endDate}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Content & Targeting</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <ContentTypeSelector
              value={campaign.contentType || ""}
              onChange={(value) => onChange({ contentType: value as any })}
            />
            {errors.contentType && (
              <p className="text-sm font-medium text-destructive">{errors.contentType}</p>
            )}
          </div>

          <div className="space-y-2">
            <CategorySelector
              value={campaign.category || ""}
              onChange={(value) => onChange({ category: value as any })}
            />
            {errors.category && (
              <p className="text-sm font-medium text-destructive">{errors.category}</p>
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <CampaignAvailabilitySelector
              selectedCountry={(campaign.countryAvailability as any) || "worldwide"}
              onChange={handleCountryChange}
            />
            {errors.countryAvailability && (
              <p className="text-sm font-medium text-destructive">{errors.countryAvailability}</p>
            )}
          </div>
          
          <div className="space-y-2 col-span-2">
            <PlatformSection
              selectedPlatforms={campaign.platforms || []}
              onChange={handlePlatformChange}
              singleSelection={campaign.type === "retainer"}
            />
            {errors.platforms && (
              <p className="text-sm font-medium text-destructive">{errors.platforms}</p>
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <RequirementsSection
              requirements={campaign.requirements || []}
              onChange={(requirements) => onChange({ requirements })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
