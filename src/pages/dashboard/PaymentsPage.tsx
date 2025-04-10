import { useState } from "react";
import { CheckCircle2, DollarSign, Filter, MoreHorizontal, Search, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/campaign-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Submission, Payment } from "@/lib/campaign-types";
import DirectPaymentDialog from "@/components/DirectPaymentDialog";
import PaymentConfirmationDialog from "@/components/PaymentConfirmationDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockSubmissions: Submission[] = [
  {
    id: "1",
    creator_id: "user1",
    creator_name: "Jessica Williams",
    creator_avatar: "https://i.pravatar.cc/150?u=jessica",
    campaign_id: "campaign1",
    campaign_title: "Summer Collection 2023",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-07-15"),
    payment_amount: 120.50,
    views: 24100,
    status: "pending",
    platform: "TikTok",
    content: "https://tiktok.com/video123"
  },
  {
    id: "2",
    creator_id: "user2",
    creator_name: "Mike Peterson",
    creator_avatar: "https://i.pravatar.cc/150?u=mike",
    campaign_id: "campaign1",
    campaign_title: "Summer Collection 2023",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-07-16"),
    payment_amount: 85.25,
    views: 17050,
    status: "approved",
    platform: "Instagram Reels",
    content: "https://instagram.com/reel456"
  },
  {
    id: "3",
    creator_id: "user3",
    creator_name: "Tyler Rodriguez",
    creator_avatar: "https://i.pravatar.cc/150?u=tyler",
    campaign_id: "campaign2",
    campaign_title: "Spring Launch",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-06-28"),
    payment_amount: 95.00,
    views: 19000,
    status: "pending",
    platform: "YouTube Shorts",
    content: "https://youtube.com/shorts789"
  },
  {
    id: "4",
    creator_id: "user4",
    creator_name: "Aisha Patel",
    creator_avatar: "https://i.pravatar.cc/150?u=aisha",
    campaign_id: "campaign2",
    campaign_title: "Spring Launch",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-06-29"),
    payment_amount: 110.75,
    views: 22150,
    status: "approved",
    platform: "TikTok",
    content: "https://tiktok.com/videoabc"
  },
  {
    id: "5",
    creator_id: "user5",
    creator_name: "Marcus Green",
    creator_avatar: "https://i.pravatar.cc/150?u=marcus",
    campaign_id: "campaign3",
    campaign_title: "Winter Campaign",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-08-02"),
    payment_amount: 130.00,
    views: 26000,
    status: "pending",
    platform: "Instagram Reels",
    content: "https://instagram.com/reelxyz"
  },
  {
    id: "6",
    creator_id: "user6",
    creator_name: "Sarah Johnson",
    creator_avatar: "https://i.pravatar.cc/150?u=sarah",
    campaign_id: "campaign3",
    campaign_title: "Winter Campaign",
    campaign_type: "payPerView",
    submitted_date: new Date("2023-08-03"),
    payment_amount: 90.25,
    views: 18050,
    status: "approved",
    platform: "YouTube Shorts",
    content: "https://youtube.com/shortsdef"
  }
];

