
import { useState } from "react";
import { PlusCircle, X, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RequirementsListProps {
  requirements: string[];
  onChange: (requirements: string[]) => void;
  maxItems?: number;
  title?: string;
}

const RequirementsList = ({ 
  requirements, 
  onChange, 
  maxItems = 5,
  title = "Requirements"
}: RequirementsListProps) => {
  const [newRequirement, setNewRequirement] = useState("");

  const handleAddRequirement = () => {
    if (newRequirement.trim() && requirements.length < maxItems) {
      const updatedRequirements = [...requirements, newRequirement.trim()];
      onChange(updatedRequirements);
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    onChange(updatedRequirements);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>{title}</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Add up to {maxItems} specific requirements ({requirements.length}/{maxItems})
        </p>
        
        <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Important:</p>
            <p>Creators must follow these requirements to be eligible for payout. If they don't follow them, their submission can be denied.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {requirements.map((requirement, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 bg-muted/30 p-2.5 rounded-md group"
          >
            <CheckCircle className="h-4 w-4 text-primary shrink-0" />
            <p className="flex-grow text-sm">{requirement}</p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-6 w-6 opacity-60 hover:opacity-100"
              onClick={() => handleRemoveRequirement(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {requirements.length < maxItems && (
          <div className="flex items-center gap-2">
            <Input
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a requirement..."
              className="flex-grow"
              maxLength={100}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim()}
              className="shrink-0"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementsList;
