
import React from 'react';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { Save, Rocket, ArrowLeft, ArrowRight } from 'lucide-react';

interface CampaignActionButtonsProps {
  currentStep: number;
  totalSteps: number;
  isEditing: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  isValidating: boolean;
  onCancel: () => void;
  onSaveAsDraft: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onLaunchCampaign: () => void;
}

export const CampaignActionButtons: React.FC<CampaignActionButtonsProps> = ({
  currentStep,
  totalSteps,
  isEditing,
  isSubmitting,
  isSaving,
  isValidating,
  onCancel,
  onSaveAsDraft,
  onNext,
  onPrevious,
  onLaunchCampaign
}) => {
  const isLoading = isSubmitting || isValidating;

  return (
    <div className="flex items-center justify-between pt-6 border-t">
      <div className="flex items-center gap-3">
        <AccessibleButton 
          variant="outline" 
          onClick={onCancel} 
          className="h-11 px-6"
          isLoading={isLoading}
          ariaLabel="Cancel campaign creation"
        >
          Cancel
        </AccessibleButton>
        {!isEditing && (
          <AccessibleButton 
            variant="outline" 
            onClick={onSaveAsDraft} 
            className="h-11 px-6"
            isLoading={isSaving}
            loadingText="Saving..."
            ariaLabel="Save campaign as draft"
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </AccessibleButton>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        {currentStep > 0 && (
          <AccessibleButton 
            variant="outline" 
            onClick={onPrevious} 
            className="h-11 px-6"
            isLoading={isLoading}
            ariaLabel="Go to previous step"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </AccessibleButton>
        )}
        
        {currentStep < totalSteps - 1 ? (
          <AccessibleButton 
            onClick={onNext} 
            className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90"
            isLoading={isValidating}
            loadingText="Validating..."
            ariaLabel="Go to next step"
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </AccessibleButton>
        ) : (
          <AccessibleButton 
            onClick={onLaunchCampaign} 
            className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl"
            isLoading={isSubmitting}
            loadingText={isEditing ? "Updating..." : "Launching..."}
            ariaLabel={isEditing ? "Update campaign" : "Launch campaign"}
          >
            <Rocket className="h-4 w-4 mr-2" />
            {isEditing ? "Update Campaign" : "Launch Campaign"}
          </AccessibleButton>
        )}
      </div>
    </div>
  );
};