const mockPayments: Payment[] = [
  {
    id: "1",
    creator_id: "user3",
    creator_name: "Tyler Rodriguez",
    creator_avatar: "https://i.pravatar.cc/150?u=tyler",
    campaign_id: "campaign2",
    campaign_title: "Spring Launch",
    platform: "YouTube Shorts",
    content: "https://youtube.com/shorts789",
    views: 30200,
    payment_amount: 151.00,
    payment_date: new Date("2023-07-01"),
    transaction_id: "tx_1234567890",
    note: "Payment for exceptional engagement"
  },
  {
    id: "2",
    creator_id: "user4",
    creator_name: "Aisha Patel",
    creator_avatar: "https://i.pravatar.cc/150?u=aisha",
    campaign_id: "campaign2",
    campaign_title: "Spring Launch",
    platform: "TikTok",
    content: "https://tiktok.com/videoabc",
    views: 25500,
    payment_amount: 127.50,
    payment_date: new Date("2023-07-01"),
    transaction_id: "tx_0987654321",
    note: "Fast turnaround and high-quality content"
  },
  {
    id: "3",
    creator_id: "user6",
    creator_name: "Sarah Johnson",
    creator_avatar: "https://i.pravatar.cc/150?u=sarah",
    campaign_id: "campaign3",
    campaign_title: "Winter Campaign",
    platform: "YouTube Shorts",
    content: "https://youtube.com/shortsdef",
    views: 28000,
    payment_amount: 140.00,
    payment_date: new Date("2023-08-15"),
    transaction_id: "tx_qwertyuiop",
    note: "Great performance and audience engagement"
  }
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("pending-approvals");
  const [filterType, setFilterType] = useState("all");
  const [directPaymentOpen, setDirectPaymentOpen] = useState(false);
  const [paymentConfirmationOpen, setPaymentConfirmationOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [paymentDialogData, setPaymentDialogData] = useState({
    creatorName: "",
    amount: 0,
    submission: null
  });
  
  const [pendingPayoutsSearch, setPendingPayoutsSearch] = useState("");
  const [pendingApprovalsSearch, setPendingApprovalsSearch] = useState("");
  const [paymentHistorySearch, setPaymentHistorySearch] = useState("");
  
  const { data: submissions = mockSubmissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockSubmissions.map(item => ({
        ...item,
        submitted_date: item.submitted_date instanceof Date 
          ? item.submitted_date 
          : new Date(item.submitted_date || Date.now()),
      })) as Submission[];
    }
  });
  
  const { data: paymentHistory = mockPayments } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return mockPayments.map(item => ({
        ...item,
        payment_date: item.payment_date instanceof Date 
          ? item.payment_date 
          : new Date(item.payment_date || Date.now()),
      })) as Payment[];
    }
  });
  
  const filteredPendingPayouts = (submissions.filter(s => s.status === 'approved') || []).filter(payout => {
    if (!pendingPayoutsSearch) return true;
    const searchLower = pendingPayoutsSearch.toLowerCase();
    return (
      payout.creator_name.toLowerCase().includes(searchLower) || 
      payout.campaign_title.toLowerCase().includes(searchLower) ||
      payout.platform.toLowerCase().includes(searchLower)
    );
  });
  
  const pendingPayouts = submissions.filter(s => s.status === 'approved');
  
  const filteredSubmissions = submissions.filter(submission => {
    if (filterType === "all") {
      if (submission.status !== 'pending') return false;
    } else {
      if (filterType === "tiktok" && submission.platform !== "TikTok") return false;
      if (filterType === "instagram" && submission.platform !== "Instagram Reels") return false;
      if (filterType === "youtube" && submission.platform !== "YouTube Shorts") return false;
      if (submission.status !== 'pending') return false;
    }
    
    if (!pendingApprovalsSearch) return true;
    const searchLower = pendingApprovalsSearch.toLowerCase();
    return (
      submission.creator_name.toLowerCase().includes(searchLower) || 
      submission.campaign_title.toLowerCase().includes(searchLower) ||
      submission.platform.toLowerCase().includes(searchLower)
    );
  });
  
  const filteredPaymentHistory = paymentHistory.filter(payment => {
    if (!paymentHistorySearch) return true;
    const searchLower = paymentHistorySearch.toLowerCase();
    return (
      payment.creator_name.toLowerCase().includes(searchLower) || 
      payment.campaign_title.toLowerCase().includes(searchLower) ||
      payment.platform.toLowerCase().includes(searchLower)
    );
  });
  
  const handleDenySubmission = (submission: Submission) => {
    console.log("Denying submission:", submission);
  };
  
  const handleApproveSubmission = (submission: Submission) => {
    console.log("Approving submission:", submission);
    
    setSelectedSubmission(submission);
    setPaymentDialogData({
      creatorName: submission.creator_name,
      amount: submission.payment_amount,
      submission: submission
    });
    setPaymentConfirmationOpen(true);
  };
  
  const handleMakePayment = (submission: Submission) => {
    setSelectedSubmission(submission);
    setPaymentDialogData({
      creatorName: submission.creator_name,
      amount: submission.payment_amount,
      submission: submission
    });
    setPaymentConfirmationOpen(true);
  };
  
  const handleDirectPayment = () => {
    setDirectPaymentOpen(true);
  };
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Payments</h2>
          <p className="text-muted-foreground">
            Manage creator submissions and payments
          </p>
        </div>
        <Button onClick={handleDirectPayment} className="gap-2">
          <DollarSign className="h-4 w-4" />
          Direct Payment
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="pending-approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="pending-payouts">Pending Payouts</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending-approvals">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Submissions Pending Approval</CardTitle>
                <div className="flex gap-2">
                  <div className="relative w-[250px]">
                    <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search submissions..."
                      className="pl-8"
                      value={pendingApprovalsSearch}
                      onChange={(e) => setPendingApprovalsSearch(e.target.value)}
                    />
                  </div>
                  <Select defaultValue={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[130px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending submissions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={submission.creator_avatar} />
                                <AvatarFallback>{submission.creator_name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{submission.creator_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{submission.campaign_title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.platform}</Badge>
                          </TableCell>
                          <TableCell>{submission.views.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(submission.payment_amount, 'USD')}</TableCell>
                          <TableCell>
                            {submission.submitted_date instanceof Date ? 
                              submission.submitted_date.toLocaleDateString() : 
                              (new Date(submission.submitted_date)).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDenySubmission(submission)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveSubmission(submission)}
                              className="text-green-500 hover:text-green-700 hover:bg-green-50 border-green-200"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending-payouts">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Payouts</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Total: {formatCurrency(pendingPayouts.reduce((sum, item) => sum + item.payment_amount, 0), 'USD')}
                  </p>
                </div>
                <div className="relative w-[250px]">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search payouts..."
                    className="pl-8"
                    value={pendingPayoutsSearch}
                    onChange={(e) => setPendingPayoutsSearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPendingPayouts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No pending payouts found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Approved Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPendingPayouts.map((submission) => (
                        <TableRow key={submission.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={submission.creator_avatar} />
                                <AvatarFallback>{submission.creator_name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{submission.creator_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{submission.campaign_title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{submission.platform}</Badge>
                          </TableCell>
                          <TableCell>{submission.views.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(submission.payment_amount, 'USD')}</TableCell>
                          <TableCell>
                            {submission.submitted_date instanceof Date ? 
                              submission.submitted_date.toLocaleDateString() : 
                              (new Date(submission.submitted_date)).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleMakePayment(submission)}
                              className="text-primary hover:text-primary/80"
                            >
                              <DollarSign className="h-4 w-4 mr-1" />
                              Pay Now
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment-history">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Payment History</CardTitle>
                <div className="relative w-[250px]">
                  <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search payments..."
                    className="pl-8"
                    value={paymentHistorySearch}
                    onChange={(e) => setPaymentHistorySearch(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredPaymentHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No payment history found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Payment Date</TableHead>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPaymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={payment.creator_avatar} />
                                <AvatarFallback>{payment.creator_name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{payment.creator_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{payment.campaign_title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{payment.platform}</Badge>
                          </TableCell>
                          <TableCell>{payment.views.toLocaleString()}</TableCell>
                          <TableCell>{formatCurrency(payment.payment_amount, 'USD')}</TableCell>
                          <TableCell>
                            {payment.payment_date instanceof Date ? 
                              payment.payment_date.toLocaleDateString() : 
                              (new Date(payment.payment_date)).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <code className="px-1 py-0.5 bg-muted rounded text-xs">
                              {payment.transaction_id}
                            </code>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <DirectPaymentDialog 
        open={directPaymentOpen} 
        onOpenChange={setDirectPaymentOpen} 
      />
      
      <PaymentConfirmationDialog 
        open={paymentConfirmationOpen} 
        onOpenChange={setPaymentConfirmationOpen}
        creatorName={paymentDialogData.creatorName}
        amount={paymentDialogData.amount}
        submission={selectedSubmission}
      />
    </div>
  );
}
