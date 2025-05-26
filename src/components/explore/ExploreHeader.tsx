
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface ExploreHeaderProps {
  onSearchClick?: () => void;
}

export default function ExploreHeader({ onSearchClick }: ExploreHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Explore</h2>
        <p className="text-muted-foreground">
          Discover campaigns and creators on the platform
        </p>
      </div>
      
      {onSearchClick && (
        <Button
          variant="outline"
          onClick={onSearchClick}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Search all content
        </Button>
      )}
    </div>
  );
}
