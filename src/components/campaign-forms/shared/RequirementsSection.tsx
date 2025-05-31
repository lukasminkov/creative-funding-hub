
import React from "react";
import RequirementsList from "@/components/RequirementsList";

interface RequirementsSectionProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
  title?: string;
}

const RequirementsSection = ({ 
  requirements, 
  onChange, 
  title = "Specific Requirements" 
}: RequirementsSectionProps) => {
  return (
    <div className="space-y-2 col-span-2">
      <RequirementsList
        requirements={requirements}
        onChange={onChange}
        title={title}
      />
    </div>
  );
};

export default RequirementsSection;
