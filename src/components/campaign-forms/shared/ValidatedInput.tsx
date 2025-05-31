
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ValidatedInputProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  type?: string;
  min?: string | number;
  step?: string | number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const ValidatedInput = ({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  type = "text",
  min,
  step,
  placeholder,
  disabled = false,
  className
}: ValidatedInputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id} className={cn(error && "text-destructive")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        min={min}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          error && "border-destructive focus-visible:ring-destructive",
          disabled && "bg-muted cursor-not-allowed"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
};
