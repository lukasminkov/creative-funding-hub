
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
  PieChart
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
import { 
  Progress 
} from "@/components/ui/progress";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Submission, RetainerCampaign, RetainerProgress } from "@/lib/campaign-types";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RetainerSubmissionsTableProps {
  submissions: Submission[];
  campaigns: RetainerCampaign[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

const RetainerSubmissionsTable: React.FC<RetainerSubmissionsTableProps> = ({
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
  
  // Extract retainer submissions
  const retainerSubmissions = useMemo(() => 
    submissions.filter(s => s.campaign_type === "retainer"), 
    [submissions]
  );
  
  // Get unique creators, campaigns for filter options
  const uniqueCreators = useMemo(() => {
    const creators = new Map();
    retainerSubmissions.forEach(sub => {
      if (!creators.has(sub.creator_id)) {
        creators.set(sub.creator_id, {
          id: sub.creator_id,
          name: sub.creator_name,
          avatar: sub.creator_avatar
        });
      }
    });
    return Array.from(creators.values());
  }, [retainerSubmissions]);
  
  const uniqueCampaigns = useMemo(() => {
    const campaignMap = new Map();
    campaigns.forEach(campaign => {
      if (campaign.id && !campaignMap.has(campaign.id)) {
        campaignMap.set(campaign.id, campaign);
      }
    });
    return Array.from(campaignMap.values());
  }, [campaigns]);
  
  // Create a map of creator progress by campaign
  const creatorProgressMap = useMemo(() => {
    const progressMap = new Map<string, RetainerProgress[]>();
    
    uniqueCreators.forEach(creator => {
      const creatorProgresses: RetainerProgress[] = [];
      
      campaigns.forEach(campaign => {
        if (campaign.id) {
          const progress = calculateCreatorProgress(
            retainerSubmissions,
            campaign,
            creator.id
          );
          creatorProgresses.push(progress);
        }
      });
      
      progressMap.set(creator.id, creatorProgresses);
    });
    
    return progressMap;
  }, [uniqueCreators, campaigns, retainerSubmissions]);
  
  // Apply filters to submissions
  const filteredSubmissions = useMemo(() => {
    return retainerSubmissions.filter(submission => {
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
  }, [retainerSubmissions, creatorFilter, campaignFilter, statusFilter, dateFilter]);
  
  // Check if any filters are active
  const hasActiveFilters = creatorFilter || campaignFilter || statusFilter || dateFilter;
  
  // Function to clear all filters
  const clearFilters = () => {
    setCreatorFilter("");
    setCampaignFilter("");
    setStatusFilter("");
    setDateFilter(undefined);
  };
  
  // Calculate progress for a creator on a specific campaign
  function calculateCreatorProgress(
    submissions: Submission[],
    campaign: RetainerCampaign,
    creatorId: string
  ): RetainerProgress {
    const creatorSubmissions = submissions.filter(
      s => s.creator_id === creatorId && s.campaign_id === campaign.id
    );
    
    let totalRequired = 0;
    
    if (campaign.deliverables.mode === "videosPerDay" && campaign.deliverables.videosPerDay && campaign.deliverables.durationDays) {
      totalRequired = campaign.deliverables.videosPerDay * campaign.deliverables.durationDays;
    } else if (campaign.deliverables.mode === "totalVideos" && campaign.deliverables.totalVideos) {
      totalRequired = campaign.deliverables.totalVideos;
    }
    
    const submitted = creatorSubmissions.length;
    const approved = creatorSubmissions.filter(
      s => s.status === "approved" || s.status === "paid"
    ).length;
    const rejected = creatorSubmissions.filter(
      s => s.status === "rejected"
    ).length;
    const pending = creatorSubmissions.filter(
      s => s.status === "pending"
    ).length;
    
    const completionPercentage = totalRequired > 0
      ? Math.round((approved / totalRequired) * 100)
      : 0;
    
    return {
      creator_id: creatorId,
      campaign_id: campaign.id || "",
      total_required: totalRequired,
      submitted,
      approved,
      rejected,
      pending,
      completion_percentage: completionPercentage
    };
  }
  
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
  const findCampaignById = (campaignId: string): RetainerCampaign | undefined => {
    return campaigns.find(c => c.id === campaignId);
  };
  
  // Get progress component
  const getProgressComponent = (submission: Submission) => {
    const campaign = findCampaignById(submission.campaign_id);
    if (!campaign) return null;
    
    const progress = creatorProgressMap.get(submission.creator_id)?.find(
      p => p.campaign_id === submission.campaign_id
    );
    
    if (!progress) return null;
    
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between text-xs">
          <span>{progress.approved} of {progress.total_required} videos</span>
          <span>{progress.completion_percentage}%</span>
        </div>
        <Progress value={progress.completion_percentage} className="h-2" />
        <div className="text-xs text-muted-foreground">
          {progress.pending} pending, {progress.rejected} rejected
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-medium">Retainer Submissions</h3>
        
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
              <TableHead>Progress</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Post Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {retainerSubmissions.length === 0 ? "No retainer submissions yet" : "No results match your filters"}
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
                  <TableCell>
                    {getProgressComponent(submission)}
                  </TableCell>
                  <TableCell>{getPlatformBadge(submission.platform)}</TableCell>
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

      {/* Retainer Campaign Rules */}
      <div className="p-4 bg-muted/30 rounded-md border">
        <h4 className="font-medium mb-2">Retainer Campaign Rules</h4>
        <div className="text-sm">
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Creators must submit the total number of required videos to receive their full retainer payment</li>
            <li>Each video submission must be approved to count toward the completion percentage</li>
            <li>Rejected submissions must be replaced with new content</li>
            <li>Payment is issued after all deliverables have been fulfilled and approved</li>
            <li>Partial payment may be issued for partial completion based on contract terms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RetainerSubmissionsTable;
