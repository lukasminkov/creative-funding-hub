
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, MoreHorizontal, ChevronDown, Filter, Eye, Edit, Trash2, 
  Layers, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/campaign-types";

export default function AdminCampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock campaigns data
  const campaigns = [
    { 
      id: "camp-1", 
      title: "Summer Collection Launch", 
      brand: "Nike", 
      type: "retainer", 
      budget: 15000,
      currency: "USD",
      creators: 24,
      status: "active",
      createdAt: "2023-01-15"
    },
    { 
      id: "camp-2", 
      title: "New iPhone Launch Campaign", 
      brand: "Apple", 
      type: "payPerView", 
      budget: 25000,
      currency: "USD",
      creators: 18,
      status: "active",
      createdAt: "2023-02-20"
    },
    { 
      id: "camp-3", 
      title: "Summer Refreshment Challenge", 
      brand: "Coca-Cola", 
      type: "challenge", 
      budget: 12000,
      currency: "USD",
      creators: 36,
      status: "completed",
      createdAt: "2023-03-10"
    },
    { 
      id: "camp-4", 
      title: "Galaxy Z Fold Promotion", 
      brand: "Samsung", 
      type: "retainer", 
      budget: 18000,
      currency: "USD",
      creators: 15,
      status: "draft",
      createdAt: "2023-04-05"
    },
    { 
      id: "camp-5", 
      title: "New Movie Trailer Campaign", 
      brand: "Disney", 
      type: "payPerView", 
      budget: 22000,
      currency: "USD",
      creators: 30,
      status: "paused",
      createdAt: "2023-05-12"
    },
  ];
  
  // Filter campaigns based on search term
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    campaign.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Helper for campaign type display
  const getCampaignTypeLabel = (type: string) => {
    switch (type) {
      case "retainer": return "Retainer";
      case "payPerView": return "Pay Per View";
      case "challenge": return "Challenge";
      default: return type;
    }
  };
  
  // Helper for status badge variant - Updated to use only allowed variants
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary"; // Changed from "success" to "secondary"
      case "draft": return "outline";       // Changed from "secondary" to "outline"
      case "paused": return "destructive";  // Changed from "warning" to "destructive"
      default: return "outline";
    }
  };
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Campaigns Management</h1>
          <p className="text-muted-foreground">Manage all campaigns across the platform</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search campaigns..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>All Campaigns</CardTitle>
              <CardDescription>Total {filteredCampaigns.length} campaigns found</CardDescription>
            </div>
            
            <Button variant="outline" size="sm" className="h-8">
              <ChevronDown className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Creators</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map(campaign => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div className="font-medium">{campaign.title}</div>
                  </TableCell>
                  <TableCell>{campaign.brand}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCampaignTypeLabel(campaign.type)}</Badge>
                  </TableCell>
                  <TableCell>
                    {formatCurrency(campaign.budget, campaign.currency as any)}
                  </TableCell>
                  <TableCell>{campaign.creators}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{campaign.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Layers className="h-4 w-4 mr-2" />
                          View Submissions
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Campaign
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-yellow-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Change Status
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Campaign
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
