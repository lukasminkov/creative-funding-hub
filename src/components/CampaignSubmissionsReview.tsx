
import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Search, 
  Eye, 
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { Submission, SUBMISSION_STATUS_OPTIONS } from '@/lib/campaign-types';
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
import { toast } from 'sonner';

interface CampaignSubmissionsReviewProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
  campaignId?: string;
}

const CampaignSubmissionsReview: React.FC<CampaignSubmissionsReviewProps> = ({ 
  submissions, 
  onApprove, 
  onDeny,
  campaignId 
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

      {filteredSubmissions.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((submission) => (
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
              ))}
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
