
import { useMemo } from "react";
import { Campaign } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/campaign-types";

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
    
    // Calculate days remaining
    const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Calculate remaining budget for pay-per-view
    const remainingBudget = campaign.type === "payPerView" 
      ? campaign.totalBudget - (campaign.totalBudget * (progress / 100)) 
      : campaign.totalBudget;
    
    // Calculate random metrics for visual display
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <div className="flex justify-between mb-1 text-sm">
            <span>{statusInfo.progressText}</span>
            <span className={`text-xs py-1 px-2 rounded-full ${statusInfo.statusColor}`}>
              {statusInfo.status}
            </span>
          </div>
          <Progress value={statusInfo.progress} className="h-3" />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {campaign.type === "payPerView" && (
            <>
              <div>
                <div className="text-sm text-muted-foreground">Cost Per View</div>
                <div className="text-lg font-semibold">
                  ${statusInfo.cpm.toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Remaining Budget</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(statusInfo.remainingBudget, campaign.currency)}
                </div>
              </div>
              <div className="md:col-span-2">
                <Button variant="outline" className="w-full" onClick={onAddBudget}>
                  Add Budget
                </Button>
              </div>
            </>
          )}
          
          {campaign.type === "retainer" && (
            <>
              <div>
                <div className="text-sm text-muted-foreground">Days Remaining</div>
                <div className="text-lg font-semibold">
                  {statusInfo.daysRemaining}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Approval Rate</div>
                <div className="text-lg font-semibold">
                  {statusInfo.approvalRate}%
                </div>
              </div>
            </>
          )}
          
          {campaign.type === "challenge" && (
            <>
              <div>
                <div className="text-sm text-muted-foreground">Submissions</div>
                <div className="text-lg font-semibold">
                  {statusInfo.submissions}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Days Remaining</div>
                <div className="text-lg font-semibold">
                  {statusInfo.daysRemaining}
                </div>
              </div>
              
              {statusInfo.status === "Judging" && (
                <div className="md:col-span-2">
                  <Button variant="outline" className="w-full">View Submissions for Judging</Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
