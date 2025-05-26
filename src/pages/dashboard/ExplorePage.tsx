
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Sparkles } from "lucide-react";
import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreSearchModal from "@/components/explore/ExploreSearchModal";
import ForYouFeed from "@/components/explore/ForYouFeed";
import CampaignsTab from "@/components/explore/CampaignsTab";
import CreatorsTab from "@/components/explore/CreatorsTab";
import { useQuery } from "@tanstack/react-query";

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [activeTab, setActiveTab] = useState("forYou");

  // Fetch explore data from localStorage
  const { data: exploreCreators = [], isLoading: creatorsLoading } = useQuery({
    queryKey: ["explore-creators"],
    queryFn: () => {
      const stored = localStorage.getItem("explore-creators");
      return stored ? JSON.parse(stored) : [];
    }
  });

  const { data: exploreCampaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ["explore-campaigns"], 
    queryFn: () => {
      const stored = localStorage.getItem("explore-campaigns");
      return stored ? JSON.parse(stored) : [];
    }
  });

  const isLoading = creatorsLoading || campaignsLoading;

  // Filter data based on search
  const filteredCreators = exploreCreators.filter((creator: any) =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCampaigns = exploreCampaigns.filter((campaign: any) =>
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate featured/top from regular
  const topCreators = filteredCreators.filter((creator: any) => creator.isTop);
  const regularCreators = filteredCreators.filter((creator: any) => !creator.isTop);
  const featuredCampaigns = filteredCampaigns.filter((campaign: any) => campaign.featured);
  const regularCampaigns = filteredCampaigns.filter((campaign: any) => !campaign.featured);

  // Create mixed "For You" feed
  const forYouFeed = [...featuredCampaigns.slice(0, 2), ...topCreators.slice(0, 3), ...regularCampaigns.slice(0, 3), ...regularCreators.slice(0, 2)];

  return (
    <div className="min-h-screen bg-background">
      <ExploreHeader onSearchClick={() => setShowSearchModal(true)} />
      
      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="search"
              placeholder="Search campaigns, creators, or brands..."
              className="pl-10 pr-4 py-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearchModal(true)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="forYou" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              For You
            </TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
          </TabsList>

          <TabsContent value="forYou">
            <ForYouFeed 
              forYouFeed={forYouFeed}
              isLoading={isLoading}
              searchQuery={searchQuery}
            />
          </TabsContent>

          <TabsContent value="campaigns">
            <CampaignsTab
              isLoading={isLoading}
              featuredCampaigns={featuredCampaigns}
              regularCampaigns={regularCampaigns}
            />
          </TabsContent>

          <TabsContent value="creators">
            <CreatorsTab
              isLoading={isLoading}
              topCreators={topCreators}
              regularCreators={regularCreators}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ExploreSearchModal
        open={showSearchModal}
        onOpenChange={setShowSearchModal}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
