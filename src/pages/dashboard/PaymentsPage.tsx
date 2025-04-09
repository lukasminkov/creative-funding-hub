
import { useState } from "react";
import { CheckCircle2, DollarSign, Filter, History, MoreHorizontal, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Campaign } from "@/lib/campaign-types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

type PendingPayout = {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  campaignId: string;
  campaignTitle: string;
  campaignType: "retainer" | "payPerView" | "challenge";
  submissionDate: Date;
  platform: string;
  content: string;
  views: number;
  paymentAmount: number;
};

type PaymentHistory = {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  campaignId: string;
  campaignTitle: string;
  platform: string;
  content: string;
  views: number;
  paymentAmount: number;
  paymentDate: Date;
  transactionId: string;
};

type Submission = {
  id: string;
  creatorName: string;
  creatorAvatar?: string;
  campaignId: string;
  campaignTitle: string;
  submittedDate: Date;
  platform: string;
  content: string;
  paymentAmount: number;
  status: "pending" | "approved" | "rejected";
};

// Function to simulate content from different platforms
const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'youtube':
      return '📹';
    case 'instagram':
      return '📸';
    case 'tiktok':
      return '🎵';
    case 'twitter':
      return '🐦';
    default:
      return '📱';
  }
};

// Simulate creator initials
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function PaymentsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [previewSubmission, setPreviewSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pendingApprovals");
  
  // Fetch campaigns from localStorage
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      const storedCampaigns = localStorage.getItem("campaigns");
      return storedCampaigns ? JSON.parse(storedCampaigns) : [];
    }
  });

  // Generate mock submissions data based on campaigns
  const generateSubmissions = (campaigns: Campaign[]): Submission[] => {
    const submissions: Submission[] = [];
    
    campaigns.forEach(campaign => {
      // For each campaign, create 1-3 mock submissions
      const submissionCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < submissionCount; i++) {
        const creatorNames = [
          "Alex Johnson", "Taylor Smith", "Jordan Lee", 
          "Casey Morgan", "Riley Chen", "Quinn Wilson"
        ];
        const platforms = ["YouTube", "Instagram", "TikTok", "Twitter"];
        
        submissions.push({
          id: crypto.randomUUID(),
          creatorName: creatorNames[Math.floor(Math.random() * creatorNames.length)],
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          submittedDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          content: `Content submission for ${campaign.title}`,
          paymentAmount: Math.floor(Math.random() * 500) + 100,
          status: "pending"
        });
      }
    });
    
    return submissions;
  };

  // Generate mock pending payouts
  const generatePendingPayouts = (campaigns: Campaign[]): PendingPayout[] => {
    const payouts: PendingPayout[] = [];
    
    campaigns.forEach(campaign => {
      const payoutCount = Math.floor(Math.random() * 2) + 1;
      
      for (let i = 0; i < payoutCount; i++) {
        const creatorNames = [
          "Alex Johnson", "Taylor Smith", "Jordan Lee", 
          "Casey Morgan", "Riley Chen", "Quinn Wilson"
        ];
        const platforms = ["YouTube", "Instagram", "TikTok", "Twitter"];
        
        payouts.push({
          id: crypto.randomUUID(),
          creatorName: creatorNames[Math.floor(Math.random() * creatorNames.length)],
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          campaignType: campaign.type as "retainer" | "payPerView" | "challenge",
          submissionDate: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)),
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          content: `Approved content for ${campaign.title}`,
          views: Math.floor(Math.random() * 100000) + 1000,
          paymentAmount: Math.floor(Math.random() * 800) + 200,
        });
      }
    });
    
    return payouts;
  };

  // Generate mock payment history
  const generatePaymentHistory = (campaigns: Campaign[]): PaymentHistory[] => {
    const payments: PaymentHistory[] = [];
    
    campaigns.forEach(campaign => {
      const paymentCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < paymentCount; i++) {
        const creatorNames = [
          "Alex Johnson", "Taylor Smith", "Jordan Lee", 
          "Casey Morgan", "Riley Chen", "Quinn Wilson"
        ];
        const platforms = ["YouTube", "Instagram", "TikTok", "Twitter"];
        
        payments.push({
          id: crypto.randomUUID(),
          creatorName: creatorNames[Math.floor(Math.random() * creatorNames.length)],
          campaignId: campaign.id,
          campaignTitle: campaign.title,
          paymentDate: new Date(Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)),
          platform: platforms[Math.floor(Math.random() * platforms.length)],
          content: `Paid content for ${campaign.title}`,
          views: Math.floor(Math.random() * 100000) + 5000,
          paymentAmount: Math.floor(Math.random() * 800) + 200,
          transactionId: `tx_${Math.random().toString(36).substr(2, 9)}`,
        });
      }
    });
    
    return payments;
  };

  const submissions = generateSubmissions(campaigns);
  const pendingPayouts = generatePendingPayouts(campaigns);
  const paymentHistory = generatePaymentHistory(campaigns);
  
  // Calculate total stats
  const totalPending = submissions.filter(s => s.status === "pending").length;
  const totalAmount = submissions.reduce((sum, s) => sum + s.paymentAmount, 0);
  const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.paymentAmount, 0);
  const totalPaymentsCompleted = paymentHistory.reduce((sum, p) => sum + p.paymentAmount, 0);
  
  // Apply filters
  const filteredSubmissions = submissions.filter(submission => {
    if (filterType === "all") return true;
    
    switch (filterType) {
      case "creator":
        return submission.creatorName.toLowerCase().includes(filterValue.toLowerCase());
      case "campaign":
        return submission.campaignTitle.toLowerCase().includes(filterValue.toLowerCase());
      case "platform":
        return submission.platform.toLowerCase() === filterValue.toLowerCase();
      default:
        return true;
    }
  });

  // Handle submission approval
  const handleApprove = (submission: Submission) => {
    // In a real app, this would update the database
    console.log(`Approved submission: ${submission.id}`);
    setPreviewSubmission(null);
  };

  // Handle submission rejection
  const handleReject = (submission: Submission) => {
    // In a real app, this would update the database
    console.log(`Rejected submission: ${submission.id}`);
    setPreviewSubmission(null);
  };

  // Handle payout
  const handlePayout = (payout: PendingPayout) => {
    // In a real app, this would process the payment
    console.log(`Processing payout: ${payout.id} for creator: ${payout.creatorName}`);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Payments & Approvals</h2>
        <p className="text-muted-foreground">
          Review submissions, approve payments, and manage your payment history
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Submissions awaiting review
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayouts.length}</div>
            <p className="text-xs text-muted-foreground">
              Approved submissions ready to pay
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Pending Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPendingPayouts.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total pending payouts
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalPaymentsCompleted.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Payments processed to date
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pendingPayouts" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="pendingPayouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="pendingApprovals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="paymentHistory">Payment History</TabsTrigger>
        </TabsList>
        
        {/* Pending Payouts Tab */}
        <TabsContent value="pendingPayouts" className="space-y-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Campaign Type</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Submission</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Amount Due</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPayouts.length > 0 ? (
                  pendingPayouts.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {payout.creatorAvatar ? (
                              <AvatarImage src={payout.creatorAvatar} alt={payout.creatorName} />
                            ) : (
                              <AvatarFallback>{getInitials(payout.creatorName)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{payout.creatorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{payout.campaignTitle}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {payout.campaignType === "payPerView" ? "Pay Per View" : 
                           payout.campaignType === "retainer" ? "Retainer" : "Challenge"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <span className="mr-1">{getPlatformIcon(payout.platform)}</span>
                          {payout.platform}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                          View Content
                        </Button>
                      </TableCell>
                      <TableCell>{payout.views.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${payout.paymentAmount}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handlePayout(payout)}>
                          <DollarSign className="mr-1 h-4 w-4" />
                          Pay Now
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No pending payouts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    Showing {pendingPayouts.length} pending payouts
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCaption>
            </Table>
          </div>
        </TabsContent>
        
        {/* Pending Approvals Tab */}
        <TabsContent value="pendingApprovals" className="space-y-4">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-2 mb-4">
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[150px]">
                  <span className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>{filterType === "all" ? "All submissions" : `Filter by ${filterType}`}</span>
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All submissions</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="platform">Platform</SelectItem>
                </SelectContent>
              </Select>

              {filterType !== "all" && (
                <>
                  {filterType === "platform" ? (
                    <Select value={filterValue} onValueChange={setFilterValue}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <input
                      type="text"
                      placeholder={`Search by ${filterType}...`}
                      className="px-3 py-2 border rounded-md flex-1"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  )}
                  
                  {(filterType !== "all" || filterValue) && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setFilterType("all");
                        setFilterValue("");
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Submissions Table */}
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length > 0 ? (
                  filteredSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {submission.creatorAvatar ? (
                              <AvatarImage src={submission.creatorAvatar} alt={submission.creatorName} />
                            ) : (
                              <AvatarFallback>{getInitials(submission.creatorName)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{submission.creatorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{submission.campaignTitle}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <span className="mr-1">{getPlatformIcon(submission.platform)}</span>
                          {submission.platform}
                        </span>
                      </TableCell>
                      <TableCell>
                        {submission.submittedDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>${submission.paymentAmount}</TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "pending" ? "outline" : 
                                       submission.status === "approved" ? "secondary" : "destructive"}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setPreviewSubmission(submission)}>
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleApprove(submission)}>
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(submission)}>
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {submissions.length === 0 ? 
                        "No submissions found. Create campaigns to receive submissions." : 
                        "No submissions match your filters."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Payment History Tab */}
        <TabsContent value="paymentHistory" className="space-y-4">
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            {payment.creatorAvatar ? (
                              <AvatarImage src={payment.creatorAvatar} alt={payment.creatorName} />
                            ) : (
                              <AvatarFallback>{getInitials(payment.creatorName)}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{payment.creatorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{payment.campaignTitle}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <span className="mr-1">{getPlatformIcon(payment.platform)}</span>
                          {payment.platform}
                        </span>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{payment.views.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${payment.paymentAmount}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{payment.transactionId}</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No payment history found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    Showing {paymentHistory.length} payments
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </TableCaption>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Submission Preview Dialog */}
      <Dialog open={!!previewSubmission} onOpenChange={(open) => !open && setPreviewSubmission(null)}>
        {previewSubmission && (
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Submission Preview</DialogTitle>
              <DialogDescription>
                Review this submission before approving payment
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{getInitials(previewSubmission.creatorName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{previewSubmission.creatorName}</h4>
                  <p className="text-sm text-muted-foreground">{previewSubmission.platform}</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Campaign</h5>
                <p>{previewSubmission.campaignTitle}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Content</h5>
                <div className="p-4 bg-muted rounded-md">
                  {previewSubmission.content}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Payment Amount</h5>
                <p className="text-lg font-bold">${previewSubmission.paymentAmount}</p>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setPreviewSubmission(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleReject(previewSubmission)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={() => handleApprove(previewSubmission)}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Payment
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
