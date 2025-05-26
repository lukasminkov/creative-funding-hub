
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertCampaignToDatabase } from "@/lib/campaign-utils";
import { useNavigate } from "react-router-dom";

interface CampaignFormDialogProps {
  campaign?: Campaign | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCampaignUpdated?: () => void;
  isEditing?: boolean;
}

export default function CampaignFormDialog({ 
  campaign, 
  open, 
  onOpenChange,
  onCampaignUpdated,
  isEditing = false
}: CampaignFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmitCampaign = async (updatedCampaign: Campaign) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing && campaign?.id) {
        // Ensure the budget stays the same as the original campaign when editing
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
      } else {
        // Create new campaign
        // Format campaign for database using utility
        const formattedCampaign = convertCampaignToDatabase(updatedCampaign);
        
        // Insert into Supabase
        const { data, error } = await supabase
          .from('campaigns')
          .insert([formattedCampaign])
          .select();
        
        if (error) {
          console.error("Error creating campaign:", error);
          toast.error("Failed to create campaign: " + error.message);
          return;
        }
        
        toast.success("Campaign created successfully!");
        if (data && data.length > 0) {
          navigate(`/dashboard/campaigns/${data[0].id}`);
        }
      }
      
      onOpenChange(false);
      if (onCampaignUpdated) onCampaignUpdated();
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("Failed to save campaign: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 flex flex-col bg-background/95 backdrop-blur-sm border-border/50">
        <DialogHeader className="p-6 border-b border-border/30 bg-gradient-to-r from-background to-muted/30">
          <DialogTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {isEditing ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden">
          <CampaignCreator 
            onSubmit={handleSubmitCampaign}
            onCancel={handleCancelEdit}
            campaign={campaign || undefined}
            isEditing={isEditing}
            disableBudgetEdit={isEditing}
            isModal={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
