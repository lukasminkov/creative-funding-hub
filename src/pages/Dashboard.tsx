
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CampaignCreator from "@/components/CampaignCreator";
import BrandSelector, { Brand } from "@/components/BrandSelector";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";

const Dashboard = () => {
  const [isCreating, setIsCreating] = useState(true);
  const [showBrandSelector, setShowBrandSelector] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  // Load campaigns from localStorage on component mount
  useEffect(() => {
    const storedCampaigns = localStorage.getItem("campaigns");
    if (storedCampaigns) {
      try {
        setCampaigns(JSON.parse(storedCampaigns));
      } catch (e) {
        console.error("Error parsing stored campaigns:", e);
      }
    }
  }, []);

  // Save campaigns to localStorage when they change
  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowBrandSelector(false);
    toast.success(`Selected brand: ${brand.name}`);
  };

  const handleSubmitCampaign = (campaign: Campaign) => {
    // Convert File objects to URLs for storage and display
    const preparedCampaign = {
      ...campaign,
      id: crypto.randomUUID(),
      brandId: selectedBrand?.id,
      brandName: selectedBrand?.name
    };
    
    // Create an object URL if we have a video file
    if (campaign.instructionVideoFile) {
      preparedCampaign.instructionVideo = URL.createObjectURL(campaign.instructionVideoFile);
    }
    
    setCampaigns([...campaigns, preparedCampaign]);
    setIsCreating(false);
    setShowBrandSelector(true);
    setSelectedBrand(null);
    toast.success("Campaign created successfully!");
  };

  const handleCancelCreation = () => {
    if (showBrandSelector) {
      setIsCreating(false);
    } else {
      // Go back to brand selection
      setShowBrandSelector(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-medium">Campaign Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!isCreating && (
              <Button onClick={() => {
                setIsCreating(true);
                setShowBrandSelector(true);
              }}>
                Create Campaign
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {isCreating ? (
          showBrandSelector ? (
            <BrandSelector 
              onBrandSelect={handleBrandSelect} 
              onCancel={() => setIsCreating(false)} 
            />
          ) : (
            <div>
              {selectedBrand && (
                <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Creating campaign for:</span>
                  <span className="bg-muted px-2 py-1 rounded-md font-medium">{selectedBrand.name}</span>
                </div>
              )}
              <CampaignCreator 
                onCancel={handleCancelCreation} 
                onSubmit={handleSubmitCampaign} 
              />
            </div>
          )
        ) : (
          <div className="grid gap-8">
            {campaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-card border border-border rounded-lg overflow-hidden">
                    {campaign.bannerImage ? (
                      <div className="h-40 relative">
                        <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-4">
                          <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
                          <p className="text-sm text-white/80">
                            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                            {campaign.brandName && ` • ${campaign.brandName}`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border-b border-border/60">
                        <h3 className="text-lg font-medium">{campaign.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                          {campaign.brandName && ` • ${campaign.brandName}`}
                        </p>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm">Budget: <span className="font-medium">{new Intl.NumberFormat('en-US', { 
                          style: 'currency', 
                          currency: campaign.currency || 'USD'
                        }).format(campaign.totalBudget || 0)}</span></div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-8 text-center">
                <h2 className="text-2xl font-medium mb-4">No campaigns yet</h2>
                <p className="text-muted-foreground mb-6">
                  Create your first campaign to get started
                </p>
                <Button onClick={() => {
                  setIsCreating(true);
                  setShowBrandSelector(true);
                }}>
                  Create Campaign
                </Button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
