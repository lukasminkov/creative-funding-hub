
import { useState } from "react";
import { CheckCircle2, DollarSign, Filter, MoreHorizontal, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
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
  const [filterType, setFilterType] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");
  const [previewSubmission, setPreviewSubmission] = useState<Submission | null>(null);
  
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

  const submissions = generateSubmissions(campaigns);
  
  // Calculate total stats
  const totalPending = submissions.filter(s => s.status === "pending").length;
  const totalAmount = submissions.reduce((sum, s) => sum + s.paymentAmount, 0);
  
  // Apply filters
  const filteredSubmissions = submissions.filter(submission => {
    if (!filterType || !filterValue) return true;
    
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

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Payments & Approvals</h2>
        <p className="text-muted-foreground">
          Review and approve creator submissions for payment
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">
              Submissions awaiting approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Pending payment amount
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              Average Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${submissions.length > 0 
                ? Math.round(totalAmount / submissions.length).toLocaleString() 
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per submission
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]">
              <span className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <span>{filterType ? `Filter by ${filterType}` : "Filter by"}</span>
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All submissions</SelectItem>
              <SelectItem value="creator">Creator</SelectItem>
              <SelectItem value="campaign">Campaign</SelectItem>
              <SelectItem value="platform">Platform</SelectItem>
            </SelectContent>
          </Select>

          {filterType && (
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
              
              {(filterType || filterValue) && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setFilterType("");
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
                                   submission.status === "approved" ? "success" : "destructive"}>
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
