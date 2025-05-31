
import { toast } from "sonner";

export interface AppError {
  message: string;
  code?: string;
  field?: string;
  context?: Record<string, any>;
}

export class CampaignValidationError extends Error {
  public field?: string;
  public code?: string;
  
  constructor(message: string, field?: string, code?: string) {
    super(message);
    this.name = "CampaignValidationError";
    this.field = field;
    this.code = code;
  }
}

export class CampaignSubmissionError extends Error {
  public code?: string;
  
  constructor(message: string, code?: string) {
    super(message);
    this.name = "CampaignSubmissionError";
    this.code = code;
  }
}

// Error handling utilities
export const handleApiError = (error: any, context?: string): AppError => {
  console.error(`API Error${context ? ` in ${context}` : ""}:`, error);
  
  let message = "An unexpected error occurred";
  let code = "UNKNOWN_ERROR";
  
  if (error?.message) {
    message = error.message;
  }
  
  if (error?.code) {
    code = error.code;
  }
  
  // Handle specific error types
  if (error?.name === "ValidationError") {
    message = "Please check your input and try again";
    code = "VALIDATION_ERROR";
  }
  
  if (error?.status === 403) {
    message = "You don't have permission to perform this action";
    code = "PERMISSION_DENIED";
  }
  
  if (error?.status === 404) {
    message = "The requested resource was not found";
    code = "NOT_FOUND";
  }
  
  if (error?.status >= 500) {
    message = "Server error. Please try again later";
    code = "SERVER_ERROR";
  }
  
  return { message, code };
};

export const showErrorToast = (error: AppError | string) => {
  const message = typeof error === "string" ? error : error.message;
  toast.error(message);
};

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

// Validation utilities
export const validateRequired = (value: any, fieldName: string): void => {
  if (value === undefined || value === null || value === "") {
    throw new CampaignValidationError(`${fieldName} is required`, fieldName, "REQUIRED");
  }
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): void => {
  if (value.length < minLength) {
    throw new CampaignValidationError(
      `${fieldName} must be at least ${minLength} characters`,
      fieldName,
      "MIN_LENGTH"
    );
  }
};

export const validatePositiveNumber = (value: number, fieldName: string): void => {
  if (value <= 0) {
    throw new CampaignValidationError(
      `${fieldName} must be greater than 0`,
      fieldName,
      "POSITIVE_NUMBER"
    );
  }
};

export const validateFutureDate = (date: Date, fieldName: string): void => {
  if (date <= new Date()) {
    throw new CampaignValidationError(
      `${fieldName} must be in the future`,
      fieldName,
      "FUTURE_DATE"
    );
  }
};

// Retry utilities for failed operations
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
};
