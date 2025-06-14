import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";
import CampaignSummaryCard from "@/components/dashboard/CampaignSummaryCard";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import { useCampaigns } from "@/hooks/useCampaigns";
import { toast } from "sonner";
export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const {
    data: campaigns = [],
    isLoading,
    error
  } = useCampaigns();
  if (error) {
    console.error("Error loading campaigns:", error);
    toast.error("Failed to load campaigns");
  }

  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.brandName?.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.category.toLowerCase().includes(searchTerm.toLowerCase()) || campaign.type.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleDeleteCampaign = async (id: string) => {
    // This would be implemented with a delete mutation
    toast.success("Campaign deleted successfully");
  };
  if (isLoading) {
    return <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading campaigns...</div>
        </div>
      </div>;
  }
  return <div className="p-8 bg-zinc-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">Manage and track your influencer campaigns</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search campaigns..." className="pl-8 w-[250px]" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Campaign Analytics */}
      <CampaignAnalytics campaigns={campaigns} />

      {filteredCampaigns.length === 0 ? <div className="text-center py-8">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            {searchTerm ? "No campaigns found" : "No campaigns yet"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Create your first campaign to get started with influencer marketing"}
          </p>
          {!searchTerm && <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => <CampaignSummaryCard key={campaign.id} campaign={campaign} onDelete={handleDeleteCampaign} />)}
        </div>}

      <CampaignFormDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
    </div>;
}