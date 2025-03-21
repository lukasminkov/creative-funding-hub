
import { Label } from "@/components/ui/label";
import { CountryOption, COUNTRY_OPTIONS, getCountryLabel } from "@/lib/campaign-types";
import { Globe, Map } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CountrySelectorProps {
  selectedCountry: CountryOption;
  onChange: (country: CountryOption) => void;
}

const CountrySelector = ({ selectedCountry, onChange }: CountrySelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="country-selector">
          Campaign Availability
        </Label>
      </div>
      <div className="text-sm text-muted-foreground mb-2">
        The campaign will be available for users in the following countries
      </div>
      <Select
        value={selectedCountry}
        onValueChange={(value) => onChange(value as CountryOption)}
      >
        <SelectTrigger className="w-full" id="country-selector">
          <SelectValue placeholder="Select country availability" />
        </SelectTrigger>
        <SelectContent className="bg-popover">
          {COUNTRY_OPTIONS.map((country) => (
            <SelectItem key={country} value={country}>
              {getCountryLabel(country)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountrySelector;
