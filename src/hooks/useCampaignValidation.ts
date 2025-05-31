import { useState, useCallback } from "react";
import { z } from "zod";
import { 
  retainerCampaignSchema, 
  payPerViewCampaignSchema, 
  challengeCampaignSchema,
  createFieldValidator,
  validateCampaignByType,
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
        return retainerCampaignSchema;
    }
  }, []);

  const validateField = useCallback((fieldName: string, value: any, campaignData: Partial<Campaign>) => {
    try {
      const fieldValidator = createFieldValidator(campaignType);
      
      // Create a test object with just this field
      const testData = { [fieldName]: value, type: campaignType };
      
      // Try to parse just this field
      const result = fieldValidator.safeParse(testData);
      
      if (result.success) {
        // Clear the error for this field
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
        return true;
      } else {
        const fieldError = result.error.errors.find(err => err.path.includes(fieldName));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }));
        }
        return false;
      }
    } catch (error) {
      console.error("Field validation error:", error);
      return false;
    }
  }, [campaignType]);

  const validateForm = useCallback(async (campaignData: Partial<Campaign>) => {
    setIsValidating(true);
    
    try {
      // Use the new validation function instead of discriminated union
      const result = validateCampaignByType(campaignData);
      
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
      
      return { success: false, errors: { general: error instanceof Error ? error.message : "Validation failed" } };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateStep = useCallback(async (stepFields: string[], campaignData: Partial<Campaign>) => {
    const stepErrors: CampaignFormErrors = {};
    
    try {
      // Simple field-by-field validation for steps
      for (const fieldName of stepFields) {
        const value = (campaignData as any)[fieldName];
        
        // Skip validation for undefined optional fields
        if (value === undefined || value === null || value === "") {
          // Check if it's a required field
          if (fieldName === "title" || fieldName === "description" || fieldName === "totalBudget" || 
              fieldName === "contentType" || fieldName === "category" || fieldName === "platforms" ||
              fieldName === "endDate" || fieldName === "countryAvailability") {
            stepErrors[fieldName] = `${fieldName} is required`;
          }
          continue;
        }
        
        // Basic validation rules
        switch (fieldName) {
          case "title":
            if (typeof value === "string" && value.length < 3) {
              stepErrors[fieldName] = "Title must be at least 3 characters";
            }
            break;
          case "description":
            if (typeof value === "string" && value.length < 10) {
              stepErrors[fieldName] = "Description must be at least 10 characters";
            }
            break;
          case "totalBudget":
            if (typeof value === "number" && value <= 0) {
              stepErrors[fieldName] = "Budget must be greater than 0";
            }
            break;
          case "platforms":
            if (Array.isArray(value) && value.length === 0) {
              stepErrors[fieldName] = "At least one platform is required";
            }
            break;
          case "endDate":
            if (value instanceof Date && value <= new Date()) {
              stepErrors[fieldName] = "End date must be in the future";
            }
            break;
        }
      }
      
      // Update errors
      setErrors(prev => {
        const newErrors = { ...prev };
        // Clear errors for step fields that are now valid
        stepFields.forEach(field => {
          if (!stepErrors[field]) {
            delete newErrors[field];
          }
        });
        // Add new errors
        return { ...newErrors, ...stepErrors };
      });
      
      return { 
        success: Object.keys(stepErrors).length === 0, 
        errors: stepErrors 
      };
    } catch (error) {
      console.error("Step validation error:", error);
      return { success: false, errors: { general: "Step validation failed" } };
    }
  }, []);

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
