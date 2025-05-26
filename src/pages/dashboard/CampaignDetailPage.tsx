
import { useParams } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/campaign-types";
import { Calendar, MapPin, Users, Eye, DollarSign, ArrowLeft, Trophy, TrendingUp, Target, Clock, Edit, Settings, BarChart3, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import CampaignSubmissions from "@/components/dashboard/CampaignSubmissions";
import CampaignStats from "@/components/dashboard/CampaignStats";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";
import CampaignManagement from "@/components/dashboard/CampaignManagement";
import { toast } from "sonner";
import { useState } from "react";

export default function CampaignDetailPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data: campaigns = [], isLoading: campaignsLoading, refetch: refetchCampaigns } = useCampaigns();
  const { data: submissions = [], isLoading: submissionsLoading } = useSubmissions(campaignId);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const campaign = campaigns.find(c => c.id === campaignId);

  if (campaignsLoading || submissionsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading campaign details...</div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Campaign not found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/dashboard/campaigns">
            <Button>Back to Campaigns</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleApproveSubmission = async (submission: any) => {
    toast.success(`Submission by ${submission.creator_name} approved`);
  };

  const handleDenySubmission = async (submission: any, reason: string) => {
    toast.success(`Submission by ${submission.creator_name} denied`);
  };

  const handleEditCampaign = () => {
    setIsEditDialogOpen(true);
  };

  const handleCampaignUpdated = () => {
    refetchCampaigns();
  };

  const handleAddFunds = () => {
    toast.success("Add funds functionality will be implemented soon!");
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard/campaigns">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{campaign.title}</h1>
          <p className="text-muted-foreground">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={new Date(campaign.endDate) > new Date() ? "default" : "secondary"}>
            {new Date(campaign.endDate) > new Date() ? "Active" : "Ended"}
          </Badge>
          <Button 
            onClick={handleAddFunds}
            className="relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            size="sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite] transform translate-x-[-100%]" />
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button onClick={handleEditCampaign} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Campaign
          </Button>
        </div>
      </div>

      {/* Banner Image */}
      {campaign.bannerImage && (
        <div className="relative h-64 rounded-lg overflow-hidden">
          <img 
            src={campaign.bannerImage} 
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Campaign Overview
          </TabsTrigger>
          <TabsTrigger value="management" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Campaign Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Campaign Statistics */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Campaign Statistics</h2>
            <CampaignStats campaign={campaign} submissions={submissions} />
          </div>

          {/* Campaign Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {campaign.requirements && campaign.requirements.length > 0 && (
                      <div>
                        <h4 className="font-medium text-blue-600 mb-2">Requirements</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {campaign.requirements.map((requirement, index) => (
                            <li key={index} className="text-sm">{requirement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Do's</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {campaign.guidelines.dos?.map((item, index) => (
                            <li key={index} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Don'ts</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {campaign.guidelines.donts?.map((item, index) => (
                            <li key={index} className="text-sm">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Brand</p>
                    <p className="text-sm text-muted-foreground">{campaign.brandName || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Category</p>
                    <p className="text-sm text-muted-foreground">{campaign.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Content Type</p>
                    <p className="text-sm text-muted-foreground">{campaign.contentType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Type</p>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Total Budget</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <p className="text-sm text-muted-foreground">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
                    </div>
                  </div>

                  {/* Campaign Type Specific Information */}
                  {campaign.type === 'payPerView' && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Rate per 1,000 Views</p>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          <p className="text-sm text-muted-foreground">{formatCurrency(campaign.ratePerThousand || 0, campaign.currency)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Max Payout per Submission</p>
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <p className="text-sm text-muted-foreground">{formatCurrency(campaign.maxPayoutPerSubmission || 0, campaign.currency)}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">View Validation Period</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <p className="text-sm text-muted-foreground">{campaign.viewValidationPeriod || 10} days</p>
                        </div>
                      </div>
                    </>
                  )}

                  {campaign.type === 'challenge' && (
                    <>
                      {campaign.prizePool && (
                        <div>
                          <p className="text-sm font-medium">Prize Pool</p>
                          <div className="space-y-1 mt-1">
                            {campaign.prizePool.places?.slice(0, 4).map((place: any) => (
                              <div key={place.position} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-1">
                                  <Trophy className="h-3 w-3" />
                                  <span>{place.position}{getOrdinal(place.position)} Place</span>
                                </div>
                                <span className="font-medium">{formatCurrency(place.prize, campaign.currency)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {campaign.submissionDeadline && (
                        <div>
                          <p className="text-sm font-medium">Submission Deadline</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <p className="text-sm text-muted-foreground">
                              {new Date(campaign.submissionDeadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {campaign.type === 'retainer' && (
                    <>
                      {campaign.creatorTiers && campaign.creatorTiers.length > 0 && (
                        <div>
                          <p className="text-sm font-medium">Creator Tiers</p>
                          <div className="space-y-1 mt-1">
                            {campaign.creatorTiers.map((tier: any, index: number) => (
                              <div key={index} className="flex justify-between text-xs">
                                <span>{tier.name}</span>
                                <span className="font-medium">{formatCurrency(tier.price, campaign.currency)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {campaign.deliverables && (
                        <div>
                          <p className="text-sm font-medium">Deliverables</p>
                          <p className="text-sm text-muted-foreground">
                            {campaign.deliverables.mode === 'videosPerDay' 
                              ? `${campaign.deliverables.videosPerDay} videos/day for ${campaign.deliverables.durationDays} days`
                              : `${campaign.deliverables.totalVideos} total videos`}
                          </p>
                        </div>
                      )}
                      {campaign.applicationDeadline && (
                        <div>
                          <p className="text-sm font-medium">Application Deadline</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <p className="text-sm text-muted-foreground">
                              {new Date(campaign.applicationDeadline).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <p className="text-sm font-medium">End Date</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <p className="text-sm text-muted-foreground">{new Date(campaign.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Platforms</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {campaign.platforms.map(platform => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium">Availability</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <p className="text-sm text-muted-foreground">{campaign.countryAvailability}</p>
                    </div>
                  </div>

                  {campaign.trackingLink && (
                    <div>
                      <p className="text-sm font-medium">Tracking Link</p>
                      <a 
                        href={campaign.trackingLink.startsWith('http') ? campaign.trackingLink : `https://${campaign.trackingLink}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs break-all"
                      >
                        {campaign.trackingLink}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          <CampaignManagement
            campaign={campaign}
            submissions={submissions}
            onApprove={handleApproveSubmission}
            onDeny={handleDenySubmission}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Campaign Dialog */}
      <CampaignFormDialog
        campaign={campaign}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onCampaignUpdated={handleCampaignUpdated}
        isEditing={true}
      />

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}

// Helper function for ordinal numbers
function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (s[(v - 20) % 10] || s[v] || s[0]);
}
