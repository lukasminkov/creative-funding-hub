import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { convertDatabaseCampaign } from "@/lib/campaign-utils";
import { Edit2, Trash2, ArrowLeft, ChevronRight, MessageSquare, Filter, X, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import CampaignSubmissionsReview from "@/components/CampaignSubmissionsReview";
import { Submission, SubmissionStatusType } from "@/lib/campaign-types";
import { toast } from "sonner";

// Mock creators data
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
}];

// Mock applications data
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
}];

// Mock submissions data with corrected type for status
const mockSubmissions: Submission[] = [{
  id: "201",
  creator_id: "1001",
  creator_name: "Sarah Johnson",
  creator_avatar: "https://i.pravatar.cc/150?u=sarah",
  campaign_id: "a184c1a3-0b05-4973-8948-29a9d2e334d0",
  campaign_title: "Product Review Video",
  submitted_date: new Date("2023-09-10"),
  platform: "TikTok",
  content: "https://tiktok.com/video123",
  payment_amount: 150,
  views: 8500,
  status: "pending" as SubmissionStatusType
}, {
  id: "202",
  creator_id: "1002",
  creator_name: "Mike Peters",
  creator_avatar: "https://i.pravatar.cc/150?u=mike",
  campaign_id: "a184c1a3-0b05-4973-8948-29a9d2e334d0",
  campaign_title: "Brand Unboxing",
  submitted_date: new Date("2023-09-05"),
  platform: "YouTube Shorts",
  content: "https://youtube.com/shorts/video456",
  payment_amount: 200,
  views: 12300,
  status: "approved" as SubmissionStatusType
}, {
  id: "203",
  creator_id: "1003",
  creator_name: "Jessica Williams",
  creator_avatar: "https://i.pravatar.cc/150?u=jessica",
  campaign_id: "a184c1a3-0b05-4973-8948-29a9d2e334d0",
  campaign_title: "Tutorial with Product",
  submitted_date: new Date("2023-09-12"),
  platform: "Instagram Reels",
  content: "https://instagram.com/reel789",
  payment_amount: 175,
  views: 5600,
  status: "pending" as SubmissionStatusType
}, {
  id: "204",
  creator_id: "1004",
  creator_name: "David Chen",
  creator_avatar: "https://i.pravatar.cc/150?u=david",
  campaign_id: "a184c1a3-0b05-4973-8948-29a9d2e334d0",
  campaign_title: "Product Demo",
  submitted_date: new Date("2023-09-15"),
  platform: "TikTok",
  content: "https://tiktok.com/video789",
  payment_amount: 125,
  views: 3200,
  status: "pending" as SubmissionStatusType
}];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("submissions");
  
  const [filterType, setFilterType] = useState<string>("none");
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [platformFilter, setPlatformFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState<string>("1000");
  
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
  
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  let status = "Active";
  let statusColor = "bg-green-100 text-green-800";
  let progress = 0;
  let progressText = "";
  if (endDate < now) {
    status = "Ended";
    statusColor = "bg-gray-100 text-gray-800";
    progress = 100;
  } else if (campaign.type === "retainer") {
    const appDeadline = new Date(campaign.applicationDeadline);
    if (appDeadline > now) {
      status = "Application Phase";
      statusColor = "bg-purple-100 text-purple-800";
      progress = 0;
    } else {
      progress = 40;
    }
    const totalVideos = campaign.deliverables?.totalVideos || 10;
    progressText = `${Math.round(totalVideos * (progress / 100))}/${totalVideos} deliverables`;
  } else if (campaign.type === "payPerView") {
    progress = status === "Ended" ? 100 : 30;
    progressText = `$${(campaign.totalBudget * (progress / 100)).toFixed(2)}/$${campaign.totalBudget} spent`;
  } else if (campaign.type === "challenge") {
    const submitDeadline = new Date(campaign.submissionDeadline);
    if (submitDeadline < now) {
      status = "Judging";
      statusColor = "bg-yellow-100 text-yellow-800";
      progress = 100;
    } else {
      const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const total = submitDeadline.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      progress = Math.min(100, Math.floor(elapsed / total * 100));
    }
    progressText = `${Math.round(progress)}% complete`;
  }
  return <div className="container py-8">
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
            <span className={`text-xs py-1 px-2 rounded-full bg-green-100 text-green-800`}>
              Active
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

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Campaign Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-5">
            <div className="flex justify-between mb-1 text-sm">
              <span>{progressText}</span>
              <span className={`text-xs py-1 px-2 rounded-full bg-green-100 text-green-800`}>
                Active
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {campaign.type === "payPerView" && <>
                <div>
                  <div className="text-sm text-muted-foreground">Cost Per View</div>
                  <div className="text-lg font-semibold">
                    ${(campaign.totalBudget * (progress / 100) / 15000 || 0).toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Remaining Budget</div>
                  <div className="text-lg font-semibold">
                    ${(campaign.totalBudget - campaign.totalBudget * (progress / 100)).toFixed(2)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Button variant="outline" className="w-full" onClick={() => setBudgetDialogOpen(true)}>
                    Add Budget
                  </Button>
                </div>
              </>}
            
            {campaign.type === "retainer" && <>
                <div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                  <div className="text-lg font-semibold">
                    {Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Approval Rate</div>
                  <div className="text-lg font-semibold">
                    92%
                  </div>
                </div>
              </>}
            
            {campaign.type === "challenge" && <>
                <div>
                  <div className="text-sm text-muted-foreground">Submissions</div>
                  <div className="text-lg font-semibold">
                    {mockSubmissions.length}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Days Remaining</div>
                  <div className="text-lg font-semibold">
                    {Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}
                  </div>
                </div>
                
                {status === "Judging" && <div className="md:col-span-2">
                    <Button variant="outline" className="w-full">View Submissions for Judging</Button>
                  </div>}
              </>}
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-6">
        
      </div>
      
      <Card className="mb-8">
        <Tabs defaultValue="submissions" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="submissions" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <CampaignSubmissionsReview 
                  submissions={mockSubmissions}
                  onApprove={handleApproveSubmission}
                  onDeny={handleDenySubmission}
                  campaignId={id}
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
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCreators.map(creator => <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{creator.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {creator.platforms.map(platform => <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                                  <SocialIcon platform={platform} />
                                </div>)}
                            </div>
                          </TableCell>
                          <TableCell>{creator.submissions}</TableCell>
                          <TableCell>{creator.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View Profile</Button>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="applications" className="mt-6">
            <Card>
              <CardHeader className="pb-0 border-b">
                <CardTitle>Applications</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Total Views</TableHead>
                        <TableHead>Total GMV</TableHead>
                        <TableHead>Custom Question 1</TableHead>
                        <TableHead>Custom Question 2</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockApplications.map(creator => <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{creator.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {creator.platforms.map(platform => <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                                  <SocialIcon platform={platform} />
                                </div>)}
                            </div>
                          </TableCell>
                          <TableCell>{creator.totalViews.toLocaleString()}</TableCell>
                          <TableCell>${creator.totalGmv.toLocaleString()}</TableCell>
                          <TableCell>{creator.customQuestion1}</TableCell>
                          <TableCell>{creator.customQuestion2}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm">Review</Button>
                            <Button variant="ghost" size="sm">Approve</Button>
                          </TableCell>
                        </TableRow>)}
                    </TableBody>
                  </Table>
                </div>
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
    </div>;
}
