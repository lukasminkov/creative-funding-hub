
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
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  MoreHorizontal, 
  Filter,
  X,
  Calendar,
  User
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Platform } from "@/lib/campaign-types";
import { format } from "date-fns";

// Sample submission type for the table
export interface CampaignSubmission {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  platform: Platform;
  platformUsername: string;
  views: number;
  postDate: Date;
  status: "pending" | "approved" | "rejected";
  contentUrl: string;
}

interface CampaignSubmissionsTableProps {
  submissions: CampaignSubmission[];
  onApprove: (submissionId: string) => void;
  onReject: (submissionId: string) => void;
  onViewContent: (url: string) => void;
}

const CampaignSubmissionsTable: React.FC<CampaignSubmissionsTableProps> = ({
  submissions,
  onApprove,
  onReject,
  onViewContent,
}) => {
  // State for filters
  const [creatorFilter, setCreatorFilter] = useState<string>("");
  const [platformFilter, setPlatformFilter] = useState<Platform | "">("");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Get unique creators and platforms for filter options
  const uniqueCreators = useMemo(() => {
    const creators = new Set(submissions.map(sub => sub.creatorName));
    return Array.from(creators);
  }, [submissions]);
  
  const uniquePlatforms = useMemo(() => {
    const platforms = new Set(submissions.map(sub => sub.platform));
    return Array.from(platforms);
  }, [submissions]);
  
  // Apply filters to submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(submission => {
      // Creator filter
      if (creatorFilter && !submission.creatorName.includes(creatorFilter)) {
        return false;
      }
      
      // Platform filter
      if (platformFilter && submission.platform !== platformFilter) {
        return false;
      }
      
      // Date filter
      if (dateFilter) {
        const submissionDate = new Date(submission.postDate);
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
  }, [submissions, creatorFilter, platformFilter, dateFilter]);
  
  // Check if any filters are active
  const hasActiveFilters = creatorFilter || platformFilter || dateFilter;
  
  // Function to clear all filters
  const clearFilters = () => {
    setCreatorFilter("");
    setPlatformFilter("");
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
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlatformBadge = (platform: Platform) => {
    const platformColors: Record<Platform, { bg: string; text: string }> = {
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

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
        <h3 className="text-lg font-medium">Submissions</h3>
        
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
                    {(creatorFilter ? 1 : 0) + (platformFilter ? 1 : 0) + (dateFilter ? 1 : 0)}
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
                        <SelectItem key={creator} value={creator}>{creator}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform</label>
                  <Select value={platformFilter} onValueChange={(value) => setPlatformFilter(value as Platform | "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Platforms</SelectItem>
                      {uniquePlatforms.map(platform => (
                        <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                      ))}
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
              <TableHead>Platform</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Post Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  {submissions.length === 0 ? "No submissions yet" : "No results match your filters"}
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {submission.creatorAvatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img 
                            src={submission.creatorAvatar} 
                            alt={submission.creatorName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {submission.creatorName.charAt(0)}
                        </div>
                      )}
                      {submission.creatorName}
                    </div>
                  </TableCell>
                  <TableCell>{getPlatformBadge(submission.platform)}</TableCell>
                  <TableCell>@{submission.platformUsername}</TableCell>
                  <TableCell>{submission.views.toLocaleString()}</TableCell>
                  <TableCell>{format(submission.postDate, 'MMM d, yyyy')}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewContent(submission.contentUrl)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {submission.status === "pending" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => onApprove(submission.id)}
                          >
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onReject(submission.id)}
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
                          <DropdownMenuItem onClick={() => onViewContent(submission.contentUrl)}>
                            View Content
                          </DropdownMenuItem>
                          {submission.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => onApprove(submission.id)}>
                                Approve Submission
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onReject(submission.id)}>
                                Reject Submission
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>Contact Creator</DropdownMenuItem>
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
    </div>
  );
};

export default CampaignSubmissionsTable;
