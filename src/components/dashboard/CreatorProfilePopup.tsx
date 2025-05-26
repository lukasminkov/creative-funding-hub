
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  User,
  Eye,
  DollarSign,
  Trophy,
  TrendingUp,
  ExternalLink,
  Mail,
  Phone
} from "lucide-react";
import { format } from "date-fns";

interface Creator {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  submissions: any[];
  totalViews: number;
  totalEarnings: number;
}

interface CreatorProfilePopupProps {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatorProfilePopup: React.FC<CreatorProfilePopupProps> = ({
  creator,
  open,
  onOpenChange,
}) => {
  if (!creator) return null;

  const approvedSubmissions = creator.submissions.filter(s => s.status === 'approved' || s.status === 'paid');
  const approvalRate = creator.submissions.length > 0 
    ? Math.round((approvedSubmissions.length / creator.submissions.length) * 100)
    : 0;
  
  const avgViews = creator.submissions.length > 0 
    ? Math.round(creator.totalViews / creator.submissions.length)
    : 0;

  const getPerformanceBadge = () => {
    if (creator.totalViews > 100000) {
      return <Badge className="bg-green-100 text-green-800">High Performer</Badge>;
    } else if (creator.totalViews > 50000) {
      return <Badge className="bg-blue-100 text-blue-800">Good Performer</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Standard</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Approved</Badge>;
      case 'denied':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Denied</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Extract username from creator name or use provided username
  const getDisplayUsername = () => {
    if (creator.username) return creator.username;
    
    // Check if name contains username in parentheses like "John Doe (@johndoe)"
    const usernameMatch = creator.name.match(/\(@([^)]+)\)/);
    if (usernameMatch) {
      return `@${usernameMatch[1]}`;
    }
    
    // Check if name starts with @ (already a username)
    if (creator.name.startsWith('@')) {
      return creator.name;
    }
    
    // Generate username from name as fallback
    const cleanName = creator.name.toLowerCase().replace(/\s+/g, '');
    return `@${cleanName}`;
  };

  const displayUsername = getDisplayUsername();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              {creator.avatar ? (
                <AvatarImage src={creator.avatar} alt={creator.name} />
              ) : (
                <AvatarFallback className="text-lg">{displayUsername.charAt(1)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{displayUsername}</h2>
              <div className="flex items-center gap-2 mt-1">
                {getPerformanceBadge()}
                <Badge variant="outline">Creator ID: {creator.id.slice(0, 8)}...</Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Stats */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-2xl font-bold">{creator.submissions.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Total Views</p>
                      <p className="text-2xl font-bold">{creator.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Avg Views</p>
                      <p className="text-2xl font-bold">{avgViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Earnings</p>
                      <p className="text-2xl font-bold">${creator.totalEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Submissions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creator.submissions.slice(0, 5).map((submission, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{submission.platform}</Badge>
                        <div>
                          <p className="font-medium">{submission.campaign_title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(submission.submitted_date), 'MMM dd, yyyy')} • {submission.views.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(submission.content, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Creator Actions & Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="default">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button className="w-full" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button className="w-full" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Approval Rate</span>
                    <span className="font-medium">{approvalRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${approvalRate}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">Usually responds within 2 hours</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Platforms</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {[...new Set(creator.submissions.map(s => s.platform))].map(platform => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">January 2024</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfilePopup;
