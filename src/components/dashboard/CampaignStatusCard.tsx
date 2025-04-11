import { useMemo } from "react";
import { Campaign, formatCurrency, getDaysLeft } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, X, Calendar, DollarSign, Clock, Percent, BadgePercent, BadgeDollarSign, Info, Flag } from "lucide-react";

interface CampaignStatusCardProps {
  campaign: Campaign;
  onAddBudget?: () => void;
}

export default function CampaignStatusCard({ campaign, onAddBudget }: CampaignStatusCardProps) {
  const statusInfo = useMemo(() => {
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
        progress = 40;
      }
      const totalVideos = campaign.deliverables?.totalVideos || 10;
      progressText = `${Math.round(totalVideos * (progress / 100))}/${totalVideos} deliverables`;
    } else if (campaign.type === "payPerView") {
      progress = status === "Ended" ? 100 : 30;
      progressText = `$${(campaign.totalBudget * (progress / 100)).toFixed(2)}/$${campaign.totalBudget} spent`;
    } else if (campaign.type === "challenge") {
      const submitDeadline = new Date(campaign.submissionDeadline);
      if (submitDeadline < now) {
        status = "Judging";
        statusColor = "bg-yellow-100 text-yellow-800";
        progress = 100;
      } else {
        const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        const total = submitDeadline.getTime() - startDate.getTime();
        const elapsed = now.getTime() - startDate.getTime();
        progress = Math.min(100, Math.floor((elapsed / total) * 100));
      }
      progressText = `${Math.round(progress)}% complete`;
    }
    
    const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    const remainingBudget = campaign.type === "payPerView" 
      ? campaign.totalBudget - (campaign.totalBudget * (progress / 100)) 
      : campaign.totalBudget;
    
    const views = Math.floor(Math.random() * 50000) + 10000;
    const submissions = Math.floor(Math.random() * 10) + 5;
    const cpm = Number(((campaign.totalBudget * 0.3) / (views / 1000)).toFixed(4));
    const approvalRate = Math.floor(Math.random() * 10) + 90; // 90-100%
    
    return {
      status,
      statusColor,
      progress,
      progressText,
      daysRemaining,
      remainingBudget,
      views,
      submissions,
      cpm,
      approvalRate
    };
  }, [campaign]);

  const renderBanner = () => {
    if (!campaign.bannerImage) return null;
    
    return (
      <div className="h-40 relative rounded-t-lg overflow-hidden">
        <img 
          src={campaign.bannerImage} 
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <h2 className="text-xl font-medium text-white">{campaign.title}</h2>
          <p className="text-white/80 text-sm">
            {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
          </p>
        </div>
      </div>
    );
  };

  const renderGuidelines = () => {
    if (!campaign.guidelines || (!campaign.guidelines.dos?.length && !campaign.guidelines.donts?.length)) {
      return null;
    }
    
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Guidelines</h3>
        
        <div className="space-y-2">
          {campaign.guidelines.dos && campaign.guidelines.dos.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-medium text-green-800 flex items-center mb-1">
                <Check className="h-3 w-3 mr-1" /> Do's
              </p>
              <ul className="space-y-1">
                {campaign.guidelines.dos.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-xs text-gray-700 flex">
                    <span className="text-green-500 mr-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
                {campaign.guidelines.dos.length > 3 && (
                  <li className="text-xs text-gray-500 italic">+ {campaign.guidelines.dos.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
          
          {campaign.guidelines.donts && campaign.guidelines.donts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800 flex items-center mb-1">
                <X className="h-3 w-3 mr-1" /> Don'ts
              </p>
              <ul className="space-y-1">
                {campaign.guidelines.donts.slice(0, 3).map((item, index) => (
                  <li key={index} className="text-xs text-gray-700 flex">
                    <span className="text-red-500 mr-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
                {campaign.guidelines.donts.length > 3 && (
                  <li className="text-xs text-gray-500 italic">+ {campaign.guidelines.donts.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPayPerViewInfo = () => {
    if (campaign.type !== "payPerView") return null;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5 mr-1 opacity-70" /> Cost Per View
            </div>
            <div className="font-medium">
              ${campaign.ratePerThousand?.toFixed(4) || statusInfo.cpm.toFixed(4)} <span className="text-xs text-muted-foreground">/ 1000 views</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <BadgeDollarSign className="h-3.5 w-3.5 mr-1 opacity-70" /> Remaining Budget
            </div>
            <div className="font-medium">
              {formatCurrency(statusInfo.remainingBudget, campaign.currency)}
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <BadgePercent className="h-3.5 w-3.5 mr-1 opacity-70" /> Max Payout per Submission
          </div>
          <div className="font-medium">
            {formatCurrency(campaign.maxPayoutPerSubmission || 0, campaign.currency)}
          </div>
        </div>
        
        <div className="mt-4">
          <Button variant="outline" className="w-full text-sm" onClick={onAddBudget}>
            <DollarSign className="h-4 w-4 mr-1" /> Add Budget
          </Button>
        </div>
      </>
    );
  };

  const renderRetainerInfo = () => {
    if (campaign.type !== "retainer") return null;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1 opacity-70" /> Days Remaining
            </div>
            <div className="font-medium">
              {statusInfo.daysRemaining}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Flag className="h-3.5 w-3.5 mr-1 opacity-70" /> Approval Rate
            </div>
            <div className="font-medium">
              {statusInfo.approvalRate}%
            </div>
          </div>
        </div>
        
        {campaign.deliverables && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5 mr-1 opacity-70" /> Deliverables
            </div>
            <div className="font-medium text-sm">
              {campaign.deliverables.mode === "videosPerDay" 
                ? `${campaign.deliverables.videosPerDay} videos per day for ${campaign.deliverables.durationDays} days`
                : `${campaign.deliverables.totalVideos} total videos`}
            </div>
          </div>
        )}
        
        {campaign.creatorTiers && campaign.creatorTiers.length > 0 && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <BadgeDollarSign className="h-3.5 w-3.5 mr-1 opacity-70" /> Creator Tiers
            </div>
            <div className="space-y-1 mt-1">
              {campaign.creatorTiers.slice(0, 2).map((tier, index) => (
                <div key={index} className="flex justify-between items-center py-1 px-2 bg-muted/50 rounded text-xs">
                  <span>{tier.name}</span>
                  <span className="font-medium">{formatCurrency(tier.price, campaign.currency)}</span>
                </div>
              ))}
              {campaign.creatorTiers.length > 2 && (
                <div className="text-xs text-muted-foreground">+ {campaign.creatorTiers.length - 2} more tiers</div>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderChallengeInfo = () => {
    if (campaign.type !== "challenge") return null;
    
    return (
      <>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" /> Submissions
            </div>
            <div className="font-medium">
              {statusInfo.submissions}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5 mr-1 opacity-70" /> Days Remaining
            </div>
            <div className="font-medium">
              {statusInfo.daysRemaining}
            </div>
          </div>
        </div>
        
        {campaign.prizePool && campaign.prizePool.places && (
          <div className="mt-4 space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <BadgeDollarSign className="h-3.5 w-3.5 mr-1 opacity-70" /> Prize Pool
            </div>
            <div className="space-y-1 mt-1">
              {campaign.prizePool.places.slice(0, 2).map((place) => (
                <div key={place.position} className="flex justify-between items-center py-1 px-2 bg-muted/50 rounded text-xs">
                  <span>{place.position}{getOrdinal(place.position)} Place</span>
                  <span className="font-medium">{formatCurrency(place.prize, campaign.currency)}</span>
                </div>
              ))}
              {campaign.prizePool.places.length > 2 && (
                <div className="text-xs text-muted-foreground">+ {campaign.prizePool.places.length - 2} more prizes</div>
              )}
            </div>
          </div>
        )}
        
        {statusInfo.status === "Judging" && (
          <div className="mt-4">
            <Button variant="outline" className="w-full text-sm">View Submissions for Judging</Button>
          </div>
        )}
      </>
    );
  };

  function getOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  }

  return (
    <Card className="overflow-hidden">
      {renderBanner()}
      <CardHeader className={campaign.bannerImage ? "pt-3" : undefined}>
        <div className="flex justify-between items-center">
          <CardTitle>Campaign Status</CardTitle>
          <span className={`text-xs py-1 px-2 rounded-full ${statusInfo.statusColor}`}>
            {statusInfo.status}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <div className="flex justify-between mb-1 text-sm">
            <span>{statusInfo.progressText}</span>
          </div>
          <Progress value={statusInfo.progress} className="h-3" />
        </div>
        
        <div className="space-y-5">
          {renderPayPerViewInfo()}
          {renderRetainerInfo()}
          {renderChallengeInfo()}
          
          <Separator className="my-4" />
          
          {renderGuidelines()}
        </div>
      </CardContent>
    </Card>
  );
}
