
import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Eye, 
  ExternalLink,
  Check,
  X,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Submission, SUBMISSION_STATUS_OPTIONS, Campaign } from '@/lib/campaign-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PaymentConfirmationDialog from './PaymentConfirmationDialog';
import { format, differenceInHours, addHours } from 'date-fns';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CampaignSubmissionsReviewProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
  campaignId?: string;
  campaign?: Campaign;
}

const CampaignSubmissionsReview: React.FC<CampaignSubmissionsReviewProps> = ({ 
  submissions, 
  onApprove, 
  onDeny,
  campaignId,
  campaign
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [isDenialDialogOpen, setIsDenialDialogOpen] = useState(false);
  
  // Filter submissions based on search term
  const filteredSubmissions = submissions.filter(submission => {
    const searchLower = searchTerm.toLowerCase();
    
    // If we're filtering by campaign ID and this submission doesn't match, exclude it
    if (campaignId && submission.campaign_id !== campaignId) {
      return false;
    }
    
    return (
      submission.creator_name.toLowerCase().includes(searchLower) ||
      submission.campaign_title.toLowerCase().includes(searchLower) ||
      submission.platform.toLowerCase().includes(searchLower) ||
      submission.content.toLowerCase().includes(searchLower)
    );
  });

  const handleApproveClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsApprovalDialogOpen(true);
  };

  const handleDenyClick = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsDenialDialogOpen(true);
  };

  const handleViewContent = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Calculate the deadline for a submission based on campaign type
  const getDeadlineInfo = (submission: Submission) => {
    if (!campaign) {
      // Default for PayPerView if no campaign is provided
      const autoAcceptDeadline = addHours(new Date(submission.submitted_date), 240);
      const hoursLeft = differenceInHours(autoAcceptDeadline, new Date());
      return {
        deadline: autoAcceptDeadline,
        hoursLeft,
        isUrgent: hoursLeft < 48 && hoursLeft > 0,
        isExpired: hoursLeft <= 0,
        description: "Auto-accepts in"
      };
    }

    if (campaign.type === 'payPerView') {
      const autoAcceptDeadline = addHours(new Date(submission.submitted_date), 240);
      const hoursLeft = differenceInHours(autoAcceptDeadline, new Date());
      return {
        deadline: autoAcceptDeadline,
        hoursLeft,
        isUrgent: hoursLeft < 48 && hoursLeft > 0,
        isExpired: hoursLeft <= 0,
        description: "Auto-accepts in"
      };
    } else if (campaign.type === 'retainer') {
      // For retainer campaigns, use the end date as the deadline
      const hoursLeft = differenceInHours(new Date(campaign.endDate), new Date());
      return {
        deadline: new Date(campaign.endDate),
        hoursLeft,
        isUrgent: hoursLeft < 72 && hoursLeft > 0,
        isExpired: hoursLeft <= 0,
        description: "Contract ends in"
      };
    } else if (campaign.type === 'challenge') {
      // For challenge campaigns, use the submission deadline
      const challengeCampaign = campaign as any; // Type assertion to access submissionDeadline
      if (challengeCampaign.submissionDeadline) {
        const hoursLeft = differenceInHours(new Date(challengeCampaign.submissionDeadline), new Date());
        return {
          deadline: new Date(challengeCampaign.submissionDeadline),
          hoursLeft,
          isUrgent: hoursLeft < 72 && hoursLeft > 0,
          isExpired: hoursLeft <= 0,
          description: "Challenge ends in"
        };
      }
    }

    // Default fallback
    return {
      deadline: addHours(new Date(submission.submitted_date), 240),
      hoursLeft: 240,
      isUrgent: false,
      isExpired: false,
      description: "Deadline"
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCampaignTypeExplanation = () => {
    if (!campaign) return null;
    
    let explanation = "";
    
    switch(campaign.type) {
      case 'payPerView':
        explanation = "Pay-per-view submissions have 10 days to accumulate views and are paid based on the views after this period. Submissions are auto-accepted after 240 hours (10 days) if not reviewed.";
        break;
      case 'retainer':
        explanation = "Retainer campaigns pay a fixed sum after all deliverables are successfully submitted. All submissions must be accepted to receive payment.";
        break;
      case 'challenge':
        explanation = "Challenge campaigns are paid out after the campaign has ended. Winners are selected from approved submissions.";
        break;
      default:
        return null;
    }
    
    return (
      <div className="bg-muted/30 p-4 rounded-md mb-4 text-sm">
        <div className="font-medium mb-1">Campaign Type: {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}</div>
        <p className="text-muted-foreground">{explanation}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Campaign Submissions</h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {getCampaignTypeExplanation()}

      {filteredSubmissions.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => {
                const { deadline, hoursLeft, isUrgent, isExpired, description } = getDeadlineInfo(submission);
                
                return (
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
                    <TableCell>{submission.platform}</TableCell>
                    <TableCell>
                      {format(new Date(submission.submitted_date), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {submission.status === 'pending' ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-1">
                                {isExpired ? (
                                  <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : isUrgent ? (
                                  <Clock className="h-4 w-4 text-amber-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-slate-400" />
                                )}
                                <span className={`text-xs ${isExpired ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-slate-600'}`}>
                                  {isExpired 
                                    ? 'Expired' 
                                    : `${Math.floor(hoursLeft)} hours`}
                                </span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {isExpired 
                                  ? 'Deadline passed, submission will auto-accept' 
                                  : `${description} ${Math.floor(hoursLeft)} hours (${format(deadline, 'MMM dd, HH:mm')})`}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </TableCell>
                    <TableCell>{submission.views.toLocaleString()}</TableCell>
                    <TableCell>${submission.payment_amount}</TableCell>
                    <TableCell>{getStatusBadge(submission.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContent(submission.content)}
                          title="View Content"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {submission.status === 'pending' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => handleApproveClick(submission)}
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => handleDenyClick(submission)}
                              title="Deny"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewContent(submission.content)}
                          title="Open in New Tab"
                        >
                          <ExternalLink className="h-4 w-4" />
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
        <div className="text-center py-10 border rounded-md bg-muted/10">
          <p className="text-muted-foreground">No submissions found</p>
          {searchTerm && (
            <Button 
              variant="ghost" 
              className="mt-2"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      {selectedSubmission && (
        <PaymentConfirmationDialog
          open={isApprovalDialogOpen}
          onOpenChange={setIsApprovalDialogOpen}
          submission={selectedSubmission}
          onConfirm={onApprove}
        />
      )}

      {/* Denial Confirmation Dialog */}
      {selectedSubmission && (
        <PaymentConfirmationDialog
          open={isDenialDialogOpen}
          onOpenChange={setIsDenialDialogOpen}
          submission={selectedSubmission}
          onConfirm={() => Promise.resolve()}
          isDenial={true}
          onDeny={onDeny}
        />
      )}
    </div>
  );
};

export default CampaignSubmissionsReview;
