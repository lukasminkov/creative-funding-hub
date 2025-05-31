
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CONTENT_TYPES } from "@/lib/campaign-types";

interface ContentTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const ContentTypeSelector = ({ value, onChange, required = true }: ContentTypeSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="contentType">
        Content Type {required && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select content type" />
        </SelectTrigger>
        <SelectContent>
          {CONTENT_TYPES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ContentTypeSelector;
