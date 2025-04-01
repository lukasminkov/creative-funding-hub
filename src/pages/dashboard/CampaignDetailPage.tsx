
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Calendar, 
  ChevronRight, 
  DollarSign, 
  Edit, 
  Eye, 
  FileCheck, 
  Instagram,
  MessageSquare, 
  Plus, 
  Twitter,
  Users,
  Youtube
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/lib/campaign-types";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SocialIcon } from "@/components/icons/SocialIcons";

// Mock creators data
const mockCreators = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    platforms: ["instagram", "tiktok"],
    submissions: 5,
    views: 25000,
    status: "active"
  },
  {
    id: 2,
    name: "Mike Peters",
    avatar: "https://i.pravatar.cc/150?u=mike",
    platforms: ["tiktok", "youtube"],
    submissions: 3,
    views: 18500,
    status: "active"
  },
  {
    id: 3,
    name: "Jessica Williams",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    platforms: ["instagram", "twitter"],
    submissions: 4,
    views: 15200,
    status: "active"
  }
];

// Mock applications data
const mockApplications = [
  {
    id: 101,
    name: "Tyler Rodriguez",
    avatar: "https://i.pravatar.cc/150?u=tyler",
    platforms: ["instagram", "tiktok", "youtube"],
    followers: 15000,
    status: "pending"
  },
  {
    id: 102,
    name: "Aisha Patel",
    avatar: "https://i.pravatar.cc/150?u=aisha",
    platforms: ["tiktok"],
    followers: 22000,
    status: "pending"
  },
  {
    id: 103,
    name: "Marcus Green",
    avatar: "https://i.pravatar.cc/150?u=marcus",
    platforms: ["instagram", "youtube"],
    followers: 8500,
    status: "pending"
  }
];

