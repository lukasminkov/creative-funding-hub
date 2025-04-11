import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialIcon } from "@/components/icons/SocialIcons";
import { Progress } from "@/components/ui/progress";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Campaign, Submission, RetainerCampaign, getRetainerProgress } from "@/lib/campaign-types";
import { Search, ChevronsUpDown, MessageSquare, Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Creator {
  id: number;
  name: string;
  avatar: string;
  platforms: string[];
  submissions: number;
  views: number;
  status: string;
}

interface CampaignCreatorsListProps {
  creators: Creator[];
  campaign?: Campaign;
  submissions?: Submission[];
}

export default function CampaignCreatorsList({ creators, campaign, submissions = [] }: CampaignCreatorsListProps) {
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const navigate = useNavigate();
  
  const mockSubmissions = submissions.length > 0 ? submissions : creators.flatMap(creator => {
    return Array(creator.submissions).fill(0).map((_, i) => ({
      id: `sub-${creator.id}-${i}`,
      creator_id: creator.id.toString(),
      creator_name: creator.name,
      creator_avatar: creator.avatar,
      campaign_id: campaign?.id || "campaign-1",
      campaign_title: campaign?.title || "Campaign",
      campaign_type: (campaign?.type || "retainer") as "retainer" | "payPerView" | "challenge",
      submitted_date: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
      payment_amount: Math.floor(Math.random() * 200) + 100,
      views: Math.floor(Math.random() * 10000) + 1000,
      status: ["pending", "approved", "denied", "paid"][Math.floor(Math.random() * 4)] as "pending" | "approved" | "denied" | "paid",
      platform: ["TikTok", "Instagram Reels", "YouTube Shorts"][Math.floor(Math.random() * 3)],
      platformUsername: `@${creator.name.toLowerCase().replace(/\s/g, "_")}`,
      content: `https://example.com/video-${creator.id}-${i}`
    }));
  });
  
  const getCreatorSubmissions = (creatorId: number) => {
    return mockSubmissions.filter(sub => sub.creator_id === creatorId.toString());
  };
  
  const getProgress = (creatorId: number) => {
    if (campaign?.type === "retainer") {
      const creatorSubs = getCreatorSubmissions(creatorId);
      const retainerCampaign = campaign as RetainerCampaign;
      return getRetainerProgress(creatorSubs, retainerCampaign, creatorId.toString());
    }
    return { completion_percentage: 0, approved: 0, total_required: 0 };
  };

  const handleMessageCreator = (creatorId: number, creatorName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toast.success(`Opening message with ${creatorName}`);
    navigate("/dashboard/messages", { 
      state: { 
        creatorId, 
        creatorName,
        initiateMessage: true 
      } 
    });
  };

  const handleViewProfile = (creatorId: number) => {
    toast.info(`Viewing profile for creator #${creatorId}`);
    // In a real implementation, we would navigate to the creator's profile page
    // navigate(`/dashboard/creators/${creatorId}`);
  };

  return (
    <div className="overflow-x-auto">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {creators.length} active creator{creators.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search creators..."
              className="h-9 rounded-md border border-input pl-8 pr-3 text-sm focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead>Creator</TableHead>
              <TableHead>Platforms</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Views</TableHead>
              {campaign?.type === "retainer" && <TableHead>Progress</TableHead>}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {creators.map(creator => {
              const progress = getProgress(creator.id);
              
              return (
                <TableRow 
                  key={creator.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleViewProfile(creator.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{creator.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {creator.status === "active" ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200">
                              {creator.status}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {creator.platforms.map(platform => (
                        <div key={platform} className="bg-secondary/80 p-1 rounded-full" title={platform}>
                          <SocialIcon platform={platform} />
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{creator.submissions}</TableCell>
                  <TableCell>{creator.views.toLocaleString()}</TableCell>
                  
                  {campaign?.type === "retainer" && (
                    <TableCell>
                      <div className="w-32 space-y-1">
                        <Progress 
                          value={progress.completion_percentage} 
                          className="h-2" 
                          indicatorClassName={progress.completion_percentage >= 100 ? "bg-green-500" : ""}
                        />
                        <div className="text-xs text-muted-foreground">
                          {progress.approved} of {progress.total_required} ({progress.completion_percentage}%)
                        </div>
                      </div>
                    </TableCell>
                  )}
                  
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={(e) => handleMessageCreator(creator.id, creator.name, e)}
                        className="hover:bg-primary/10 hover:text-primary"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Message {creator.name}</span>
                      </Button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="mr-1">Submissions</span>
                            <ChevronsUpDown className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <CreatorSubmissionsPopover 
                            creator={creator} 
                            submissions={getCreatorSubmissions(creator.id)}
                          />
                        </PopoverContent>
                      </Popover>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProfile(creator.id);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CreatorSubmissionsPopover({ 
  creator, 
  submissions 
}: { 
  creator: Creator, 
  submissions: Submission[] 
}) {
  return (
    <div className="max-h-[400px] overflow-auto">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={creator.avatar} alt={creator.name} />
            <AvatarFallback>{creator.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{creator.name}</h4>
            <p className="text-sm text-muted-foreground">All Submissions</p>
          </div>
        </div>
      </div>
      
      <div className="p-2">
        {submissions.length > 0 ? (
          <div className="space-y-2">
            {submissions.map(submission => (
              <div key={submission.id} className="p-3 border rounded-md hover:border-primary/30 hover:bg-primary/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                        {submission.platform}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.platformUsername}
                      </div>
                    </div>
                    <div className="text-sm mb-2">
                      Submitted: {submission.submitted_date.toLocaleDateString()}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Views:</span> {submission.views.toLocaleString()}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>{" "}
                        <Badge variant="outline" className={
                          submission.status === "approved" ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" :
                          submission.status === "denied" ? "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" :
                          submission.status === "paid" ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200" :
                          "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200"
                        }>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-1 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                    onClick={() => window.open(submission.content, '_blank')}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No submissions yet
          </div>
        )}
      </div>
    </div>
  );
}
