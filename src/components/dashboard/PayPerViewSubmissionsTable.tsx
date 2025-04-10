
import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal, 
  Filter,
  X,
  Calendar,
  User,
  DollarSign,
  AlertTriangle,
  Clock
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Submission, PayPerViewCampaign, formatCurrency, calculatePayPerViewPayout } from "@/lib/campaign-types";
import { format, differenceInHours, differenceInDays, addHours } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PayPerViewSubmissionsTableProps {
  submissions: Submission[];
  campaigns: PayPerViewCampaign[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

const PayPerViewSubmissionsTable: React.FC<PayPerViewSubmissionsTableProps> = ({
  submissions,
  campaigns,
  onApprove,
  onDeny,
}) => {
  // State for filters
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [campaignFilter, setCampaignFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Extract pay-per-view submissions
  const ppvSubmissions = useMemo(() => 
    submissions.filter(s => s.campaign_type === "payPerView"), 
    [submissions]
  );
  
  // Get unique creators, campaigns for filter options
  const uniqueCreators = useMemo(() => {
    const creators = new Map();
    ppvSubmissions.forEach(sub => {
      if (!creators.has(sub.creator_id)) {
        creators.set(sub.creator_id, {
          id: sub.creator_id,
          name: sub.creator_name,
          avatar: sub.creator_avatar
        });
      }
    });
    return Array.from(creators.values());
  }, [ppvSubmissions]);
  
  const uniqueCampaigns = useMemo(() => {
    const campaignMap = new Map();
    campaigns.forEach(campaign => {
      if (campaign.id && !campaignMap.has(campaign.id)) {
        campaignMap.set(campaign.id, campaign);
      }
    });
    return Array.from(campaignMap.values());
  }, [campaigns]);
  
  // Apply filters to submissions
  const filteredSubmissions = useMemo(() => {
    return ppvSubmissions.filter(submission => {
      // Creator filter
      if (creatorFilter && submission.creator_id !== creatorFilter) {
        return false;
      }
      
      // Campaign filter
      if (campaignFilter && submission.campaign_id !== campaignFilter) {
        return false;
      }
      
      // Status filter
      if (statusFilter && submission.status !== statusFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter) {
        const submissionDate = new Date(submission.submitted_date);
        const filterDate = new Date(dateFilter);
        
        if (
          submissionDate.getFullYear() !== filterDate.getFullYear() ||
          submissionDate.getMonth() !== filterDate.getMonth() ||
          submissionDate.getDate() !== filterDate.getDate()
        ) {
          return false;
        }
      }
      
      return true;
    });
  }, [ppvSubmissions, creatorFilter, campaignFilter, statusFilter, dateFilter]);
  
  // Check if any filters are active
  const hasActiveFilters = creatorFilter || campaignFilter || statusFilter || dateFilter;
  
  // Function to clear all filters
  const clearFilters = () => {
    setCreatorFilter("");
    setCampaignFilter("");
    setStatusFilter("");
    setDateFilter(undefined);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case "paid":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Paid</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPlatformBadge = (platform: string) => {
    const platformColors: Record<string, { bg: string; text: string }> = {
      "TikTok": { bg: "bg-black", text: "text-white" },
      "TikTok Shop": { bg: "bg-black", text: "text-white" },
      "Instagram Reels": { bg: "bg-pink-600", text: "text-white" },
      "Twitter": { bg: "bg-blue-500", text: "text-white" },
      "YouTube Shorts": { bg: "bg-red-600", text: "text-white" },
    };

    const color = platformColors[platform] || { bg: "bg-gray-200", text: "text-gray-800" };

    return (
      <Badge className={`${color.bg} ${color.text} hover:${color.bg}`}>
        {platform}
      </Badge>
    );
  };
  
  // Function to find campaign by id
  const findCampaignById = (campaignId: string): PayPerViewCampaign | undefined => {
    return campaigns.find(c => c.id === campaignId);
  };
  
  // Function to get deadline information
  const getDeadlineInfo = (submission: Submission) => {
    const now = new Date();
    const submissionDate = new Date(submission.submitted_date);
    
    // For pay-per-view: 240 hours (10 days) deadline to approve/reject
    const deadlineForApproval = addHours(submissionDate, 240);
    const hoursRemaining = differenceInHours(deadlineForApproval, now);
    
    const campaign = findCampaignById(submission.campaign_id);
    const viewValidationPeriod = campaign?.viewValidationPeriod || 10; // Default 10 days if not specified
    
    // For view accumulation: Use configured period
    const viewDeadline = addHours(submissionDate, viewValidationPeriod * 24);
    const daysForViews = differenceInDays(viewDeadline, now);

    if (submission.status === "pending") {
      if (hoursRemaining <= 0) {
        return (
          <div className="flex items-center text-orange-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>Auto-approved</span>
          </div>
        );
      } else if (hoursRemaining <= 48) {
        return (
          <div className="flex items-center text-orange-600">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span>{Math.floor(hoursRemaining)}h left to review</span>
          </div>
        );
      } else {
        return (
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            <span>{Math.floor(hoursRemaining)}h to review</span>
          </div>
        );
      }
    } else if (submission.status === "approved" && daysForViews > 0) {
      return (
        <div className="flex items-center text-blue-600">
          <Clock className="h-4 w-4 mr-1" />
          <span>{daysForViews}d left for views</span>
        </div>
      );
    }
    
    return null;
  };
  
  // Calculate estimated payout
  const getPayoutInfo = (submission: Submission) => {
    const campaign = findCampaignById(submission.campaign_id);
    if (!campaign) return null;
    
    const { ratePerThousand, maxPayoutPerSubmission } = campaign;
    
    // Calculate current payout based on views
    const currentPayout = calculatePayPerViewPayout(submission.views, ratePerThousand, maxPayoutPerSubmission);
    
    // Calculate max possible payout for this submission
    const maxPayout = maxPayoutPerSubmission || 0;
    
    // Check if max payout has been reached
    const isMaxedOut = maxPayout > 0 && currentPayout >= maxPayout;
    
    // Format the currency values
    const formattedCurrentPayout = formatCurrency(currentPayout, campaign.currency);
    const formattedMaxPayout = maxPayout > 0 ? formatCurrency(maxPayout, campaign.currency) : "No limit";
    
    return (
      <div className="space-y-1">
        <div className="text-sm font-medium flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          {formattedCurrentPayout}
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>Rate: {formatCurrency(ratePerThousand, campaign.currency)}/1K views</span>
        </div>
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>Max: {formattedMaxPayout}</span>
          {isMaxedOut && (
            <Badge variant="outline" className="bg-green-100 text-green-800 h-5 py-0">
              Max reached
            </Badge>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-medium">Pay-Per-View Submissions</h3>
        
        <div className="flex items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className={hasActiveFilters ? "border-primary text-primary" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2 bg-primary/10 text-primary">
                    {(creatorFilter ? 1 : 0) + (campaignFilter ? 1 : 0) + (statusFilter ? 1 : 0) + (dateFilter ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4 p-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Submissions</h4>
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2">
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Creator
                  </label>
                  <Select value={creatorFilter} onValueChange={setCreatorFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select creator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Creators</SelectItem>
                      {uniqueCreators.map(creator => (
                        <SelectItem key={creator.id} value={creator.id}>{creator.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign</label>
                  <Select value={campaignFilter} onValueChange={setCampaignFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Campaigns</SelectItem>
                      {uniqueCampaigns.map(campaign => (
                        <SelectItem key={campaign.id} value={campaign.id as string}>{campaign.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Post Date
                  </label>
                  <DatePicker 
                    date={dateFilter} 
                    onSelect={setDateFilter} 
                    placeholder="Select date"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9">
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Estimated Payout</TableHead>
              <TableHead>Post Date</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                  {ppvSubmissions.length === 0 ? "No pay-per-view submissions yet" : "No results match your filters"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        {submission.creator_avatar ? (
                          <AvatarImage 
                            src={submission.creator_avatar} 
                            alt={submission.creator_name} 
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {submission.creator_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {submission.creator_name}
                    </div>
                  </TableCell>
                  <TableCell>{submission.campaign_title}</TableCell>
                  <TableCell>{getPlatformBadge(submission.platform)}</TableCell>
                  <TableCell className="font-medium">{submission.views.toLocaleString()}</TableCell>
                  <TableCell>{getPayoutInfo(submission)}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <div>{format(new Date(submission.submitted_date), 'MMM d, yyyy')}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(new Date(submission.submitted_date), 'HH:mm')}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Posted: {format(new Date(submission.submitted_date), 'PPpp')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getDeadlineInfo(submission)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => window.open(submission.content, '_blank')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {submission.status === "pending" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onApprove(submission)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onDeny(submission, "Content doesn't meet requirements")}
                          >
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => window.open(submission.content, '_blank')}>
                            View Content
                          </DropdownMenuItem>
                          {submission.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => onApprove(submission)}>
                                Approve Submission
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onDeny(submission, "Content doesn't meet requirements")}>
                                Reject Submission
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>Message Creator</DropdownMenuItem>
                          <DropdownMenuItem>View Creator Profile</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pay-Per-View Campaign Rules */}
      <div className="p-4 bg-muted/30 rounded-md border">
        <h4 className="font-medium mb-2">Pay-Per-View Campaign Rules</h4>
        <div className="text-sm">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Admin has 240 hours (10 days) to approve/reject submissions</li>
            <li>Submissions are auto-approved if not reviewed within the deadline</li>
            <li>Views accumulate for the configured validation period after approval (default: 10 days)</li>
            <li>Payment is calculated as: (Views ÷ 1,000) × Rate per 1,000 views</li>
            <li>Payment amount cannot exceed the maximum payout per submission (if defined)</li>
            <li>Payment is issued after the view validation period ends</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PayPerViewSubmissionsTable;
