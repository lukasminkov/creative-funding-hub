
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
import { RetainerCampaign, Submission, formatCurrency, getRetainerProgress } from "@/lib/campaign-types";
import { format } from "date-fns";
import { ArrowUpRight, Eye, MoreHorizontal, ThumbsDown, ThumbsUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RetainerSubmissionsTableProps {
  submissions: Submission[];
  campaigns: RetainerCampaign[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

const RetainerSubmissionsTable = ({
  submissions,
  campaigns,
  onApprove,
  onDeny,
}: RetainerSubmissionsTableProps) => {
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

  // Group submissions by creator to show progress
  const submissionsByCreator = submissions.reduce((acc, submission) => {
    if (!acc[submission.creator_id]) {
      acc[submission.creator_id] = [];
    }
    acc[submission.creator_id].push(submission);
    return acc;
  }, {} as Record<string, Submission[]>);

  if (submissions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No retainer submissions yet
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
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => {
            const campaign = campaigns.find(c => c.id === submission.campaign_id);
            
            // Get creator progress if campaign exists
            const creatorSubmissions = submissionsByCreator[submission.creator_id] || [];
            const progress = campaign ? 
              getRetainerProgress(creatorSubmissions, campaign, submission.creator_id) : 
              { 
                completion_percentage: 0, 
                approved: 0, 
                total_required: 0 
              };
            
            return (
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
                  {submission.platform_account || "-"}
                </TableCell>
                <TableCell>{format(new Date(submission.submitted_date), 'MMM d, yyyy')}</TableCell>
                <TableCell>
                  <Badge 
                    className={
                      submission.status === "approved" ? "bg-green-100 text-green-800 hover:bg-green-100" :
                      submission.status === "rejected" ? "bg-red-100 text-red-800 hover:bg-red-100" :
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
                  <div className="w-32 space-y-1">
                    <Progress value={progress.completion_percentage} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {progress.approved} of {progress.total_required} deliverables ({progress.completion_percentage}%)
                    </div>
                  </div>
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
            );
          })}
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

export default RetainerSubmissionsTable;
