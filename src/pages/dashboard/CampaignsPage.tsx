
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, 
  Edit2, 
  Trash2, 
  Plus, 
  Search,
  FilterX,
  SlidersHorizontal,
  ChevronDown,
  Calendar,
  ArrowUpDown,
  MoreHorizontal 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Campaign, formatCurrency } from "@/lib/campaign-types";
import CampaignAnalytics from "@/components/dashboard/CampaignAnalytics";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import CampaignEditDialog from "@/components/dashboard/CampaignEditDialog";
import { toast } from "sonner";

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Get campaigns from local storage for development purpose
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        
        // For development, try to get from localStorage first
        const storedCampaigns = localStorage.getItem("campaigns");
        if (storedCampaigns) {
          setCampaigns(JSON.parse(storedCampaigns));
          setIsLoading(false);
          return;
        }
        
        // If no localStorage data, try to fetch from Supabase
        const { data, error } = await supabase
          .from('campaigns')
          .select('*');
        
        if (error) {
          console.error("Error fetching campaigns:", error);
          setIsLoading(false);
          return;
        }
        
        if (data) {
          const formattedCampaigns = data.map(convertDatabaseCampaign);
          setCampaigns(formattedCampaigns);
          
          // Save to localStorage for development
          localStorage.setItem("campaigns", JSON.stringify(formattedCampaigns));
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  const handleDeleteCampaign = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    try {
      // For development, update localStorage
      const updatedCampaigns = campaigns.filter(c => c.id !== campaignToDelete.id);
      setCampaigns(updatedCampaigns);
      localStorage.setItem("campaigns", JSON.stringify(updatedCampaigns));
      
      // In production, also update Supabase
      if (campaignToDelete.id) {
        const { error } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', campaignToDelete.id);
        
        if (error) {
          console.error("Error deleting campaign:", error);
          toast.error("Error deleting campaign: " + error.message);
          return;
        }
      }
      
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    } finally {
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    }
  };
  
  const handleEditCampaign = (campaign: Campaign) => {
    setCampaignToEdit(campaign);
    setShowEditDialog(true);
  };
  
  const handleCampaignUpdated = () => {
    // Reload campaigns
    const storedCampaigns = localStorage.getItem("campaigns");
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }
  };
  
  // Filter campaigns
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = searchQuery === "" || 
      campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesType = typeFilter === "all" || campaign.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const getCampaignStatus = (campaign: Campaign): string => {
    // This is a simplified version, in reality you'd have more complex logic
    return campaign.status || "active";
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and monitor all your campaigns
          </p>
        </div>
        <Link to="/dashboard/campaigns/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>
      
      {/* Analytics Section */}
      {campaigns.length > 0 && (
        <CampaignAnalytics campaigns={campaigns} />
      )}
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
              onClick={() => setSearchQuery("")}
            >
              <FilterX className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="retainer">Retainer</SelectItem>
              <SelectItem value="payPerView">Pay Per View</SelectItem>
              <SelectItem value="challenge">Challenge</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Campaigns List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3).fill(null).map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse">
              <div className="h-40 bg-muted"></div>
              <div className="p-4 space-y-4">
                <div className="h-5 w-2/3 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="overflow-hidden border hover:shadow-md transition-shadow"
            >
              {campaign.bannerImage ? (
                <div className="h-40 relative">
                  <img 
                    src={campaign.bannerImage} 
                    alt={campaign.title} 
                    className="h-full w-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCampaign(campaign)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-black/40 text-white border-white/20 flex gap-1 items-center">
                        {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                      </Badge>
                      
                      <Badge variant={getCampaignStatus(campaign) === 'active' ? 'default' : 'secondary'} className="flex gap-1 items-center">
                        {getCampaignStatus(campaign)}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 relative">
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditCampaign(campaign)}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCampaign(campaign)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <h3 className="text-lg font-medium pr-8">{campaign.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="flex gap-1 items-center">
                      {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
                    </Badge>
                    
                    <Badge variant={getCampaignStatus(campaign) === 'active' ? 'default' : 'secondary'} className="flex gap-1 items-center">
                      {getCampaignStatus(campaign)}
                    </Badge>
                  </div>
                </div>
              )}
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm">
                    Budget: <span className="font-medium">
                      {formatCurrency(campaign.totalBudget, campaign.currency)}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>
                      {campaign.createdAt 
                        ? new Date(campaign.createdAt).toLocaleDateString() 
                        : "No date"}
                    </span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/dashboard/campaigns/${campaign.id}`)}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium mb-2">No campaigns found</h3>
          {(searchQuery || statusFilter !== "all" || typeFilter !== "all") ? (
            <>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setTypeFilter("all");
              }}>
                <FilterX className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <p className="text-muted-foreground mb-6">
                You haven't created any campaigns yet
              </p>
              <Link to="/dashboard/campaigns/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Campaign
                </Button>
              </Link>
            </>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCampaign}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Edit Campaign Dialog */}
      <CampaignEditDialog
        campaign={campaignToEdit}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onCampaignUpdated={handleCampaignUpdated}
      />
    </div>
  );
}
