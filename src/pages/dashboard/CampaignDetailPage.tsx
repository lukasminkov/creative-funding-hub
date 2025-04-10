
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { Edit2, Trash2, ArrowLeft, ChevronRight, MessageSquare, Filter, X, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import CampaignSubmissions from "@/components/dashboard/CampaignSubmissions";
import CampaignStatusCard from "@/components/dashboard/CampaignStatusCard";
import CampaignCreatorsList from "@/components/dashboard/CampaignCreatorsList";
import CampaignApplicationsList from "@/components/dashboard/CampaignApplicationsList";
import { Submission, SubmissionStatusType } from "@/lib/campaign-types";
import { toast } from "sonner";

// Enhanced mock creators data with more details
const mockCreators = [{
  id: 1,
  name: "Sarah Johnson",
  avatar: "https://i.pravatar.cc/150?u=sarah",
  platforms: ["instagram", "tiktok"],
  submissions: 5,
  views: 25000,
  status: "active"
}, {
  id: 2,
  name: "Mike Peters",
  avatar: "https://i.pravatar.cc/150?u=mike",
  platforms: ["tiktok", "youtube"],
  submissions: 3,
  views: 18500,
  status: "active"
}, {
  id: 3,
  name: "Jessica Williams",
  avatar: "https://i.pravatar.cc/150?u=jessica",
  platforms: ["instagram", "twitter"],
  submissions: 4,
  views: 15200,
  status: "active"
}, {
  id: 4,
  name: "Alex Rodriguez",
  avatar: "https://i.pravatar.cc/150?u=alex",
  platforms: ["tiktok", "instagram"],
  submissions: 6,
  views: 42000,
  status: "active"
}, {
  id: 5,
  name: "Emma Chen",
  avatar: "https://i.pravatar.cc/150?u=emma",
  platforms: ["youtube", "twitter"],
  submissions: 2,
  views: 31500,
  status: "active"
}];

// Enhanced mock applications data
const mockApplications = [{
  id: 101,
  name: "Tyler Rodriguez",
  avatar: "https://i.pravatar.cc/150?u=tyler",
  platforms: ["instagram", "tiktok", "youtube"],
  followers: 15000,
  totalViews: 120000,
  totalGmv: 5200,
  customQuestion1: "I've worked with similar brands before",
  customQuestion2: "I can deliver within 1 week",
  status: "pending"
}, {
  id: 102,
  name: "Aisha Patel",
  avatar: "https://i.pravatar.cc/150?u=aisha",
  platforms: ["tiktok"],
  followers: 22000,
  totalViews: 180000,
  totalGmv: 7500,
  customQuestion1: "My audience loves tech products",
  customQuestion2: "Available for immediate start",
  status: "pending"
}, {
  id: 103,
  name: "Marcus Green",
  avatar: "https://i.pravatar.cc/150?u=marcus",
  platforms: ["instagram", "youtube"],
  followers: 8500,
  totalViews: 75000,
  totalGmv: 3100,
  customQuestion1: "I specialize in unboxing videos",
  customQuestion2: "Can provide additional promotion",
  status: "pending"
}, {
  id: 104,
  name: "Lily Wang",
  avatar: "https://i.pravatar.cc/150?u=lily",
  platforms: ["tiktok", "instagram"],
  followers: 31000,
  totalViews: 250000,
  totalGmv: 9200,
  customQuestion1: "My audience is primarily 18-24 year olds",
  customQuestion2: "I can create unique storytelling content",
  status: "pending"
}, {
  id: 105,
  name: "Jordan Smith",
  avatar: "https://i.pravatar.cc/150?u=jordan",
  platforms: ["youtube", "twitter"],
  followers: 42000,
  totalViews: 320000,
  totalGmv: 12500,
  customQuestion1: "I have a unique approach to product reviews",
  customQuestion2: "Can deliver high production quality videos",
  status: "pending"
}];

// Create functions to generate different submission date timestamps for variety
const generateSubmissionDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  // Add random hours, minutes, and seconds
  date.setHours(Math.floor(Math.random() * 24));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  return date;
};

