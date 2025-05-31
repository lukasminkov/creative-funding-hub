
import { useState, useCallback } from "react";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";

interface FormState {
  isSubmitting: boolean;
  isSaving: boolean;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
}

export const useCampaignFormState = (initialCampaign?: Partial<Campaign>) => {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSaving: false,
    isLoading: false,
    lastSaved: null,
    hasUnsavedChanges: false
  });

  const [campaign, setCampaign] = useState<Partial<Campaign>>(initialCampaign || {});

  const updateCampaign = useCallback((updates: Partial<Campaign>) => {
    setCampaign(prev => ({ ...prev, ...updates }));
    setFormState(prev => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setFormState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setSubmitting = useCallback((submitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting: submitting }));
  }, []);

  const setSaving = useCallback((saving: boolean) => {
    setFormState(prev => ({ ...prev, isSaving: saving }));
  }, []);

  const markSaved = useCallback(() => {
    setFormState(prev => ({ 
      ...prev, 
      hasUnsavedChanges: false, 
      lastSaved: new Date(),
      isSaving: false
    }));
    toast.success("Campaign saved successfully");
  }, []);

  const saveDraft = useCallback(async () => {
    if (!campaign.title) {
      toast.error("Please enter a campaign title before saving");
      return false;
    }

    setSaving(true);
    
    try {
      // Simulate API call for draft saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage as backup
      const drafts = JSON.parse(localStorage.getItem("campaignDrafts") || "[]");
      const draftIndex = drafts.findIndex((d: any) => d.id === campaign.id);
      
      const draftData = {
        ...campaign,
        id: campaign.id || `draft-${Date.now()}`,
        isDraft: true,
        lastModified: new Date().toISOString()
      };

      if (draftIndex >= 0) {
        drafts[draftIndex] = draftData;
      } else {
        drafts.push(draftData);
      }
      
      localStorage.setItem("campaignDrafts", JSON.stringify(drafts));
      markSaved();
      return true;
    } catch (error) {
      toast.error("Failed to save draft");
      setSaving(false);
      return false;
    }
  }, [campaign, setSaving, markSaved]);

  const autoSave = useCallback(async () => {
    if (formState.hasUnsavedChanges && campaign.title) {
      await saveDraft();
    }
  }, [formState.hasUnsavedChanges, campaign.title, saveDraft]);

  return {
    campaign,
    formState,
    updateCampaign,
    setLoading,
    setSubmitting,
    setSaving,
    markSaved,
    saveDraft,
    autoSave
  };
};
