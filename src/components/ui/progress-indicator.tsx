
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'active' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const ProgressIndicator = ({
  steps,
  currentStep,
  className,
  orientation = 'horizontal'
}: ProgressIndicatorProps) => {
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const getStepIcon = (step: Step, index: number) => {
    if (step.status === 'completed') {
      return <Check className="h-4 w-4 text-white" />;
    }
    if (step.status === 'active') {
      return <Loader2 className="h-4 w-4 text-white animate-spin" />;
    }
    return <span className="text-xs font-medium">{index + 1}</span>;
  };

  const getStepColor = (step: Step, index: number) => {
    if (step.status === 'completed') return 'bg-green-500';
    if (step.status === 'active') return 'bg-primary';
    if (step.status === 'error') return 'bg-destructive';
    if (index <= currentStep) return 'bg-primary/70';
    return 'bg-muted';
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn("space-y-4", className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2",
                getStepColor(step, index),
                index <= currentStep ? "border-primary" : "border-muted",
                "transition-colors duration-200"
              )}
            >
              {getStepIcon(step, index)}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "text-sm font-medium",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </h4>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Progress value={progressPercentage} className="h-2" />
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 mb-2",
                getStepColor(step, index),
                index <= currentStep ? "border-primary" : "border-muted",
                "transition-colors duration-200"
              )}
            >
              {getStepIcon(step, index)}
            </div>
            <span className={cn(
              "text-xs font-medium text-center",
              index <= currentStep ? "text-foreground" : "text-muted-foreground"
            )}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
