
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Campaign, 
  CONTENT_TYPES, 
  CATEGORIES
} from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressIndicator } from "@/components/ui/progress-indicator";
import { AccessibleButton } from "@/components/ui/accessible-button";
import { 
  Save, Rocket, ArrowLeft, ArrowRight, 
  FileText, Settings, Users, Eye
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCampaignValidation } from "@/hooks/useCampaignValidation";
import { useCampaignFormState } from "@/hooks/useCampaignFormState";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import CampaignStepBasics from "./campaign-steps/CampaignStepBasics";
import CampaignStepType from "./campaign-steps/CampaignStepType";
import CampaignStepDetails from "./campaign-steps/CampaignStepDetails";
import CampaignStepCreatorInfo from "./campaign-steps/CampaignStepCreatorInfo";
import CampaignStepReview from "./campaign-steps/CampaignStepReview";

interface CampaignCreatorProps {
  onCancel: () => void;
  onSubmit: (campaign: Campaign) => void;
  campaign?: Campaign;
  isEditing?: boolean;
  disableBudgetEdit?: boolean;
  isModal?: boolean;
}

const STEPS = [
  { 
    id: 'basics', 
    title: 'Campaign Basics', 
    description: 'Name, description & budget',
    icon: FileText,
    fields: ['title', 'description', 'totalBudget', 'bannerImage'],
    status: 'pending' as const
  },
  { 
    id: 'type', 
    title: 'Campaign Type', 
    description: 'Choose your campaign model',
    icon: Settings,
    fields: ['type'],
    status: 'pending' as const
  },
  { 
    id: 'details', 
    title: 'Campaign Details', 
    description: 'Requirements & settings',
    icon: Users,
    fields: ['platforms', 'contentType', 'category', 'countryAvailability', 'endDate', 'requirements'],
    status: 'pending' as const
  },
  { 
    id: 'creator-info', 
    title: 'Creator Information', 
    description: 'Guidelines & resources',
    icon: Users,
    fields: ['guidelines', 'brief', 'instructionVideo', 'requestedTrackingLink', 'trackingLink', 'exampleVideos'],
    status: 'pending' as const
  },
  { 
    id: 'review', 
    title: 'Review & Launch', 
    description: 'Final review before launch',
    icon: Eye,
    fields: [],
    status: 'pending' as const
  }
];

const CampaignCreator = ({ 
  onCancel, 
  onSubmit, 
  campaign: initialCampaign, 
  isEditing = false, 
  disableBudgetEdit = false,
  isModal = false
}: CampaignCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
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
    validateStep, 
    validateForm, 
    getFieldError 
  } = useCampaignValidation(campaign.type || "retainer");

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

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepFields = STEPS[currentStep].fields;
    if (stepFields.length === 0) return true;

    const result = await validateStep(stepFields, campaign);
    
    if (!result.success) {
      const firstError = Object.keys(result.errors || {})[0];
      toast.error(result.errors?.[firstError] || "Please fix the errors before continuing");
      return false;
    }
    
    return true;
  };

  const handleNext = async () => {
    if (await validateCurrentStep()) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep || await validateCurrentStep()) {
      setCurrentStep(stepIndex);
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

  // Create progress steps with status
  const progressSteps = STEPS.map((step, index) => ({
    ...step,
    status: index < currentStep ? 'completed' as const :
            index === currentStep ? (isValidating ? 'active' as const : 'active' as const) :
            'pending' as const
  }));

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignStepBasics 
            campaign={campaign} 
            onChange={handleCampaignChange}
            disableBudgetEdit={disableBudgetEdit && isEditing}
            errors={errors}
          />
        );
      case 1:
        return (
          <CampaignStepType 
            campaign={campaign} 
            onChange={handleCampaignChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <CampaignStepDetails 
            campaign={campaign} 
            onChange={handleCampaignChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <CampaignStepCreatorInfo 
            campaign={campaign} 
            onChange={handleCampaignChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <CampaignStepReview 
            campaign={campaign as Campaign}
            errors={errors}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-8" role="main" aria-label="Campaign Creation Form">
      {/* Step Header with Progress Indicator */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold" id="step-title">
              {STEPS[currentStep].title}
            </h2>
            <p className="text-muted-foreground" id="step-description">
              {STEPS[currentStep].description}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-4 py-2 text-sm">
              Step {currentStep + 1} of {STEPS.length}
            </Badge>
            {formState.hasUnsavedChanges && (
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                Unsaved changes
              </Badge>
            )}
            {formState.lastSaved && (
              <Badge variant="outline" className="px-3 py-1 text-xs text-green-600">
                Saved {formState.lastSaved.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>
        
        <ProgressIndicator
          steps={progressSteps}
          currentStep={currentStep}
          className="mb-6"
        />
      </div>

      <Card className="glass-card">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
              role="tabpanel"
              aria-labelledby="step-title"
              aria-describedby="step-description"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Action Buttons with Accessibility */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-3">
          <AccessibleButton 
            variant="outline" 
            onClick={onCancel} 
            className="h-11 px-6"
            isLoading={formState.isSubmitting || isValidating}
            ariaLabel="Cancel campaign creation"
          >
            Cancel
          </AccessibleButton>
          {!isEditing && (
            <AccessibleButton 
              variant="outline" 
              onClick={handleSaveAsDraft} 
              className="h-11 px-6"
              isLoading={formState.isSaving}
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
              onClick={handlePrevious} 
              className="h-11 px-6"
              isLoading={formState.isSubmitting || isValidating}
              ariaLabel="Go to previous step"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </AccessibleButton>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <AccessibleButton 
              onClick={handleNext} 
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
              onClick={handleLaunchCampaign} 
              className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl"
              isLoading={formState.isSubmitting}
              loadingText={isEditing ? "Updating..." : "Launching..."}
              ariaLabel={isEditing ? "Update campaign" : "Launch campaign"}
            >
              <Rocket className="h-4 w-4 mr-2" />
              {isEditing ? "Update Campaign" : "Launch Campaign"}
            </AccessibleButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
