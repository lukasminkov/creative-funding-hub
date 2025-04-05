import React from "react";
import { Campaign } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PayPerViewFormProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const PayPerViewForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: PayPerViewFormProps) => {
  // Sample implementation - the actual component would have much more
  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ... other fields */}
          
          <div className="space-y-2">
            <Label htmlFor="totalBudget">Total Budget</Label>
            <Input
              id="totalBudget"
              type="number"
              min="0"
              value={campaign.totalBudget || ""}
              onChange={(e) => onChange({ totalBudget: Number(e.target.value) })}
              placeholder="Campaign budget"
              disabled={disableBudgetEdit}
              className={disableBudgetEdit ? "bg-muted cursor-not-allowed" : ""}
            />
            {disableBudgetEdit && (
              <p className="text-xs text-muted-foreground mt-1">
                Budget can only be increased using the "Add Budget" button
              </p>
            )}
          </div>
          
          {/* ... other fields */}
        </div>
      )}
      
      {showCreatorInfoSection && (
        <div>
          {/* ... creator info section fields */}
        </div>
      )}
    </div>
  );
};

export default PayPerViewForm;
