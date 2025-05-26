
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Users, 
  FileText, 
  Search, 
  Filter,
  Eye,
  Check,
  X,
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  ExternalLink,
  User,
  MessageCircle
} from "lucide-react";
import { Campaign, Submission } from "@/lib/campaign-types";
import { format } from "date-fns";
import CreatorProfilePopup from "./CreatorProfilePopup";

interface CampaignManagementProps {
  campaign: Campaign;
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

export default function CampaignManagement({ 
  campaign, 
  submissions, 
  onApprove, 
  onDeny 
}: CampaignManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [isCreatorProfileOpen, setIsCreatorProfileOpen] = useState(false);

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(submission => {
      // Get creator username for search
      const creatorUsername = getCreatorUsername(submission.creator_name);
      const matchesSearch = creatorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.platform.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "views":
          aValue = a.views;
          bValue = b.views;
          break;
        case "payment":
          aValue = a.payment_amount;
          bValue = b.payment_amount;
          break;
        case "creator":
          aValue = getCreatorUsername(a.creator_name);
          bValue = getCreatorUsername(b.creator_name);
          break;
        case "date":
        default:
          aValue = new Date(a.submitted_date).getTime();
          bValue = new Date(b.submitted_date).getTime();
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      
      return sortOrder === "asc" ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    });

  // Get unique creators with their performance metrics
  const creators = submissions.reduce((acc, submission) => {
    const existing = acc.find(c => c.creator_id === submission.creator_id);
    if (existing) {
      existing.submissions += 1;
      existing.totalViews += submission.views;
      existing.totalEarnings += submission.payment_amount;
      if (submission.status === 'approved' || submission.status === 'paid') {
        existing.approvedSubmissions += 1;
      }
    } else {
      acc.push({
        creator_id: submission.creator_id,
        creator_name: submission.creator_name,
        creator_username: getCreatorUsername(submission.creator_name),
        creator_avatar: submission.creator_avatar,
        submissions: 1,
        approvedSubmissions: submission.status === 'approved' || submission.status === 'paid' ? 1 : 0,
        totalViews: submission.views,
        totalEarnings: submission.payment_amount,
        avgViews: submission.views,
        approvalRate: submission.status === 'approved' || submission.status === 'paid' ? 100 : 0
      });
    }
    return acc;
  }, [] as any[]).map(creator => ({
    ...creator,
    avgViews: Math.round(creator.totalViews / creator.submissions),
    approvalRate: Math.round((creator.approvedSubmissions / creator.submissions) * 100)
  }));

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

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleCreatorClick = (submission: Submission) => {
    setSelectedCreator({
      id: submission.creator_id,
      name: submission.creator_name,
      username: getCreatorUsername(submission.creator_name),
      avatar: submission.creator_avatar,
      submissions: submissions.filter(s => s.creator_id === submission.creator_id),
      totalViews: submissions
        .filter(s => s.creator_id === submission.creator_id)
        .reduce((sum, s) => sum + s.views, 0),
      totalEarnings: submissions
        .filter(s => s.creator_id === submission.creator_id)
        .reduce((sum, s) => sum + s.payment_amount, 0),
    });
    setIsCreatorProfileOpen(true);
  };

  // Generate mock platform username based on creator name and platform
  const getPlatformUsername = (creatorName: string, platform: string) => {
    const cleanName = creatorName.toLowerCase().replace(/\s+/g, '');
    const platformSuffix = platform.toLowerCase().includes('tiktok') ? '_tt' : 
                          platform.toLowerCase().includes('instagram') ? '_ig' :
                          platform.toLowerCase().includes('youtube') ? '_yt' :
                          platform.toLowerCase().includes('twitter') ? '_tw' : '';
    return `@${cleanName}${platformSuffix}`;
  };

  // Extract username from creator name (assuming format like "@username" or "Full Name (@username)")
  const getCreatorUsername = (creatorName: string) => {
    // Check if name contains username in parentheses like "John Doe (@johndoe)"
    const usernameMatch = creatorName.match(/\(@([^)]+)\)/);
    if (usernameMatch) {
      return `@${usernameMatch[1]}`;
    }
    
    // Check if name starts with @ (already a username)
    if (creatorName.startsWith('@')) {
      return creatorName;
    }
    
    // Generate username from name as fallback
    const cleanName = creatorName.toLowerCase().replace(/\s+/g, '');
    return `@${cleanName}`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="submissions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submissions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Submissions ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="creators" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Creators ({creators.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submissions" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Submissions Management</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="denied">Denied</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("creator")}>
                        <div className="flex items-center gap-1">
                          Creator
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                        <div className="flex items-center gap-1">
                          Submitted
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("views")}>
                        <div className="flex items-center gap-1">
                          Views
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("payment")}>
                        <div className="flex items-center gap-1">
                          Payment
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
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
                                <AvatarFallback>{getCreatorUsername(submission.creator_name).charAt(1)}</AvatarFallback>
                              )}
                            </Avatar>
                            <button
                              onClick={() => handleCreatorClick(submission)}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {getCreatorUsername(submission.creator_name)}
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{submission.platform}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-muted-foreground">
                            {getPlatformUsername(submission.creator_name, submission.platform)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(submission.submitted_date), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>{submission.views.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(submission.status)}</TableCell>
                        <TableCell>${submission.payment_amount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(submission.content, '_blank')}
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
                                  onClick={() => onApprove(submission)}
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={() => onDeny(submission, "")}
                                  title="Deny"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Creators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Submissions</TableHead>
                      <TableHead>Approval Rate</TableHead>
                      <TableHead>Total Views</TableHead>
                      <TableHead>Avg Views</TableHead>
                      <TableHead>Total Earnings</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creators
                      .sort((a, b) => b.totalViews - a.totalViews)
                      .map((creator) => (
                        <TableRow key={creator.creator_id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                {creator.creator_avatar ? (
                                  <AvatarImage src={creator.creator_avatar} alt={creator.creator_name} />
                                ) : (
                                  <AvatarFallback>{creator.creator_username.charAt(1)}</AvatarFallback>
                                )}
                              </Avatar>
                              <span className="font-medium">{creator.creator_username}</span>
                            </div>
                          </TableCell>
                          <TableCell>{creator.submissions}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {creator.approvalRate}%
                              {creator.approvalRate >= 80 ? (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              ) : creator.approvalRate >= 50 ? (
                                <ArrowUpDown className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{creator.totalViews.toLocaleString()}</TableCell>
                          <TableCell>{creator.avgViews.toLocaleString()}</TableCell>
                          <TableCell>${creator.totalEarnings}</TableCell>
                          <TableCell>
                            {creator.totalViews > 100000 ? (
                              <Badge className="bg-green-100 text-green-800">High Performer</Badge>
                            ) : creator.totalViews > 50000 ? (
                              <Badge className="bg-blue-100 text-blue-800">Good Performer</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Standard</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Creator Profile Popup */}
      <CreatorProfilePopup
        creator={selectedCreator}
        open={isCreatorProfileOpen}
        onOpenChange={setIsCreatorProfileOpen}
      />
    </div>
  );
}
