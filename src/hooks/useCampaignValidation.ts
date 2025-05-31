
import { useState, useCallback } from "react";
import { z } from "zod";
import { 
  campaignSchema, 
  retainerCampaignSchema, 
  payPerViewCampaignSchema, 
  challengeCampaignSchema,
  CampaignFormErrors 
} from "@/lib/campaign-validation";
import { Campaign, CampaignType } from "@/lib/campaign-types";

export const useCampaignValidation = (campaignType: CampaignType) => {
  const [errors, setErrors] = useState<CampaignFormErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const getSchemaForType = useCallback((type: CampaignType) => {
    switch (type) {
      case "retainer":
        return retainerCampaignSchema;
      case "payPerView":
        return payPerViewCampaignSchema;
      case "challenge":
        return challengeCampaignSchema;
      default:
        return campaignSchema;
    }
  }, []);

  const validateField = useCallback((fieldName: string, value: any, campaignData: Partial<Campaign>) => {
    const schema = getSchemaForType(campaignType);
    
    try {
      // Create a partial validation for the specific field
      const fieldSchema = schema.pick({ [fieldName]: true } as any);
      fieldSchema.parse({ [fieldName]: value });
      
      // Clear the error for this field
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find(err => err.path.includes(fieldName));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }));
        }
      }
      return false;
    }
  }, [campaignType, getSchemaForType]);

  const validateForm = useCallback(async (campaignData: Partial<Campaign>) => {
    setIsValidating(true);
    
    try {
      const schema = getSchemaForType(campaignType);
      const result = await schema.parseAsync(campaignData);
      
      setErrors({});
      setIsValid(true);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: CampaignFormErrors = {};
        
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.');
          formErrors[fieldName] = err.message;
        });
        
        setErrors(formErrors);
        setIsValid(false);
        return { success: false, errors: formErrors };
      }
      
      return { success: false, errors: { general: "Validation failed" } };
    } finally {
      setIsValidating(false);
    }
  }, [campaignType, getSchemaForType]);

  const validateStep = useCallback(async (stepFields: string[], campaignData: Partial<Campaign>) => {
    const schema = getSchemaForType(campaignType);
    const stepErrors: CampaignFormErrors = {};
    
    try {
      // Validate only the fields for this step
      const stepSchema = schema.pick(
        stepFields.reduce((acc, field) => ({ ...acc, [field]: true }), {}) as any
      );
      
      await stepSchema.parseAsync(campaignData);
      
      // Clear errors for step fields
      setErrors(prev => {
        const newErrors = { ...prev };
        stepFields.forEach(field => delete newErrors[field]);
        return newErrors;
      });
      
      return { success: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.');
          if (stepFields.includes(fieldName)) {
            stepErrors[fieldName] = err.message;
          }
        });
        
        setErrors(prev => ({ ...prev, ...stepErrors }));
        return { success: false, errors: stepErrors };
      }
      
      return { success: false, errors: { general: "Step validation failed" } };
    }
  }, [campaignType, getSchemaForType]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setIsValid(false);
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName];
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    isValidating,
    isValid,
    hasErrors,
    validateField,
    validateForm,
    validateStep,
    clearErrors,
    getFieldError
  };
};
