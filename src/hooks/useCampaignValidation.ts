
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
import { Campaign, CampaignType, CampaignValidationErrors } from "@/types/campaign.types";
import { debugLogger, logCampaignValidation, logCampaignError } from "@/utils/debugLogger";

export const useCampaignValidation = (campaignType: CampaignType) => {
  const [errors, setErrors] = useState<CampaignValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const getSchemaForType = useCallback((type: CampaignType) => {
    logCampaignValidation(`Getting schema for campaign type: ${type}`);
    
    switch (type) {
      case "retainer":
        return retainerCampaignSchema;
      case "payPerView":
        return payPerViewCampaignSchema;
      case "challenge":
        return challengeCampaignSchema;
      default:
        logCampaignError(`Unknown campaign type: ${type}, defaulting to retainer schema`);
        return retainerCampaignSchema;
    }
  }, []);

  const validateField = useCallback((fieldName: string, value: any, campaignData: Partial<Campaign>) => {
    const timer = debugLogger.startTimer('FIELD_VALIDATION', `Validating field: ${fieldName}`);
    
    try {
      const fieldValidator = createFieldValidator(campaignType);
      
      // Create a test object with just this field
      const testData = { [fieldName]: value, type: campaignType };
      logCampaignValidation(`Validating field ${fieldName}`, { value, testData });
      
      // Try to parse just this field
      const result = fieldValidator.safeParse(testData);
      
      if (result.success) {
        // Clear the error for this field
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName as keyof CampaignValidationErrors];
          logCampaignValidation(`Field validation passed for ${fieldName}`, { newErrors });
          return newErrors;
        });
        timer();
        return true;
      } else {
        const fieldError = result.error.errors.find(err => err.path.includes(fieldName));
        if (fieldError) {
          setErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }));
          logCampaignValidation(`Field validation failed for ${fieldName}`, { error: fieldError.message });
        }
        timer();
        return false;
      }
    } catch (error) {
      logCampaignError(`Field validation error for ${fieldName}`, error);
      timer();
      return false;
    }
  }, [campaignType]);

  const validateForm = useCallback(async (campaignData: Partial<Campaign>) => {
    const timer = debugLogger.startTimer('FORM_VALIDATION', 'Full form validation');
    setIsValidating(true);
    
    try {
      logCampaignValidation('Starting full form validation', { campaignType, campaignData });
      
      // Use the new validation function instead of discriminated union
      const result = validateCampaignByType(campaignData);
      
      setErrors({});
      setIsValid(true);
      logCampaignValidation('Form validation successful', { result });
      timer();
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: CampaignValidationErrors = {};
        
        error.errors.forEach((err) => {
          const fieldName = err.path.join('.') as keyof CampaignValidationErrors;
          formErrors[fieldName] = err.message;
        });
        
        setErrors(formErrors);
        setIsValid(false);
        logCampaignValidation('Form validation failed with Zod errors', { errors: formErrors });
        timer();
        return { success: false, errors: formErrors };
      }
      
      const generalError = { general: error instanceof Error ? error.message : "Validation failed" };
      logCampaignError('Form validation failed with general error', error);
      timer();
      return { success: false, errors: generalError };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateStep = useCallback(async (stepFields: string[], campaignData: Partial<Campaign>) => {
    const timer = debugLogger.startTimer('STEP_VALIDATION', `Validating step with fields: ${stepFields.join(', ')}`);
    const stepErrors: CampaignValidationErrors = {};
    
    try {
      logCampaignValidation('Starting step validation', { stepFields, campaignData });
      
      // Simple field-by-field validation for steps
      for (const fieldName of stepFields) {
        const value = (campaignData as any)[fieldName];
        
        // Skip validation for undefined optional fields
        if (value === undefined || value === null || value === "") {
          // Check if it's a required field
          if (fieldName === "title" || fieldName === "description" || fieldName === "totalBudget" || 
              fieldName === "contentType" || fieldName === "category" || fieldName === "platforms" ||
              fieldName === "endDate" || fieldName === "countryAvailability") {
            stepErrors[fieldName as keyof CampaignValidationErrors] = `${fieldName} is required`;
            logCampaignValidation(`Required field ${fieldName} is missing`);
          }
          continue;
        }
        
        // Basic validation rules
        switch (fieldName) {
          case "title":
            if (typeof value === "string" && value.length < 3) {
              stepErrors.title = "Title must be at least 3 characters";
              logCampaignValidation('Title validation failed: too short', { value });
            }
            break;
          case "description":
            if (typeof value === "string" && value.length < 10) {
              stepErrors.description = "Description must be at least 10 characters";
              logCampaignValidation('Description validation failed: too short', { value });
            }
            break;
          case "totalBudget":
            if (typeof value === "number" && value <= 0) {
              stepErrors.totalBudget = "Budget must be greater than 0";
              logCampaignValidation('Budget validation failed: not positive', { value });
            }
            break;
          case "platforms":
            if (Array.isArray(value) && value.length === 0) {
              stepErrors.platforms = "At least one platform is required";
              logCampaignValidation('Platforms validation failed: empty array', { value });
            }
            break;
          case "endDate":
            if (value instanceof Date && value <= new Date()) {
              stepErrors.endDate = "End date must be in the future";
              logCampaignValidation('End date validation failed: in the past', { value });
            }
            break;
        }
      }
      
      // Update errors
      setErrors(prev => {
        const newErrors = { ...prev };
        // Clear errors for step fields that are now valid
        stepFields.forEach(field => {
          if (!stepErrors[field as keyof CampaignValidationErrors]) {
            delete newErrors[field as keyof CampaignValidationErrors];
          }
        });
        // Add new errors
        const finalErrors = { ...newErrors, ...stepErrors };
        logCampaignValidation('Step validation completed', { stepErrors, finalErrors });
        return finalErrors;
      });
      
      timer();
      return { 
        success: Object.keys(stepErrors).length === 0, 
        errors: stepErrors 
      };
    } catch (error) {
      logCampaignError('Step validation failed with error', error);
      timer();
      return { success: false, errors: { general: "Step validation failed" } };
    }
  }, []);

  const clearErrors = useCallback(() => {
    logCampaignValidation('Clearing all validation errors');
    setErrors({});
    setIsValid(false);
  }, []);

  const getFieldError = useCallback((fieldName: string) => {
    return errors[fieldName as keyof CampaignValidationErrors];
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
