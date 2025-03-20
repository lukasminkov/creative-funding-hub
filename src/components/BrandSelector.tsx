
import { useState } from "react";
import { Building2, Check, ChevronRight, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface BrandSelectorProps {
  onBrandSelect: (brand: Brand) => void;
  onCancel: () => void;
}

// Sample brands for demonstration
const sampleBrands: Brand[] = [
  {
    id: "1",
    name: "Nike",
    logo: "https://placehold.co/40x40?text=N",
  },
  {
    id: "2",
    name: "Adidas",
    logo: "https://placehold.co/40x40?text=A", 
  },
  {
    id: "3",
    name: "Puma",
    logo: "https://placehold.co/40x40?text=P",
  },
  {
    id: "4",
    name: "Under Armour",
    logo: "https://placehold.co/40x40?text=UA",
  },
  {
    id: "5",
    name: "New Balance",
    logo: "https://placehold.co/40x40?text=NB",
  },
];

const BrandSelector = ({ onBrandSelect, onCancel }: BrandSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [brands] = useState<Brand[]>(sampleBrands);
  
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
      <div className="p-6 border-b border-border/60">
        <h2 className="text-2xl font-medium">Select a Brand</h2>
        <p className="text-muted-foreground">Choose which brand this campaign is for</p>
      </div>
      
      <div className="p-6">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search brands..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-12"
          />
          <CommandList>
            <CommandEmpty>No brands found.</CommandEmpty>
            <CommandGroup heading="Your Brands">
              {filteredBrands.map((brand) => (
                <CommandItem
                  key={brand.id}
                  onSelect={() => onBrandSelect(brand)}
                  className="flex items-center p-2 cursor-pointer"
                >
                  {brand.logo ? (
                    <div className="h-10 w-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={brand.logo} 
                        alt={brand.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center mr-3 flex-shrink-0">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{brand.name}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-70" />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Brand
          </Button>
        </div>
      </div>
      
      <div className="p-6 border-t border-border/60 flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline" onClick={() => onBrandSelect(brands[0])}>
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default BrandSelector;
