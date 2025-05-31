
import React from "react";
import { Label } from "@/components/ui/label";
import PlatformSelector from "@/components/PlatformSelector";
import { Platform } from "@/lib/campaign-types";

interface PlatformSectionProps {
  selectedPlatforms: Platform[];
  onChange: (platform: string) => void;
  singleSelection?: boolean;
  helpText?: string;
  required?: boolean;
}

const PlatformSection = ({ 
  selectedPlatforms, 
  onChange, 
  singleSelection = false, 
  helpText,
  required = true 
}: PlatformSectionProps) => {
  const defaultHelpText = singleSelection 
    ? "Select the platform where creators will post content"
    : "Select platforms where creators will post content";

  return (
    <div className="space-y-2 col-span-2">
      <Label>
        Platform{!singleSelection ? 's' : ''} {required && <span className="text-destructive">*</span>}
      </Label>
      <PlatformSelector
        selectedPlatforms={selectedPlatforms}
        selectedPlatform={singleSelection ? selectedPlatforms[0] : undefined}
        onChange={onChange}
        showLabel={false}
        singleSelection={singleSelection}
      />
      <p className="text-xs text-muted-foreground mt-1">
        {helpText || defaultHelpText}
      </p>
    </div>
  );
};

export default PlatformSection;
