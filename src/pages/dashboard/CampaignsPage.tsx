import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, Search, Filter, MoreHorizontal, Eye, Edit, 
  Trash2, Users, DollarSign, Calendar, TrendingUp
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import CampaignCreator from "@/components/CampaignCreator";
import { Campaign } from "@/lib/campaign-types";
import { cn } from "@/lib/utils";

// Updated mock campaigns with real UUIDs from your Supabase database
const mockCampaigns = [
  {
    id: "a184c1a3-0b05-4973-8948-29a9d2e334d0",
    title: "Summer Fashion Collection Retainer",
    description: "Promote our new summer collection with engaging content",
    type: "retainer",
    totalBudget: 15000,
    currency: "USD",
    status: "active",
    applicants: 24,
    accepted: 8,
    endDate: new Date("2024-07-15"),
    platforms: ["instagram", "tiktok"],
    category: "Fashion"
  },
  {
    id: "e26e8a9c-ad6a-4292-abc5-3e9affd23a02",
    title: "Fitness Challenge",
    description: "Create viral fitness content for our new fitness app",
    type: "challenge",
    totalBudget: 25000,
    currency: "USD",
    status: "draft",
    applicants: 0,
    accepted: 0,
    endDate: new Date("2024-08-20"),
    platforms: ["youtube", "instagram"],
    category: "Fitness"
  },
  {
    id: "fc7bf454-624b-4d58-b1f2-66669a8ae027",
    title: "Tech Gadget Review Campaign",
    description: "In-depth reviews of our latest tech products",
    type: "payPerView",
    totalBudget: 18000,
    currency: "USD",
    status: "completed",
    applicants: 32,
    accepted: 12,
    endDate: new Date("2024-06-30"),
    platforms: ["youtube"],
    category: "Technology"
  },
  {
    id: "44ffa767-bbcf-49dd-8066-cd5d2ed3cdc8",
    title: "Paypper Clipping Campaign",
    description: "Create engaging short-form content clips",
    type: "payPerView",
    totalBudget: 12000,
    currency: "USD",
    status: "active",
    applicants: 18,
    accepted: 6,
    endDate: new Date("2024-09-15"),
    platforms: ["tiktok", "youtube"],
    category: "Entertainment"
  }
];

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const filteredCampaigns = mockCampaigns.filter(campaign =>
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "status-active";
      case "completed": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "draft": return "status-pending";
      default: return "status-inactive";
    }
  };

  const getTotalStats = () => {
    return {
      totalCampaigns: mockCampaigns.length,
      activeCampaigns: mockCampaigns.filter(c => c.status === "active").length,
      totalBudget: mockCampaigns.reduce((sum, c) => sum + c.totalBudget, 0),
      totalApplicants: mockCampaigns.reduce((sum, c) => sum + c.applicants, 0)
    };
  };

  const stats = getTotalStats();

  return (
    <div className="container-padding section-spacing space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Campaigns
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage and track your marketing campaigns
            </p>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="lg" className="h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
              </DialogHeader>
              <CampaignCreator
                onCancel={() => setShowCreateDialog(false)}
                onSubmit={(campaign) => {
                  console.log("Campaign created:", campaign);
                  setShowCreateDialog(false);
                }}
                isModal={true}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Campaigns</p>
                  <p className="text-3xl font-bold">{stats.totalCampaigns}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeCampaigns}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-3xl font-bold">${stats.totalBudget.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Applicants</p>
                  <p className="text-3xl font-bold">{stats.totalApplicants}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background/50"
              />
            </div>
            <Button variant="outline" className="h-12 px-6">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="glass-card card-hover group">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getStatusColor(campaign.status))}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {campaign.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {campaign.title}
                  </CardTitle>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to={`/dashboard/campaigns/${campaign.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Campaign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {campaign.description}
              </p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Budget:</span>
                  <p className="font-semibold">${campaign.totalBudget.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <p className="font-semibold">{campaign.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Applicants:</span>
                  <p className="font-semibold">{campaign.applicants}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Accepted:</span>
                  <p className="font-semibold text-green-600">{campaign.accepted}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button asChild className="w-full h-10 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
                  <Link to={`/dashboard/campaigns/${campaign.id}`}>
                    View Campaign
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">No campaigns found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "Create your first campaign to get started"}
                </p>
              </div>
              {!searchTerm && (
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary/90"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Campaign
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
