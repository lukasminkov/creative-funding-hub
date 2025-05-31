
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Campaign } from '@/lib/campaign-types';
import CampaignStepBasics from '../campaign-steps/CampaignStepBasics';
import CampaignStepType from '../campaign-steps/CampaignStepType';
import CampaignStepDetails from '../campaign-steps/CampaignStepDetails';
import CampaignStepCreatorInfo from '../campaign-steps/CampaignStepCreatorInfo';
import CampaignStepReview from '../campaign-steps/CampaignStepReview';

interface CampaignStepContentProps {
  currentStep: number;
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  disableBudgetEdit: boolean;
  errors: any;
}

export const CampaignStepContent: React.FC<CampaignStepContentProps> = ({
  currentStep,
  campaign,
  onChange,
  disableBudgetEdit,
  errors
}) => {
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignStepBasics 
            campaign={campaign} 
            onChange={onChange}
            disableBudgetEdit={disableBudgetEdit}
            errors={errors}
          />
        );
      case 1:
        return (
          <CampaignStepType 
            campaign={campaign} 
            onChange={onChange}
            errors={errors}
          />
        );
      case 2:
        return (
          <CampaignStepDetails 
            campaign={campaign} 
            onChange={onChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <CampaignStepCreatorInfo 
            campaign={campaign} 
            onChange={onChange}
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
  );
};
