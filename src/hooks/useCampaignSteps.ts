
import { useState } from 'react';
import { Campaign } from '@/lib/campaign-types';
import { useCampaignValidation } from './useCampaignValidation';
import { toast } from 'sonner';

const STEPS = [
  { 
    id: 'basics', 
    title: 'Campaign Basics', 
    description: 'Name, description & budget',
    fields: ['title', 'description', 'totalBudget', 'bannerImage'],
  },
  { 
    id: 'type', 
    title: 'Campaign Type', 
    description: 'Choose your campaign model',
    fields: ['type'],
  },
  { 
    id: 'details', 
    title: 'Campaign Details', 
    description: 'Requirements & settings',
    fields: ['platforms', 'contentType', 'category', 'countryAvailability', 'endDate', 'requirements'],
  },
  { 
    id: 'creator-info', 
    title: 'Creator Information', 
    description: 'Guidelines & resources',
    fields: ['guidelines', 'brief', 'instructionVideo', 'requestedTrackingLink', 'trackingLink', 'exampleVideos'],
  },
  { 
    id: 'review', 
    title: 'Review & Launch', 
    description: 'Final review before launch',
    fields: [],
  }
];

export const useCampaignSteps = (campaignType: string, campaign: Partial<Campaign>) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { validateStep } = useCampaignValidation(campaignType as any);

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

  const progressSteps = STEPS.map((step, index) => ({
    ...step,
    status: index < currentStep ? 'completed' as const :
            index === currentStep ? 'active' as const :
            'pending' as const
  }));

  return {
    STEPS,
    currentStep,
    progressSteps,
    handleNext,
    handlePrevious,
    handleStepClick,
    validateCurrentStep
  };
};