// Mock submissions data
const mockSubmissions = [
  {
    id: 201,
    creator: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    title: "Product Review Video",
    platform: "tiktok",
    views: 8500,
    date: "2023-09-10",
    status: "approved"
  },
  {
    id: 202,
    creator: "Mike Peters",
    avatar: "https://i.pravatar.cc/150?u=mike",
    title: "Brand Unboxing",
    platform: "youtube",
    views: 12300,
    date: "2023-09-05",
    status: "approved"
  },
  {
    id: 203,
    creator: "Jessica Williams",
    avatar: "https://i.pravatar.cc/150?u=jessica",
    title: "Tutorial with Product",
    platform: "instagram",
    views: 5600,
    date: "2023-09-12",
    status: "pending"
  }
];

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active-creators");
  
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', id],
    queryFn: async () => {
      // In a real app, this would be an API call
      const storedCampaigns = localStorage.getItem("campaigns");
      const campaigns = storedCampaigns ? JSON.parse(storedCampaigns) : [];
      const campaign = campaigns.find((c: Campaign) => c.id === id);
      
      if (!campaign) {
        throw new Error("Campaign not found");
      }
      
      return campaign;
    }
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded mb-4"></div>
          <div className="h-6 w-64 bg-muted rounded"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-20 bg-muted rounded mb-2"></div>
                <div className="h-3 w-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign not found</h2>
        <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or was deleted.</p>
        <Button onClick={() => navigate("/dashboard/campaigns")}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  // Determine campaign status and progress
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  let status = "Active";
  let statusColor = "bg-green-100 text-green-800";
  let progress = 0;
  let progressText = "";
  
  if (endDate < now) {
    status = "Ended";
    statusColor = "bg-gray-100 text-gray-800";
    progress = 100;
  } else if (campaign.type === "retainer") {
    const appDeadline = new Date(campaign.applicationDeadline);
    if (appDeadline > now) {
      status = "Application Phase";
      statusColor = "bg-purple-100 text-purple-800";
      progress = 0;
    } else {
      // Simulate 40% of deliverables submitted
      progress = 40;
    }
    
    const totalVideos = campaign.deliverables?.totalVideos || 10;
    progressText = `${Math.round(totalVideos * (progress/100))}/${totalVideos} deliverables`;
  } else if (campaign.type === "payPerView") {
    // Simulate 30% of budget spent
    progress = status === "Ended" ? 100 : 30;
    progressText = `$${(campaign.totalBudget * (progress/100)).toFixed(2)}/$${campaign.totalBudget} spent`;
  } else if (campaign.type === "challenge") {
    const submitDeadline = new Date(campaign.submissionDeadline);
    if (submitDeadline < now) {
      status = "Judging";
      statusColor = "bg-yellow-100 text-yellow-800";
      progress = 100;
    } else {
      // Calculate progress based on time
      const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000); // Assume started 2 weeks ago
      const total = submitDeadline.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      progress = Math.min(100, Math.floor((elapsed / total) * 100));
    }
    progressText = `${Math.round(progress)}% complete`;
  }

  // Simulated stats
  const stats = {
    views: 15000 + Math.floor(Math.random() * 10000),
    submissions: 12 + Math.floor(Math.random() * 10),
    creators: 3 + Math.floor(Math.random() * 3),
    spent: campaign.totalBudget * (progress/100),
  };

  // Campaign metrics based on type
  const renderMetrics = () => {
    if (campaign.type === "payPerView") {
      return (
        <>
          <h3 className="text-lg font-semibold mb-3">Budget Status</h3>
          <div className="mb-5">
            <div className="flex justify-between mb-1 text-sm">
              <span>{progressText}</span>
              <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
            <Progress 
              value={progress} 
              className="h-3 bg-green-100"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div>
              <div className="text-sm text-muted-foreground">Cost Per View</div>
              <div className="text-xl font-semibold">
                ${((stats.spent / stats.views) || 0).toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Remaining Budget</div>
              <div className="text-xl font-semibold">
                ${(campaign.totalBudget - stats.spent).toFixed(2)}
              </div>
            </div>
          </div>
          
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full mb-2">Add Budget</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Add Budget to Campaign</DrawerTitle>
                <DrawerDescription>
                  Increase the budget for "{campaign.title}"
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 space-y-4">
                {/* Budget addition form would go here */}
                <Button className="w-full">Add $1,000 to Budget</Button>
              </div>
            </DrawerContent>
          </Drawer>
        </>
      );
    } else if (campaign.type === "retainer") {
      return (
        <>
          <h3 className="text-lg font-semibold mb-3">Deliverables Status</h3>
          <div className="mb-5">
            <div className="flex justify-between mb-1 text-sm">
              <span>{progressText}</span>
              <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div>
              <div className="text-sm text-muted-foreground">Days Remaining</div>
              <div className="text-xl font-semibold">
                {Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Approval Rate</div>
              <div className="text-xl font-semibold">
                92%
              </div>
            </div>
          </div>
        </>
      );
    } else {
      // Challenge campaign
      return (
        <>
          <h3 className="text-lg font-semibold mb-3">Challenge Status</h3>
          <div className="mb-5">
            <div className="flex justify-between mb-1 text-sm">
              <span>{progressText}</span>
              <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
                {status}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-5">
            <div>
              <div className="text-sm text-muted-foreground">Submissions</div>
              <div className="text-xl font-semibold">
                {stats.submissions}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Days Remaining</div>
              <div className="text-xl font-semibold">
                {Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))}
              </div>
            </div>
          </div>
          
          {status === "Judging" && (
            <Button variant="outline" className="w-full mb-2">View Submissions for Judging</Button>
          )}
        </>
      );
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2" 
          onClick={() => navigate("/dashboard/campaigns")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center text-sm text-muted-foreground">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link to="/dashboard/campaigns" className="hover:underline">Campaigns</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-foreground">{campaign.title}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
              {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)}
            </span>
            <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
              {campaign.contentType}
            </span>
            <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="flex gap-2 self-end md:self-auto">
          <Link to={`/dashboard/campaigns/${id}/chat`}>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              Campaign Chat
            </Button>
          </Link>
          <Link to={`/dashboard/campaigns/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Campaign Analytics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.views.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              From creator content
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Used</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.spent.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Of ${campaign.totalBudget.toLocaleString()} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submissions</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submissions}</div>
            <p className="text-xs text-muted-foreground">
              Content submissions received
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.creators}</div>
            <p className="text-xs text-muted-foreground">
              Working on this campaign
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          {campaign.bannerImage && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img 
                src={campaign.bannerImage} 
                alt={campaign.title} 
                className="w-full object-cover h-64" 
              />
            </div>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">
                  {campaign.description || "No description provided."}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.platforms && campaign.platforms.map(platform => (
                    <div key={platform} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
                      {platform}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium flex items-center mb-3 text-green-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-green-500 mr-2">✓</span>
                      Do's
                    </h4>
                    {campaign.guidelines.dos && campaign.guidelines.dos.length > 0 ? (
                      <ul className="space-y-2">
                        {campaign.guidelines.dos.map((doItem, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-600 mr-2">•</span>
                            <span className="text-gray-700">{doItem}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific do's provided.</p>
                    )}
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium flex items-center mb-3 text-red-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-red-500 mr-2">✕</span>
                      Don'ts
                    </h4>
                    {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 ? (
                      <ul className="space-y-2">
                        {campaign.guidelines.donts.map((dontItem, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-600 mr-2">•</span>
                            <span className="text-gray-700">{dontItem}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific don'ts provided.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Important Dates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">End Date</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {campaign.type === "retainer" && campaign.applicationDeadline && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Application Deadline</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(campaign.applicationDeadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {campaign.type === "challenge" && campaign.submissionDeadline && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <div className="font-medium">Submission Deadline</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(campaign.submissionDeadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Campaign specific details based on type */}
              {campaign.type === "retainer" && campaign.deliverables && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Deliverables</h3>
                  <div className="bg-muted/50 rounded-md p-4">
                    {campaign.deliverables.mode === "totalVideos" ? (
                      <p>{campaign.deliverables.totalVideos} total videos</p>
                    ) : (
                      <p>
                        {campaign.deliverables.videosPerDay} videos per day for {campaign.deliverables.durationDays} days
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {campaign.type === "payPerView" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
                  <div className="bg-muted/50 rounded-md p-4">
                    <p>
                      <strong>Rate per 1,000 views:</strong> ${campaign.ratePerThousand}
                    </p>
                    <p className="mt-1">
                      <strong>Maximum payout per submission:</strong> ${campaign.maxPayoutPerSubmission}
                    </p>
                  </div>
                </div>
              )}
              
              {campaign.type === "challenge" && campaign.prizePool && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prize Pool</h3>
                  <div className="bg-muted/50 rounded-md p-4 space-y-2">
                    {campaign.prizePool.places.map((place, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="font-medium">
                          {place.position === 1 ? "1st" : 
                           place.position === 2 ? "2nd" : 
                           place.position === 3 ? "3rd" : 
                           `${place.position}th`} Place
                        </span>
                        <span>${place.prize.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Status</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMetrics()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Creators & Applications */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Creators & Applications</h3>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <CardHeader className="pb-0 border-b">
            <TabsList>
              <TabsTrigger value="active-creators">Active Creators</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent className="pt-6">
            <TabsContent value="active-creators" className="mt-0">
              {mockCreators.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Submissions</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCreators.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{creator.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {creator.platforms.map(platform => (
                                <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                                  <SocialIcon platform={platform} />
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{creator.submissions}</TableCell>
                          <TableCell>{creator.views.toLocaleString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">View Profile</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No active creators yet</p>
                  <Button variant="outline">Invite Creators</Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="applications" className="mt-0">
              {mockApplications.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Creator</TableHead>
                        <TableHead>Platforms</TableHead>
                        <TableHead>Followers</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockApplications.map((creator) => (
                        <TableRow key={creator.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={creator.avatar} alt={creator.name} />
                                <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{creator.name}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {creator.platforms.map(platform => (
                                <div key={platform} className="bg-secondary/50 p-1 rounded-full">
                                  <SocialIcon platform={platform} />
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{creator.followers.toLocaleString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="outline" size="sm">Review</Button>
                            <Button variant="ghost" size="sm">Approve</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Button variant="outline">Share Campaign</Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
      
      {/* Submissions Section */}
      <div className="mt-8 mb-6">
        <h3 className="text-xl font-semibold mb-4">Content Submissions</h3>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {mockSubmissions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={submission.avatar} alt={submission.creator} />
                            <AvatarFallback>{submission.creator.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{submission.creator}</div>
                        </div>
                      </TableCell>
                      <TableCell>{submission.title}</TableCell>
                      <TableCell>
                        <div className="bg-secondary/50 p-1 rounded-full w-fit">
                          <SocialIcon platform={submission.platform} />
                        </div>
                      </TableCell>
                      <TableCell>{submission.views.toLocaleString()}</TableCell>
                      <TableCell>{new Date(submission.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.status === 'approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">No submissions yet</p>
              <Button variant="outline">Remind Creators</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
