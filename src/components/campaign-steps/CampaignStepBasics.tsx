
import { Campaign } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BannerImageUpload from "@/components/BannerImageUpload";
import { CampaignFormErrors } from "@/lib/campaign-validation";

interface CampaignStepBasicsProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  disableBudgetEdit?: boolean;
  errors?: CampaignFormErrors;
}

export default function CampaignStepBasics({ 
  campaign, 
  onChange, 
  disableBudgetEdit = false,
  errors = {}
}: CampaignStepBasicsProps) {
  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Campaign Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={campaign.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Enter a compelling campaign title"
              className="text-base"
            />
            {errors.title && (
              <p className="text-sm font-medium text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Campaign Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              className="min-h-[120px] text-base"
              value={campaign.description || ""}
              onChange={(e) => onChange({ description: e.target.value })}
              placeholder="Describe your campaign goals, target audience, and what you're looking for from creators"
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">{errors.description}</p>
            )}
            <p className="text-xs text-muted-foreground">
              This description will be visible to creators when they discover your campaign
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Campaign Banner</Label>
            <BannerImageUpload
              value={campaign.bannerImage}
              onChange={(url) => onChange({ bannerImage: url })}
            />
            <p className="text-xs text-muted-foreground">
              Add an eye-catching banner to make your campaign stand out
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Budget</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="totalBudget" className="text-sm font-medium">
              Total Campaign Budget <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">$</span>
              <Input
                id="totalBudget"
                type="number"
                min="0"
                step="0.01"
                value={campaign.totalBudget || ""}
                onChange={(e) => onChange({ totalBudget: Number(e.target.value) })}
                placeholder="0.00"
                disabled={disableBudgetEdit}
                className={`text-lg font-medium ${disableBudgetEdit ? "bg-muted cursor-not-allowed" : ""}`}
              />
            </div>
            {errors.totalBudget && (
              <p className="text-sm font-medium text-destructive">{errors.totalBudget}</p>
            )}
            {disableBudgetEdit && (
              <p className="text-xs text-muted-foreground">
                Budget can only be increased using the "Add Budget" button
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This is the total amount you're willing to spend on this campaign
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
