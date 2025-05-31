
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface AccessibleButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    children, 
    isLoading, 
    loadingText, 
    ariaLabel, 
    ariaDescribedBy,
    disabled,
    className,
    ...props 
  }, ref) => {
    const isDisabled = disabled || isLoading;

    return (
      <Button
        ref={ref}
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-busy={isLoading}
        className={cn(
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "transition-all duration-200",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isLoading ? loadingText || 'Loading...' : children}
      </Button>
    );
  }
);

AccessibleButton.displayName = "AccessibleButton";
