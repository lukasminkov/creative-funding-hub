
import React, { useEffect } from "react";
import { 
  Campaign, 
  CONTENT_TYPES, 
  CATEGORIES
} from "@/lib/campaign-types";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useCampaignValidation } from "@/hooks/useCampaignValidation";
import { useCampaignFormState } from "@/hooks/useCampaignFormState";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useCampaignSteps } from "@/hooks/useCampaignSteps";
import { CampaignStepHeader } from "./campaign-creator/CampaignStepHeader";
import { CampaignStepContent } from "./campaign-creator/CampaignStepContent";
import { CampaignActionButtons } from "./campaign-creator/CampaignActionButtons";

interface CampaignCreatorProps {
  onCancel: () => void;
  onSubmit: (campaign: Campaign) => void;
  campaign?: Campaign;
  isEditing?: boolean;
  disableBudgetEdit?: boolean;
  isModal?: boolean;
}

const CampaignCreator = ({ 
  onCancel, 
  onSubmit, 
  campaign: initialCampaign, 
  isEditing = false, 
  disableBudgetEdit = false,
  isModal = false
}: CampaignCreatorProps) => {
  const { 
    campaign, 
    formState, 
    updateCampaign, 
    setLoading, 
    setSubmitting, 
    saveDraft, 
    autoSave 
  } = useCampaignFormState(initialCampaign || {
    title: "",
    description: "",
    contentType: CONTENT_TYPES[0],
    category: CATEGORIES[0],
    totalBudget: 0,
    currency: "USD",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    platforms: [],
    type: "retainer",
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    guidelines: { dos: [], donts: [] },
    trackingLink: "",
    requestedTrackingLink: false,
    exampleVideos: [],
    visibility: "public",
  });

  const { 
    errors, 
    isValidating, 
    validateForm, 
    getFieldError 
  } = useCampaignValidation(campaign.type || "retainer");

  const {
    STEPS,
    currentStep,
    progressSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    validateCurrentStep
  } = useCampaignSteps(campaign.type || "retainer", campaign);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  const handleCampaignChange = (updatedCampaign: Partial<Campaign>) => {
    if (disableBudgetEdit && isEditing && 'totalBudget' in updatedCampaign) {
      const { totalBudget, ...rest } = updatedCampaign;
      updateCampaign(rest);
    } else {
      updateCampaign(updatedCampaign);
    }
  };

  const handleSaveAsDraft = async () => {
    await saveDraft();
  };

  const handleLaunchCampaign = async () => {
    setSubmitting(true);
    
    try {
      const validationResult = await validateForm(campaign);
      
      if (!validationResult.success) {
        toast.error("Please fix all errors before launching");
        setSubmitting(false);
        return;
      }
      
      toast.success(isEditing ? "Campaign updated successfully!" : "Campaign launched successfully!");
      onSubmit(campaign as Campaign);
    } catch (error) {
      toast.error("Failed to launch campaign");
    } finally {
      setSubmitting(false);
    }
  };

  // Keyboard navigation
  useKeyboardNavigation({
    onNext: currentStep < STEPS.length - 1 ? handleNext : undefined,
    onPrevious: currentStep > 0 ? handlePrevious : undefined,
    onEscape: onCancel,
    enabled: !formState.isSubmitting && !isValidating
  });

  return (
    <div className="w-full space-y-8" role="main" aria-label="Campaign Creation Form">
      <CampaignStepHeader
        currentStep={currentStep}
        progressSteps={progressSteps}
        totalSteps={STEPS.length}
        hasUnsavedChanges={formState.hasUnsavedChanges}
        lastSaved={formState.lastSaved}
      />

      <Card className="glass-card">
        <CardContent className="p-8">
          <CampaignStepContent
            currentStep={currentStep}
            campaign={campaign}
            onChange={handleCampaignChange}
            disableBudgetEdit={disableBudgetEdit && isEditing}
            errors={errors}
          />
        </CardContent>
      </Card>

      <CampaignActionButtons
        currentStep={currentStep}
        totalSteps={STEPS.length}
        isEditing={isEditing}
        isSubmitting={formState.isSubmitting}
        isSaving={formState.isSaving}
        isValidating={isValidating}
        onCancel={onCancel}
        onSaveAsDraft={handleSaveAsDraft}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onLaunchCampaign={handleLaunchCampaign}
      />
    </div>
  );
};

export default CampaignCreator;
