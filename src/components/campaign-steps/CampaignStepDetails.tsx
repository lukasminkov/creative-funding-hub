
import { Campaign } from "@/lib/campaign-types";
import { CampaignFormErrors } from "@/lib/campaign-validation";
import RetainerForm from "@/components/campaign-forms/RetainerForm";
import PayPerViewForm from "@/components/campaign-forms/PayPerViewForm";
import ChallengeForm from "@/components/campaign-forms/ChallengeForm";

interface CampaignStepDetailsProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  errors?: CampaignFormErrors;
}

export default function CampaignStepDetails({ campaign, onChange, errors = {} }: CampaignStepDetailsProps) {
  const renderTypeSpecificForm = () => {
    switch (campaign.type) {
      case "retainer":
        return (
          <RetainerForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={false}
          />
        );
      case "payPerView":
        return (
          <PayPerViewForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={false}
          />
        );
      case "challenge":
        return (
          <ChallengeForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={false}
          />
        );
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please select a campaign type first.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Campaign Details</h3>
        <p className="text-muted-foreground">
          Configure the specific settings for your {campaign.type || 'campaign'}
        </p>
      </div>

      {renderTypeSpecificForm()}

      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="space-y-2">
          {Object.entries(errors).map(([field, error]) => (
            <p key={field} className="text-sm font-medium text-destructive">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
