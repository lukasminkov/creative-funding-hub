
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ExploreHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function ExploreHeader({ searchQuery, setSearchQuery }: ExploreHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Explore</h2>
        <p className="text-muted-foreground">
          Discover campaigns and creators on the platform
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        {showSearch && (
          <div className="flex items-center gap-2 animate-fade-in">
            <Input
              placeholder="Search campaigns, creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowSearch(false);
                setSearchQuery("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        {!showSearch && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
