
import React from "react";
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
import { Eye, ThumbsUp, ThumbsDown, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
          {submissions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No submissions yet
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => (
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
  );
};

export default CampaignSubmissionsTable;
