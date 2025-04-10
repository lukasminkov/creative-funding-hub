
import { useState } from "react";
import { 
  Clock, 
  Filter, 
  Search, 
  Check, 
  X, 
  Hourglass, 
  Calendar, 
  AlertCircle, 
  ChevronDown,
  Layers,
  FileText
} from "lucide-react";
import { format, formatDistanceToNow, isAfter, isBefore, addHours } from "date-fns";
import { Campaign, Submission, SubmissionStatusType } from "@/lib/campaign-types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { toast } from "sonner";

interface CampaignSubmissionsProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
  campaignId?: string;
  campaign?: Campaign;
}

export default function CampaignSubmissions({ 
  submissions, 
  onApprove, 
  onDeny, 
  campaignId,
  campaign
}: CampaignSubmissionsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [campaignFilter, setCampaignFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [campaignSubmissionsDialogOpen, setCampaignSubmissionsDialogOpen] = useState(false);

  const platforms = Array.from(new Set(submissions.map(s => s.platform)));
  // Get unique campaign titles for filtering
  const campaigns = Array.from(new Set(submissions.map(s => s.campaign_title))).map(title => ({ 
    title, 
    id: submissions.find(s => s.campaign_title === title)?.campaign_id || ""
  }));
  
  // Group submissions by campaign for retainer tracking
  const submissionsByCampaign = submissions.reduce((acc, submission) => {
    if (!acc[submission.campaign_id]) {
      acc[submission.campaign_id] = [];
    }
    acc[submission.campaign_id].push(submission);
    return acc;
  }, {} as Record<string, Submission[]>);

  const handleDenyClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDenyReason("");
    setDenyDialogOpen(true);
  };

  const handleDenySubmit = async () => {
    if (!selectedSubmission) return;
    
    setIsProcessing(true);
    try {
      await onDeny(selectedSubmission, denyReason);
      setDenyDialogOpen(false);
    } catch (error) {
      console.error("Error denying submission:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setDetailsDialogOpen(true);
  };
  
  const handleViewCampaignSubmissions = (campaignId: string, campaignTitle: string) => {
    setSelectedSubmission({
      ...submissions.find(s => s.campaign_id === campaignId) as Submission,
      campaign_title: campaignTitle
    });
    setCampaignSubmissionsDialogOpen(true);
  };

  const getDeadlineInfo = (submission: Submission) => {
    const submittedDate = new Date(submission.submitted_date);
    
    const deadlineDate = addHours(submittedDate, 240);
    const isExpired = isAfter(new Date(), deadlineDate);
    const timeLeft = formatDistanceToNow(deadlineDate, { addSuffix: true });
    
    const shouldAutoAccept = isExpired && submission.status === "pending";
    
    const totalTime = 240 * 60 * 60 * 1000;
    const elapsed = Date.now() - submittedDate.getTime();
    const timePercentage = Math.min(100, Math.round((elapsed / totalTime) * 100));
    
    return {
      deadline: deadlineDate,
      isExpired,
      timeLeft,
      shouldAutoAccept,
      timePercentage
    };
  };
  
  // Function to determine campaign type based on submission
  const getCampaignType = (submission: Submission): string => {
    // In a real app, this would come from the campaign data
    // For now, we'll use a simple approach based on the submission properties
    
    // If this is a campaign that has multiple deliverables and fixed payment, it's likely a retainer
    const campaignSubmissions = submissionsByCampaign[submission.campaign_id] || [];
    const hasMultipleSubmissions = campaignSubmissions.length > 1;
    
    if (hasMultipleSubmissions) {
      return "Retainer";
    }
    
    // If the payment depends on views, it's likely a pay-per-view
    if (submission.views > 0 && submission.payment_amount > 0) {
      return "Pay-Per-View";
    }
    
    // If there's only one submission and fixed payment, could be a challenge
    return "Challenge";
  };
  
  // For retainer campaigns, track X/Y submissions
  const getRetainerProgress = (campaignId: string) => {
    const campaignSubmissions = submissionsByCampaign[campaignId] || [];
    const approved = campaignSubmissions.filter(s => s.status === "approved").length;
    return {
      total: campaignSubmissions.length,
      approved,
      percentage: campaignSubmissions.length ? Math.round((approved / campaignSubmissions.length) * 100) : 0
    };
  };

  const filteredSubmissions = submissions
    .filter(submission => {
      const matchesSearch = 
        submission.creator_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.campaign_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      
      const matchesPlatform = platformFilter === "all" || submission.platform === platformFilter;
      
      const matchesCampaign = campaignFilter === "all" || submission.campaign_id === campaignFilter;
      
      return matchesSearch && matchesStatus && matchesPlatform && matchesCampaign;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.submitted_date).getTime() - new Date(b.submitted_date).getTime();
        case "date-desc":
          return new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime();
        case "views-asc":
          return a.views - b.views;
        case "views-desc":
          return b.views - a.views;
        case "payment-asc":
          return a.payment_amount - b.payment_amount;
        case "payment-desc":
          return b.payment_amount - a.payment_amount;
        default:
          return new Date(b.submitted_date).getTime() - new Date(a.submitted_date).getTime();
      }
    });

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 p-4 rounded-md text-sm">
        <div className="font-medium mb-1">Campaign Types and Submission Rules</div>
        <ul className="list-disc ml-5 text-muted-foreground space-y-1">
          <li><strong>Pay-per-view:</strong> Submissions have 10 days to accumulate views and are paid based on the views after this period. Submissions auto-accept after 240 hours (10 days) if not reviewed.</li>
          <li><strong>Retainer:</strong> Fixed payment after all deliverables are successfully submitted. All submissions must be accepted to receive payment.</li>
          <li><strong>Challenge:</strong> Paid out after the campaign ends. Winners are selected from approved submissions.</li>
        </ul>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search submissions..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full md:w-2/3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {platforms.map(platform => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={campaignFilter} onValueChange={setCampaignFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="views-desc">Most Views</SelectItem>
              <SelectItem value="views-asc">Least Views</SelectItem>
              <SelectItem value="payment-desc">Highest Payment</SelectItem>
              <SelectItem value="payment-asc">Lowest Payment</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredSubmissions.length > 0 ? (
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Campaign Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Submitted</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Review Deadline</span>
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const { deadline, isExpired, timeLeft, shouldAutoAccept, timePercentage } = getDeadlineInfo(submission);
                const displayStatus = shouldAutoAccept ? "approved" : submission.status;
                const campaignType = getCampaignType(submission);
                const isRetainer = campaignType === "Retainer";
                const progress = isRetainer ? getRetainerProgress(submission.campaign_id) : null;
                
                return (
                  <TableRow key={submission.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={submission.creator_avatar} alt={submission.creator_name} />
                          <AvatarFallback>{submission.creator_name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{submission.creator_name}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {submission.content}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{submission.campaign_title}</div>
                      {isRetainer && progress && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Progress value={progress.percentage} className="h-1 w-24" />
                          <span>{progress.approved}/{progress.total} approved</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-5 p-0 text-xs underline"
                            onClick={() => handleViewCampaignSubmissions(submission.campaign_id, submission.campaign_title)}
                          >
                            View all
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        campaignType === "Retainer" 
                          ? "bg-purple-50 text-purple-700 border-purple-200" 
                          : campaignType === "Pay-Per-View" 
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                      }>
                        {campaignType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-secondary/50 p-1 rounded-full">
                          <SocialIcon platform={submission.platform.toLowerCase().split(' ')[0]} />
                        </div>
                        <span className="text-sm">{submission.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{submission.views.toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{format(new Date(submission.submitted_date), "MMM d, yyyy")}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(submission.submitted_date), "h:mm:ss a")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {displayStatus === "pending" ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className={isExpired ? "text-destructive" : "text-muted-foreground"}>
                              {isExpired ? "Expired" : timeLeft}
                            </span>
                            <span className="text-xs">{timePercentage}%</span>
                          </div>
                          <Progress value={timePercentage} className="h-1" />
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          {displayStatus === "approved" ? "Approved" : "Rejected/Completed"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 justify-end">
                        {displayStatus === "pending" && (
                          <>
                            <StatusBadge status={displayStatus} />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => onApprove(submission)}
                              className="h-8 gap-1"
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span className="sr-only md:not-sr-only md:inline">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleDenyClick(submission)}
                              className="h-8 gap-1"
                            >
                              <X className="h-3.5 w-3.5" />
                              <span className="sr-only md:not-sr-only md:inline">Deny</span>
                            </Button>
                          </>
                        )}
                        {displayStatus !== "pending" && (
                          <StatusBadge status={displayStatus} />
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(submission)}
                          className="h-8"
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 bg-muted/20 border rounded-lg">
          <div className="text-lg font-medium mb-2">No submissions found</div>
          <p className="text-muted-foreground mb-4">Try changing your filters or check back later</p>
        </div>
      )}
      
      {/* Denial dialog */}
      <Dialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deny Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason why this submission is being denied.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Provide feedback to the creator..."
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDenyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDenySubmit} disabled={isProcessing || !denyReason.trim()}>
              {isProcessing ? "Processing..." : "Submit Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Submission details dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>Submission Details</DialogTitle>
                <DialogDescription>
                  Submitted by {selectedSubmission.creator_name} on {format(new Date(selectedSubmission.submitted_date), "PPpp")}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center justify-center flex-col">
                      <SocialIcon 
                        platform={selectedSubmission.platform.toLowerCase().split(' ')[0]} 
                        className="h-12 w-12"
                      />
                      <span className="mt-2 text-muted-foreground">{selectedSubmission.platform} Content Preview</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Campaign</div>
                    <div>{selectedSubmission.campaign_title}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Campaign Type</div>
                    <div>{getCampaignType(selectedSubmission)}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Views</div>
                    <div>{selectedSubmission.views.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Status</div>
                    <div><StatusBadge status={selectedSubmission.status} /></div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Payment Amount</div>
                    <div>${selectedSubmission.payment_amount.toFixed(2)}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Content URL</div>
                  <div className="flex items-center">
                    <a 
                      href={selectedSubmission.content} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {selectedSubmission.content}
                    </a>
                    <Button variant="ghost" size="sm" className="ml-2 h-8" onClick={() => {
                      navigator.clipboard.writeText(selectedSubmission.content);
                      toast.success("Link copied to clipboard");
                    }}>
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                {selectedSubmission.status === "pending" && (
                  <div className="flex gap-2 w-full sm:w-auto sm:justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setDetailsDialogOpen(false);
                        handleDenyClick(selectedSubmission);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Deny
                    </Button>
                    <Button 
                      onClick={() => {
                        onApprove(selectedSubmission);
                        setDetailsDialogOpen(false);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Campaign Submissions Dialog */}
      <Dialog open={campaignSubmissionsDialogOpen} onOpenChange={setCampaignSubmissionsDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle>All Submissions for {selectedSubmission.campaign_title}</DialogTitle>
                <DialogDescription>
                  View all submissions for this campaign
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissionsByCampaign[selectedSubmission.campaign_id]?.map(sub => (
                        <TableRow key={sub.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={sub.creator_avatar} />
                                <AvatarFallback>{sub.creator_name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <span>{sub.creator_name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <SocialIcon platform={sub.platform.toLowerCase().split(' ')[0]} className="h-4 w-4" />
                              <span className="text-xs">{sub.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(sub.submitted_date), "MMM d, yyyy")}</TableCell>
                          <TableCell><StatusBadge status={sub.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs" 
                              onClick={() => {
                                setCampaignSubmissionsDialogOpen(false);
                                setTimeout(() => {
                                  handleViewDetails(sub);
                                }, 100);
                              }}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 bg-muted/30 p-3 rounded-md">
                  <div className="text-sm font-medium mb-1">Campaign Summary</div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Total Submissions</div>
                      <div className="text-lg font-medium">{submissionsByCampaign[selectedSubmission.campaign_id]?.length || 0}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Approved</div>
                      <div className="text-lg font-medium">{submissionsByCampaign[selectedSubmission.campaign_id]?.filter(s => s.status === "approved").length || 0}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Pending</div>
                      <div className="text-lg font-medium">{submissionsByCampaign[selectedSubmission.campaign_id]?.filter(s => s.status === "pending").length || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatusBadge({ status }: { status: SubmissionStatusType }) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Hourglass className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check className="h-3 w-3 mr-1" /> Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <X className="h-3 w-3 mr-1" /> Rejected
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Check className="h-3 w-3 mr-1" /> Paid
        </Badge>
      );
    default:
      return null;
  }
}
