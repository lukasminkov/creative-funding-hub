import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandSelector, { Brand } from "@/components/BrandSelector";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import DefaultCampaignBanner from "@/components/DefaultCampaignBanner";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";

const Dashboard = () => {
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showBrandSelector, setShowBrandSelector] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (campaigns.length > 0) {
      localStorage.setItem("campaigns", JSON.stringify(campaigns));
    }
  }, [campaigns]);

  const handleBrandSelect = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowBrandSelector(false);
    setShowCampaignModal(true);
    toast.success(`Selected brand: ${brand.name}`);
  };

  const handleCreateCampaignClick = () => {
    setShowBrandSelector(true);
  };

  const handleCampaignCreated = () => {
    // Refresh campaigns list or handle as needed
    const storedCampaigns = localStorage.getItem("campaigns");
    if (storedCampaigns) {
      try {
        setCampaigns(JSON.parse(storedCampaigns));
      } catch (e) {
        console.error("Error parsing stored campaigns:", e);
      }
    }
    setSelectedBrand(null);
  };

  const handleMessageBrand = (brandId: string | number, brandName: string) => {
    toast.success(`Opening message with ${brandName}`);
    navigate("/dashboard/messages", { 
      state: { 
        brandId, 
        brandName,
        initiateMessage: true 
      } 
    });
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
            <Button onClick={handleCreateCampaignClick}>
              Create Campaign
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                    <DefaultCampaignBanner 
                      title={campaign.title}
                      type={campaign.type}
                    />
                  )}
                  
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-sm">Budget: <span className="font-medium">{new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: campaign.currency || 'USD'
                      }).format(campaign.totalBudget || 0)}</span></div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        View Details
                      </Button>
                      {campaign.brandId && campaign.brandName && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="flex-none"
                          onClick={() => handleMessageBrand(campaign.brandId!, campaign.brandName!)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span className="sr-only">Message {campaign.brandName}</span>
                        </Button>
                      )}
                    </div>
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
              <Button onClick={handleCreateCampaignClick}>
                Create Campaign
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Brand Selector Modal */}
      {showBrandSelector && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <BrandSelector 
              onBrandSelect={handleBrandSelect} 
              onCancel={() => setShowBrandSelector(false)} 
            />
          </div>
        </div>
      )}

      {/* Campaign Creation Modal */}
      <CampaignFormDialog
        open={showCampaignModal}
        onOpenChange={setShowCampaignModal}
        onCampaignUpdated={handleCampaignCreated}
      />
    </div>
  );
};

export default Dashboard;
