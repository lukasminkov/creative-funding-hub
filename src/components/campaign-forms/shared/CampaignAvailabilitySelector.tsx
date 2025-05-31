
import React from "react";
import CountrySelector from "@/components/CountrySelector";

interface CampaignAvailabilitySelectorProps {
  selectedCountry: "worldwide" | "usa" | "mexico" | "canada" | "dach";
  onChange: (country: "worldwide" | "usa" | "mexico" | "canada" | "dach") => void;
}

const CampaignAvailabilitySelector = ({ selectedCountry, onChange }: CampaignAvailabilitySelectorProps) => {
  const handleChange = (country: string) => {
    onChange(country as "worldwide" | "usa" | "mexico" | "canada" | "dach");
  };

  return (
    <div className="space-y-2 col-span-2">
      <CountrySelector
        selectedCountry={selectedCountry}
        onChange={handleChange}
      />
    </div>
  );
};

export default CampaignAvailabilitySelector;
