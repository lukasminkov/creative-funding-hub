import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import BrandSelector, { Brand } from "@/components/BrandSelector";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import DefaultCampaignBanner from "@/components/DefaultCampaignBanner";
import { Campaign } from "@/lib/campaign-types";
import { toast } from "sonner";
import VirtualizedCampaignList from "@/components/dashboard/VirtualizedCampaignList";

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

  const handleViewDetails = (campaign: Campaign) => {
    // Navigate to campaign details or open modal
    console.log("View campaign details:", campaign.id);
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
            <VirtualizedCampaignList
              campaigns={campaigns}
              onViewDetails={handleViewDetails}
              onMessageBrand={handleMessageBrand}
              containerHeight={800}
            />
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
