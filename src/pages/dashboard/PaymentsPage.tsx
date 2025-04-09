
import { useState } from "react";
import { CheckCircle2, DollarSign, Filter, MoreHorizontal, Search, XCircle } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Payment, Submission, SubmissionStatusType, DirectPaymentFormData } from "@/lib/campaign-types";
import DirectPaymentDialog from "@/components/DirectPaymentDialog";
import PaymentConfirmationDialog from "@/components/PaymentConfirmationDialog";
import { Input } from "@/components/ui/input";

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

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
};

export default function PaymentsPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterValue, setFilterValue] = useState<string>("");
  const [previewSubmission, setPreviewSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("pendingPayouts");
  const [isDirectPaymentOpen, setIsDirectPaymentOpen] = useState(false);
  const [paymentConfirmation, setPaymentConfirmation] = useState<{ open: boolean, submission: Submission | null }>({
    open: false,
    submission: null
  });
  
  // Search state for each tab
  const [pendingPayoutsSearch, setPendingPayoutsSearch] = useState("");
  const [pendingApprovalsSearch, setPendingApprovalsSearch] = useState("");
  const [paymentHistorySearch, setPaymentHistorySearch] = useState("");
  
  const { data: submissions = [], isLoading: submissionsLoading, refetch: refetchSubmissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*');
      
      if (error) {
        console.error('Error fetching submissions:', error);
        toast({
          title: "Error fetching submissions",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(item => ({
        ...item,
        submitted_date: new Date(item.submitted_date),
      })) as Submission[];
    }
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*');
      
      if (error) {
        console.error('Error fetching payments:', error);
        toast({
          title: "Error fetching payment history",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data.map(item => ({
        ...item,
        payment_date: new Date(item.payment_date),
      })) as Payment[];
    }
  });
  
  // Filter the data based on search terms
  const filteredPendingPayouts = (submissions.filter(s => s.status === 'approved') || []).filter(payout => {
    if (!pendingPayoutsSearch) return true;
    const searchLower = pendingPayoutsSearch.toLowerCase();
    return (
      payout.creator_name.toLowerCase().includes(searchLower) ||
      payout.campaign_title.toLowerCase().includes(searchLower) ||
      payout.platform.toLowerCase().includes(searchLower) ||
      `$${payout.payment_amount}`.includes(searchLower)
    );
  });
  
  const pendingPayouts = submissions.filter(s => s.status === 'approved');
  
  const filteredSubmissions = submissions.filter(submission => {
    // First apply the filter type
    if (filterType === "all") {
      if (submission.status !== 'pending') return false;
    } else {
      switch (filterType) {
        case "creator":
          if (submission.status !== 'pending' || 
              !submission.creator_name.toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
          break;
        case "campaign":
          if (submission.status !== 'pending' || 
              !submission.campaign_title.toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
          break;
        case "platform":
          if (submission.status !== 'pending' || 
              submission.platform.toLowerCase() !== filterValue.toLowerCase()) {
            return false;
          }
          break;
        default:
          if (submission.status !== 'pending') return false;
      }
    }
    
    // Then apply the search term
    if (!pendingApprovalsSearch) return true;
    const searchLower = pendingApprovalsSearch.toLowerCase();
    return (
      submission.creator_name.toLowerCase().includes(searchLower) ||
      submission.campaign_title.toLowerCase().includes(searchLower) ||
      submission.platform.toLowerCase().includes(searchLower) ||
      `$${submission.payment_amount}`.includes(searchLower)
    );
  });

  const filteredPaymentHistory = payments.filter(payment => {
    if (!paymentHistorySearch) return true;
    const searchLower = paymentHistorySearch.toLowerCase();
    return (
      payment.creator_name.toLowerCase().includes(searchLower) ||
      payment.campaign_title.toLowerCase().includes(searchLower) ||
      payment.platform.toLowerCase().includes(searchLower) ||
      `$${payment.payment_amount}`.includes(searchLower) ||
      payment.transaction_id.toLowerCase().includes(searchLower) ||
      payment.payment_date.toLocaleDateString().includes(searchLower)
    );
  });

  const totalPending = submissions.filter(s => s.status === "pending").length;
  const totalPendingPayouts = pendingPayouts.reduce((sum, p) => sum + p.payment_amount, 0);
  const totalPaymentsCompleted = payments.reduce((sum, p) => sum + p.payment_amount, 0);
  
  const handleApprove = async (submission: Submission) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'approved' })
      .eq('id', submission.id);
    
    if (error) {
      console.error('Error approving submission:', error);
      toast({
        title: "Error approving submission",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submission approved",
        description: `The submission from ${submission.creator_name} has been approved.`,
      });
      refetchSubmissions();
    }
    
    setPreviewSubmission(null);
  };

  const handleReject = async (submission: Submission) => {
    const { error } = await supabase
      .from('submissions')
      .update({ status: 'rejected' })
      .eq('id', submission.id);
    
    if (error) {
      console.error('Error rejecting submission:', error);
      toast({
        title: "Error rejecting submission",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submission rejected",
        description: `The submission from ${submission.creator_name} has been rejected.`,
      });
      refetchSubmissions();
    }
    
    setPreviewSubmission(null);
  };

  const openPaymentConfirmation = (submission: Submission) => {
    setPaymentConfirmation({
      open: true,
      submission
    });
  };

  const handlePayout = async (submission: Submission) => {
    const updateSubmission = await supabase
      .from('submissions')
      .update({ status: 'paid' })
      .eq('id', submission.id);
    
    if (updateSubmission.error) {
      console.error('Error updating submission status:', updateSubmission.error);
      toast({
        title: "Error processing payment",
        description: updateSubmission.error.message,
        variant: "destructive",
      });
      return;
    }
    
    const transactionId = 'tx_' + Math.random().toString(36).substring(2, 15);
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        creator_id: submission.creator_id,
        creator_name: submission.creator_name,
        creator_avatar: submission.creator_avatar,
        campaign_id: submission.campaign_id,
        campaign_title: submission.campaign_title,
        platform: submission.platform,
        content: submission.content,
        views: submission.views,
        payment_amount: submission.payment_amount,
        transaction_id: transactionId
      });
    
    if (insertError) {
      console.error('Error creating payment record:', insertError);
      toast({
        title: "Error recording payment",
        description: insertError.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Payment processed",
      description: `Payment of $${submission.payment_amount} to ${submission.creator_name} has been processed.`,
    });
    
    refetchSubmissions();
  };

  const handleDirectPayment = async (data: DirectPaymentFormData) => {
    const { data: campaignData } = await supabase
      .from('campaigns')
      .select('title')
      .eq('id', data.campaign_id)
      .single();
    
    const { data: creatorData } = await supabase
      .from('submissions')
      .select('creator_name, creator_avatar')
      .eq('creator_id', data.creator_id)
      .limit(1)
      .single();
    
    if (!campaignData || !creatorData) {
      throw new Error("Could not find campaign or creator details");
    }
    
    const transactionId = 'tx_direct_' + Math.random().toString(36).substring(2, 15);
    
    const { error: insertError } = await supabase
      .from('payments')
      .insert({
        creator_id: data.creator_id,
        creator_name: creatorData.creator_name,
        creator_avatar: creatorData.creator_avatar,
        campaign_id: data.campaign_id,
        campaign_title: campaignData.title,
        platform: 'Direct Payment',
        content: data.note,
        views: 0,
        payment_amount: data.payment_amount,
        transaction_id: transactionId
      });
    
    if (insertError) {
      console.error('Error creating direct payment record:', insertError);
      toast({
        title: "Error recording payment",
        description: insertError.message,
        variant: "destructive",
      });
      throw insertError;
    }
    
    toast({
      title: "Direct payment processed",
      description: `Payment of $${data.payment_amount} to ${creatorData.creator_name} has been processed.`,
    });
    
    await refetchSubmissions();
  };

  return (
    <div className="container py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Payments & Approvals</h2>
          <p className="text-muted-foreground">
            Review submissions, approve payments, and manage your payment history
          </p>
        </div>
        <Button 
          onClick={() => setIsDirectPaymentOpen(true)}
          className="flex items-center" 
          size="lg"
        >
          <DollarSign className="mr-2 h-5 w-5" />
          Direct Payment
        </Button>
      </div>

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

      <Tabs defaultValue="pendingPayouts" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="pendingPayouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="pendingApprovals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="paymentHistory">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendingPayouts" className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by creator, campaign, platform..."
                value={pendingPayoutsSearch}
                onChange={(e) => setPendingPayoutsSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            {pendingPayoutsSearch && (
              <Button variant="ghost" size="sm" onClick={() => setPendingPayoutsSearch("")}>
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {paymentsLoading || submissionsLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading payments data...</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Submission</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Amount Due</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPendingPayouts.length > 0 ? (
                    filteredPendingPayouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {payout.creator_avatar ? (
                                <AvatarImage src={payout.creator_avatar} alt={payout.creator_name} />
                              ) : (
                                <AvatarFallback>{getInitials(payout.creator_name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <span>{payout.creator_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{payout.campaign_title}</TableCell>
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
                        <TableCell className="font-medium">${payout.payment_amount}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" onClick={() => openPaymentConfirmation(payout)}>
                            <DollarSign className="mr-1 h-4 w-4" />
                            Pay Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {pendingPayouts.length === 0 ? "No pending payouts found." : "No results match your search."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableCaption>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {pendingPayoutsSearch ? 
                        `Showing ${filteredPendingPayouts.length} of ${pendingPayouts.length} pending payouts` : 
                        `Showing ${pendingPayouts.length} pending payouts`}
                    </div>
                    {filteredPendingPayouts.length > 0 && (
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
                    )}
                  </div>
                </TableCaption>
              </Table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pendingApprovals" className="space-y-4">
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

            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search pending approvals..."
                value={pendingApprovalsSearch}
                onChange={(e) => setPendingApprovalsSearch(e.target.value)}
                className="pl-8 w-full"
              />
              {pendingApprovalsSearch && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setPendingApprovalsSearch("")}
                  className="absolute right-1 top-1.5"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {submissionsLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading submissions...</p>
            </div>
          ) : (
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
                              {submission.creator_avatar ? (
                                <AvatarImage src={submission.creator_avatar} alt={submission.creator_name} />
                              ) : (
                                <AvatarFallback>{getInitials(submission.creator_name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <span>{submission.creator_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{submission.campaign_title}</TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <span className="mr-1">{getPlatformIcon(submission.platform)}</span>
                            {submission.platform}
                          </span>
                        </TableCell>
                        <TableCell>
                          {submission.submitted_date.toLocaleDateString()}
                        </TableCell>
                        <TableCell>${submission.payment_amount}</TableCell>
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
                        {submissions.filter(s => s.status === 'pending').length === 0 ? 
                          "No pending submissions found." : 
                          "No submissions match your search criteria."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="paymentHistory" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payment history..."
              value={paymentHistorySearch}
              onChange={(e) => setPaymentHistorySearch(e.target.value)}
              className="pl-8 w-full mb-4"
            />
            {paymentHistorySearch && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPaymentHistorySearch("")}
                className="absolute right-1 top-1.5"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {paymentsLoading ? (
            <div className="flex justify-center items-center py-12">
              <p>Loading payment history...</p>
            </div>
          ) : (
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
                  {filteredPaymentHistory.length > 0 ? (
                    filteredPaymentHistory.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              {payment.creator_avatar ? (
                                <AvatarImage src={payment.creator_avatar} alt={payment.creator_name} />
                              ) : (
                                <AvatarFallback>{getInitials(payment.creator_name)}</AvatarFallback>
                              )}
                            </Avatar>
                            <span>{payment.creator_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{payment.campaign_title}</TableCell>
                        <TableCell>
                          <span className="flex items-center">
                            <span className="mr-1">{getPlatformIcon(payment.platform)}</span>
                            {payment.platform}
                          </span>
                        </TableCell>
                        <TableCell>
                          {payment.payment_date.toLocaleDateString()}
                        </TableCell>
                        <TableCell>{payment.views.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${payment.payment_amount}</TableCell>
                        <TableCell>
                          <span className="text-xs font-mono bg-muted px-2 py-1 rounded">{payment.transaction_id}</span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {payments.length === 0 ? 
                          "No payment history found." : 
                          "No payments match your search criteria."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableCaption>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {paymentHistorySearch ? 
                        `Showing ${filteredPaymentHistory.length} of ${payments.length} payments` : 
                        `Showing ${payments.length} payments`}
                    </div>
                    {filteredPaymentHistory.length > 0 && (
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
                    )}
                  </div>
                </TableCaption>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>

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
                  {previewSubmission.creator_avatar ? (
                    <AvatarImage src={previewSubmission.creator_avatar} alt={previewSubmission.creator_name} />
                  ) : (
                    <AvatarFallback>{getInitials(previewSubmission.creator_name)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4 className="font-medium">{previewSubmission.creator_name}</h4>
                  <p className="text-sm text-muted-foreground">{previewSubmission.platform}</p>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Campaign</h5>
                <p>{previewSubmission.campaign_title}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Content</h5>
                <div className="p-4 bg-muted rounded-md">
                  {previewSubmission.content}
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-1">Payment Amount</h5>
                <p className="text-lg font-bold">${previewSubmission.payment_amount}</p>
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

      <DirectPaymentDialog 
        open={isDirectPaymentOpen}
        onOpenChange={setIsDirectPaymentOpen}
        onSubmit={handleDirectPayment}
      />

      <PaymentConfirmationDialog
        open={paymentConfirmation.open}
        onOpenChange={(open) => setPaymentConfirmation(prev => ({ ...prev, open }))}
        submission={paymentConfirmation.submission}
        onConfirm={handlePayout}
      />
    </div>
  );
}