// Enhanced mock submissions data with more variety in dates and statuses
const generateMockSubmissions = (campaignId) => {
  return [
    {
      id: "201",
      creator_id: "1001",
      creator_name: "Sarah Johnson",
      creator_avatar: "https://i.pravatar.cc/150?u=sarah",
      campaign_id: campaignId,
      campaign_title: "Product Review Video",
      campaign_type: "retainer" as const,
      submitted_date: generateSubmissionDate(1),
      platform: "TikTok",
      content: "https://tiktok.com/video123",
      payment_amount: 150,
      views: 8500,
      status: "pending" as SubmissionStatusType
    },
    {
      id: "202",
      creator_id: "1002",
      creator_name: "Mike Peters",
      creator_avatar: "https://i.pravatar.cc/150?u=mike",
      campaign_id: campaignId,
      campaign_title: "Brand Unboxing",
      campaign_type: "payPerView" as const,
      submitted_date: generateSubmissionDate(5),
      platform: "YouTube Shorts",
      content: "https://youtube.com/shorts/video456",
      payment_amount: 200,
      views: 12300,
      status: "approved" as SubmissionStatusType
    },
    {
      id: "203",
      creator_id: "1003",
      creator_name: "Jessica Williams",
      creator_avatar: "https://i.pravatar.cc/150?u=jessica",
      campaign_id: campaignId,
      campaign_title: "Tutorial with Product",
      campaign_type: "retainer" as const,
      submitted_date: generateSubmissionDate(2),
      platform: "Instagram Reels",
      content: "https://instagram.com/reel789",
      payment_amount: 175,
      views: 5600,
      status: "pending" as SubmissionStatusType
    },
    {
      id: "204",
      creator_id: "1004",
      creator_name: "David Chen",
      creator_avatar: "https://i.pravatar.cc/150?u=david",
      campaign_id: campaignId,
      campaign_title: "Product Demo",
      campaign_type: "payPerView" as const,
      submitted_date: generateSubmissionDate(9),
      platform: "TikTok",
      content: "https://tiktok.com/video789",
      payment_amount: 125,
      views: 3200,
      status: "rejected" as SubmissionStatusType
    },
    {
      id: "205",
      creator_id: "1005",
      creator_name: "Emma Lopez",
      creator_avatar: "https://i.pravatar.cc/150?u=emma",
      campaign_id: campaignId,
      campaign_title: "Lifestyle Integration",
      campaign_type: "challenge" as const,
      submitted_date: generateSubmissionDate(0.5),
      platform: "Instagram Reels",
      content: "https://instagram.com/reel987",
      payment_amount: 220,
      views: 9800,
      status: "pending" as SubmissionStatusType
    },
    {
      id: "206",
      creator_id: "1006",
      creator_name: "Alex Wong",
      creator_avatar: "https://i.pravatar.cc/150?u=alex",
      campaign_id: campaignId,
      campaign_title: "Product Review",
      campaign_type: "payPerView" as const,
      submitted_date: generateSubmissionDate(11),
      platform: "TikTok",
      content: "https://tiktok.com/video654",
      payment_amount: 180,
      views: 15200,
      status: "paid" as SubmissionStatusType
    },
    {
      id: "207",
      creator_id: "1007",
      creator_name: "Taylor Reed",
      creator_avatar: "https://i.pravatar.cc/150?u=taylor",
      campaign_id: campaignId,
      campaign_title: "First Impressions",
      campaign_type: "challenge" as const,
      submitted_date: generateSubmissionDate(0.1),
      platform: "YouTube Shorts",
      content: "https://youtube.com/shorts/video321",
      payment_amount: 195,
      views: 7200,
      status: "pending" as SubmissionStatusType
    }
  ];
};

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState<string>("1000");
  
  // Create mock submissions specific to this campaign ID
  const mockSubmissions = id ? generateMockSubmissions(id) : [];
  
  const {
    data: campaign,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from('campaigns').select('*').eq('id', id).single();
      if (error) {
        console.error("Error fetching campaign:", error);
        throw new Error("Campaign not found");
      }
      if (!data) {
        throw new Error("Campaign not found");
      }
      return convertDatabaseCampaign(data);
    }
  });

  const handleAddBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    
    toast.success(`Added $${amount.toFixed(2)} to campaign budget`);
    setBudgetDialogOpen(false);
  };

  const handleApproveSubmission = async (submission: Submission) => {
    try {
      toast.success(`Approved submission from ${submission.creator_name}`);
      return Promise.resolve();
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
      return Promise.reject(error);
    }
  };

  const handleDenySubmission = async (submission: Submission, reason: string) => {
    try {
      toast.success(`Denied submission from ${submission.creator_name}`);
      console.log("Denial reason:", reason);
      return Promise.resolve();
    } catch (error) {
      console.error("Error denying submission:", error);
      toast.error("Failed to deny submission");
      return Promise.reject(error);
    }
  };

  if (isLoading) {
    return <div className="container py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-6 w-64 bg-muted rounded"></div>
        </div>
      </div>;
  }
  
  if (!campaign) {
    return <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or was deleted.</p>
        <Button onClick={() => navigate("/dashboard/campaigns")}>
          Return to Campaigns
        </Button>
      </div>;
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button variant="ghost" size="sm" className="mr-2" onClick={() => navigate("/dashboard/campaigns")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{campaign.title}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
            </span>
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {campaign.contentType}
            </span>
          </div>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Link to={`/dashboard/campaigns/${id}/chat`}>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Campaign Chat
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Campaign
          </Button>
        </div>
      </div>

      <CampaignStatusCard 
        campaign={campaign} 
        onAddBudget={() => setBudgetDialogOpen(true)} 
      />
      
      <Card className="mb-8 mt-8">
        <Tabs defaultValue="submissions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <CampaignSubmissions 
                  submissions={mockSubmissions}
                  onApprove={handleApproveSubmission}
                  onDeny={handleDenySubmission}
                  campaignId={id}
                  campaign={campaign}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="creators" className="mt-6">
            <Card>
              <CardHeader className="pb-0 border-b">
                <CardTitle>Active Creators</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CampaignCreatorsList creators={mockCreators} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader className="pb-0 border-b">
                <CardTitle>Applications</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CampaignApplicationsList applications={mockApplications} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Add Budget Dialog */}
      <Dialog open={budgetDialogOpen} onOpenChange={setBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget to Campaign</DialogTitle>
            <DialogDescription>
              Increase the budget for "{campaign.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="budget-amount" className="text-sm font-medium">
                Budget Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="budget-amount"
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(e.target.value)}
                  className="pl-7"
                  min="1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBudgetDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBudget}>
              Add Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CampaignFormDialog campaign={campaign} open={editDialogOpen} onOpenChange={setEditDialogOpen} isEditing={true} onCampaignUpdated={() => {
      if (refetch) refetch();
    }} />
    </div>
  );
}
