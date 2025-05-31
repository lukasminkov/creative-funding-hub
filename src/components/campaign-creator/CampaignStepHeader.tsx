
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

interface CampaignStepHeaderProps {
  currentStep: number;
  progressSteps: Array<{
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'active' | 'pending';
  }>;
  totalSteps: number;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
}

export const CampaignStepHeader: React.FC<CampaignStepHeaderProps> = ({
  currentStep,
  progressSteps,
  totalSteps,
  hasUnsavedChanges,
  lastSaved
}) => {
  const currentStepData = progressSteps[currentStep];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold" id="step-title">
            {currentStepData.title}
          </h2>
          <p className="text-muted-foreground" id="step-description">
            {currentStepData.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            Step {currentStep + 1} of {totalSteps}
          </Badge>
          {hasUnsavedChanges && (
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              Unsaved changes
            </Badge>
          )}
          {lastSaved && (
            <Badge variant="outline" className="px-3 py-1 text-xs text-green-600">
              Saved {lastSaved.toLocaleTimeString()}
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
  );
};
