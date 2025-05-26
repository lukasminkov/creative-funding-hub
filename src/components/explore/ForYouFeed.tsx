
import { ScrollArea } from "@/components/ui/scroll-area";
import CampaignCard from "./CampaignCard";
import CreatorCard from "./CreatorCard";

interface ForYouFeedProps {
  forYouFeed: any[];
  isLoading: boolean;
  searchQuery: string;
}

export default function ForYouFeed({ forYouFeed, isLoading, searchQuery }: ForYouFeedProps) {
  const renderForYouFeedItem = (item: any) => {
    if (item.itemType === 'campaign') {
      return (
        <div key={`campaign-${item.id}`} className="w-full max-w-md mx-auto mb-4">
          <CampaignCard campaign={item} isFeatured={item.featured} />
        </div>
      );
    } else {
      return (
        <div key={`creator-${item.id}`} className="w-full max-w-md mx-auto mb-4">
          <CreatorCard creator={item} isTop={item.isTop} />
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-muted-foreground">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4 px-4">
          {forYouFeed.map((item: any, index) => renderForYouFeedItem(item))}
          {forYouFeed.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchQuery ? "No results found" : "No content available"}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
