
import { Campaign, CONTENT_TYPES, CATEGORIES, Platform } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PlatformSelector from "@/components/PlatformSelector";
import { DatePicker } from "@/components/ui/date-picker";
import RequirementsList from "@/components/RequirementsList";
import VisibilitySelector from "@/components/VisibilitySelector";
import CountrySelector from "@/components/CountrySelector";

interface CampaignStepDetailsProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
}

export default function CampaignStepDetails({ campaign, onChange }: CampaignStepDetailsProps) {
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

  const handleVisibilityChange = (visibility: any, applicationQuestions?: any, restrictedAccess?: any) => {
    onChange({
      visibility,
      applicationQuestions,
      restrictedAccess
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Content Type <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={campaign.contentType || ""} 
                onValueChange={(value) => onChange({ contentType: value as any })}
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
              <Label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={campaign.category || ""} 
                onValueChange={(value) => onChange({ category: value as any })}
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
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Platforms <span className="text-destructive">*</span>
            </Label>
            <PlatformSelector
              selectedPlatforms={campaign.platforms || []}
              onChange={handlePlatformChange}
              showLabel={false}
              singleSelection={false}
            />
            <p className="text-xs text-muted-foreground">
              Select where creators will post their content
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Country Availability</Label>
            <CountrySelector
              value={campaign.countryAvailability || "worldwide"}
              onChange={(value) => onChange({ countryAvailability: value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Type-specific fields */}
      {campaign.type === "retainer" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Retainer Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Application Deadline <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={campaign.applicationDeadline ? new Date(campaign.applicationDeadline) : undefined}
                onSelect={(date) => onChange({ applicationDeadline: date })}
                placeholder="Select application deadline"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.type === "payPerView" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Pay Per View Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Rate per 1,000 Views <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={campaign.ratePerThousand || ""}
                  onChange={(e) => onChange({ ratePerThousand: Number(e.target.value) })}
                  placeholder="Amount per 1k views"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Max Payout per Submission <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={campaign.maxPayoutPerSubmission || ""}
                  onChange={(e) => onChange({ maxPayoutPerSubmission: Number(e.target.value) })}
                  placeholder="Maximum per submission"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                View Validation Period (days) <span className="text-destructive">*</span>
              </Label>
              <Input
                type="number"
                min="1"
                value={campaign.viewValidationPeriod || ""}
                onChange={(e) => onChange({ viewValidationPeriod: Number(e.target.value) })}
                placeholder="Days to count views"
              />
              <p className="text-xs text-muted-foreground">
                How many days after posting to count views for payment
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {campaign.type === "challenge" && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Challenge Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Prize Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={campaign.prizeAmount || ""}
                  onChange={(e) => onChange({ prizeAmount: Number(e.target.value) })}
                  placeholder="Prize per winner"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Number of Winners <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={campaign.winnersCount || ""}
                  onChange={(e) => onChange({ winnersCount: Number(e.target.value) })}
                  placeholder="How many winners"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Submission Deadline <span className="text-destructive">*</span>
              </Label>
              <DatePicker
                date={campaign.submissionDeadline ? new Date(campaign.submissionDeadline) : undefined}
                onSelect={(date) => onChange({ submissionDeadline: date })}
                placeholder="Select submission deadline"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <RequirementsList
            requirements={campaign.requirements || []}
            onChange={(requirements) => onChange({ requirements })}
            title=""
          />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Visibility</CardTitle>
        </CardHeader>
        <CardContent>
          <VisibilitySelector
            visibility={campaign.visibility || "public"}
            applicationQuestions={campaign.applicationQuestions}
            restrictedAccess={campaign.restrictedAccess}
            onChange={handleVisibilityChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}
