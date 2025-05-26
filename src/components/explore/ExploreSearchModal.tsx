
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCard from "./CampaignCard";
import CreatorCard from "./CreatorCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ExploreSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSearchChange: (query: string) => void;
}

export default function ExploreSearchModal({ 
  open, 
  onOpenChange, 
  onSearchChange
}: ExploreSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Get data from localStorage within the component
  const campaigns = JSON.parse(localStorage.getItem("explore-campaigns") || "[]");
  const creators = JSON.parse(localStorage.getItem("explore-creators") || "[]");

  // Filter data based on search query across ALL categories
  const filteredCampaigns = campaigns.filter((campaign: any) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.contentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCreators = creators.filter((creator: any) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create mixed results
  const allResults = [
    ...filteredCampaigns.map((item: any) => ({ ...item, itemType: 'campaign' })),
    ...filteredCreators.map((item: any) => ({ ...item, itemType: 'creator' }))
  ];

  // Handle search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  // Clear search when modal closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      onSearchChange("");
    }
  }, [open, onSearchChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="sr-only">Search across all content</DialogTitle>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, creators, brands..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 text-base"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {searchQuery && (
            <div className="mb-4 text-sm text-muted-foreground">
              {allResults.length} result{allResults.length !== 1 ? 's' : ''} found
            </div>
          )}

          <ScrollArea className="h-[60vh]">
            <div className="space-y-4">
              {searchQuery === "" ? (
                <div className="text-center py-12 text-muted-foreground">
                  Start typing to search across campaigns and creators...
                </div>
              ) : allResults.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {/* Campaigns Section */}
                  {filteredCampaigns.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Campaigns ({filteredCampaigns.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {filteredCampaigns.map((campaign: any) => (
                          <CampaignCard 
                            key={campaign.id} 
                            campaign={campaign} 
                            isFeatured={campaign.featured} 
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Creators Section */}
                  {filteredCreators.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Creators ({filteredCreators.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCreators.map((creator: any) => (
                          <CreatorCard 
                            key={creator.id} 
                            creator={creator} 
                            isTop={creator.isTop} 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
