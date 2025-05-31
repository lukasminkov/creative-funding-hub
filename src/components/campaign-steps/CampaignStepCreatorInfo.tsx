
import { Campaign } from "@/lib/campaign-types";
import { CampaignFormErrors } from "@/lib/campaign-validation";
import RetainerForm from "@/components/campaign-forms/RetainerForm";
import PayPerViewForm from "@/components/campaign-forms/PayPerViewForm";
import ChallengeForm from "@/components/campaign-forms/ChallengeForm";

interface CampaignStepCreatorInfoProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  errors?: CampaignFormErrors;
}

export default function CampaignStepCreatorInfo({ campaign, onChange, errors = {} }: CampaignStepCreatorInfoProps) {
  const renderTypeSpecificForm = () => {
    switch (campaign.type) {
      case "retainer":
        return (
          <RetainerForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={true}
          />
        );
      case "payPerView":
        return (
          <PayPerViewForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={true}
          />
        );
      case "challenge":
        return (
          <ChallengeForm
            campaign={campaign as any}
            onChange={onChange}
            showCreatorInfoSection={true}
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
        <h3 className="text-xl font-semibold">Creator Information</h3>
        <p className="text-muted-foreground">
          Provide guidelines and resources for content creators
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
