
import React, { useState } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  PayPerViewCampaign, 
  Submission, 
  calculatePayPerViewPayout, 
  formatCurrency 
} from "@/lib/campaign-types";
import { format, differenceInHours, differenceInDays, addHours } from "date-fns";
import { ArrowUpRight, Eye, MoreHorizontal, ThumbsDown, ThumbsUp, Clock, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PayPerViewSubmissionsTableProps {
  submissions: Submission[];
  campaigns: PayPerViewCampaign[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

const PayPerViewSubmissionsTable = ({
  submissions,
  campaigns,
  onApprove,
  onDeny,
}: PayPerViewSubmissionsTableProps) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(false);

  const handleApproveClick = async (submission: Submission) => {
    setLoading(true);
    try {
      await onApprove(submission);
    } catch (error) {
      console.error("Error approving submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClick = (submission: Submission) => {
    setCurrentSubmission(submission);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!currentSubmission) return;
    
    setLoading(true);
    try {
      await onDeny(currentSubmission, rejectReason);
      setRejectDialogOpen(false);
    } catch (error) {
      console.error("Error rejecting submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDeadlineInfo = (submission: Submission) => {
    const now = new Date();
    
    // For pay-per-view: 240 hours (10 days) deadline to approve/reject
    const deadlineForApproval = addHours(new Date(submission.submitted_date), 240);
    const hoursRemaining = differenceInHours(deadlineForApproval, now);
    
    // For view accumulation: 10 days
    const viewDeadline = addHours(new Date(submission.submitted_date), 240);
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
            <span>{Math.floor(hoursRemaining)}h left</span>
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

  const getEstimatedPayout = (submission: Submission) => {
    const campaign = campaigns.find(c => c.id === submission.campaign_id);
    
    if (!campaign) {
      return "N/A";
    }
    
    const payout = calculatePayPerViewPayout(
      submission.views, 
      campaign.ratePerThousand,
      campaign.maxPayoutPerSubmission
    );
    
    const maxReached = payout >= campaign.maxPayoutPerSubmission;
    
    return (
      <div>
        <div className="font-medium">{formatCurrency(payout, campaign.currency)}</div>
        <div className="text-xs text-muted-foreground">
          {maxReached ? 
            <span className="text-green-600">Max payout reached</span> : 
            `${campaign.ratePerThousand}/${campaign.currency} per 1K views`
          }
        </div>
      </div>
    );
  };

  if (submissions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No pay-per-view submissions yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Creator</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Est. Payout</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {submission.creator_avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img 
                        src={submission.creator_avatar} 
                        alt={submission.creator_name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {submission.creator_name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium">{submission.creator_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{submission.platform}</Badge>
              </TableCell>
              <TableCell>
                {submission.platformUsername || "-"}
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="cursor-help">
                        {submission.views.toLocaleString()}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Views are updated every 24 hours</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell>{format(new Date(submission.submitted_date), 'MMM d, yyyy')}</TableCell>
              <TableCell>
                <Badge 
                  className={
                    submission.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                    submission.status === "denied" ? "bg-red-100 text-red-800 hover:bg-red-100" :
                    submission.status === "pending" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" :
                    submission.status === "paid" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" :
                    ""
                  }
                  variant="outline"
                >
                  {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                {getDeadlineInfo(submission)}
              </TableCell>
              <TableCell>
                {getEstimatedPayout(submission)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => window.open(submission.content, '_blank')}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {submission.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApproveClick(submission)}
                        disabled={loading}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRejectClick(submission)}
                        disabled={loading}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(submission.content, '_blank')}>
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        View Content
                      </DropdownMenuItem>
                      {submission.status === "pending" && (
                        <>
                          <DropdownMenuItem 
                            onClick={() => handleApproveClick(submission)}
                            disabled={loading}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRejectClick(submission)}
                            disabled={loading}
                          >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this submission
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Explain why you're rejecting this submission..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleRejectConfirm}
              disabled={loading || !rejectReason.trim()}
            >
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayPerViewSubmissionsTable;
