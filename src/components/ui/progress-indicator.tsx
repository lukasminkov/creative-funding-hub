
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
      return <span className="text-sm font-semibold text-white">{index + 1}</span>;
    }
    return <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>;
  };

  const getStepStyles = (step: Step, index: number) => {
    const baseClasses = "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300";
    
    if (step.status === 'completed') {
      return cn(baseClasses, "bg-green-500 border-green-500 shadow-lg");
    }
    if (step.status === 'active') {
      return cn(baseClasses, "bg-primary border-primary shadow-lg ring-4 ring-primary/20");
    }
    if (step.status === 'error') {
      return cn(baseClasses, "bg-destructive border-destructive");
    }
    return cn(baseClasses, "bg-muted border-muted-foreground/30 hover:border-muted-foreground/50");
  };

  const getConnectorStyles = (index: number) => {
    const isCompleted = index < currentStep;
    return cn(
      "flex-1 h-0.5 mx-2 transition-colors duration-300",
      isCompleted ? "bg-green-500" : "bg-muted"
    );
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn("space-y-6", className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={getStepStyles(step, index)}>
                {getStepIcon(step, index)}
              </div>
              {index < steps.length - 1 && (
                <div className={cn(
                  "w-0.5 h-8 mt-2 transition-colors duration-300",
                  index < currentStep ? "bg-green-500" : "bg-muted"
                )} />
              )}
            </div>
            <div className="flex-1 min-w-0 pt-2">
              <h4 className={cn(
                "text-sm font-semibold",
                step.status === 'active' ? "text-primary" :
                step.status === 'completed' ? "text-green-600" :
                "text-muted-foreground"
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
    <div className={cn("space-y-6", className)}>
      {/* Progress Bar */}
      <div className="relative">
        <Progress value={progressPercentage} className="h-2" />
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-3 h-3 rounded-full border-2 border-background transition-colors duration-300",
                index <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center min-w-0 flex-1">
              <div className={getStepStyles(step, index)}>
                {getStepIcon(step, index)}
              </div>
              <div className="mt-3 text-center">
                <span className={cn(
                  "text-sm font-semibold block",
                  step.status === 'active' ? "text-primary" :
                  step.status === 'completed' ? "text-green-600" :
                  "text-muted-foreground"
                )}>
                  {step.title}
                </span>
                {step.description && (
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={getConnectorStyles(index)} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
