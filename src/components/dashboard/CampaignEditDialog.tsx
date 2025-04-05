
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertCampaignToDatabase } from "@/lib/campaign-utils";

interface CampaignEditDialogProps {
  campaign: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignUpdated?: () => void;
}

export default function CampaignEditDialog({ 
  campaign, 
  open, 
  onOpenChange,
  onCampaignUpdated 
}: CampaignEditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitCampaign = async (updatedCampaign: Campaign) => {
    if (!campaign?.id) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure the budget stays the same as the original campaign
      const finalCampaign = {
        ...updatedCampaign,
        totalBudget: campaign.totalBudget
      };
      
      // Format for database using the utility
      const formattedCampaign = convertCampaignToDatabase(finalCampaign);
      
      // Update in Supabase
      const { error } = await supabase
        .from('campaigns')
        .update(formattedCampaign)
        .eq('id', campaign.id);
      
      if (error) {
        console.error("Error updating campaign:", error);
        toast.error("Failed to update campaign: " + error.message);
        return;
      }
      
      toast.success("Campaign updated successfully!");
      onOpenChange(false);
      if (onCampaignUpdated) onCampaignUpdated();
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle>Edit Campaign</DialogTitle>
          <DialogDescription>
            Update your campaign details and settings
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-6">
          {campaign && (
            <CampaignCreator 
              onSubmit={handleSubmitCampaign}
              onCancel={handleCancelEdit}
              campaign={campaign}
              isEditing={true}
              disableBudgetEdit={true}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
