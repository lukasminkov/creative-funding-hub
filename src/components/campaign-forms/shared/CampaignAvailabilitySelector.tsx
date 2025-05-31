
import React from "react";
import CountrySelector from "@/components/CountrySelector";

interface CampaignAvailabilitySelectorProps {
  selectedCountry: string;
  onChange: (country: string) => void;
}

const CampaignAvailabilitySelector = ({ selectedCountry, onChange }: CampaignAvailabilitySelectorProps) => {
  return (
    <div className="space-y-2 col-span-2">
      <CountrySelector
        selectedCountry={selectedCountry}
        onChange={onChange}
      />
    </div>
  );
};

export default CampaignAvailabilitySelector;
