
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, Campaign } from "@/lib/campaign-types";
import { Submission } from "@/lib/campaign-types";
import { DollarSign, Eye, Users, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";

interface CampaignStatsProps {
  campaign: Campaign;
  submissions: Submission[];
}

export default function CampaignStats({ campaign, submissions }: CampaignStatsProps) {
  const stats = useMemo(() => {
    // Filter submissions for this campaign
    const campaignSubmissions = submissions.filter(s => s.campaign_id === campaign.id);
    
    // Calculate budget claimed (from paid, pending & approved videos)
    const budgetClaimed = campaignSubmissions
      .filter(s => s.status === 'paid' || s.status === 'pending' || s.status === 'approved')
      .reduce((sum, s) => sum + s.payment_amount, 0);
    
    // Get submission counts
    const approvedSubmissions = campaignSubmissions.filter(s => s.status === 'approved' || s.status === 'paid');
    const deniedSubmissions = campaignSubmissions.filter(s => s.status === 'denied');
    const pendingSubmissions = campaignSubmissions.filter(s => s.status === 'pending');
    
    // Calculate total views
    const totalViews = campaignSubmissions.reduce((sum, s) => sum + s.views, 0);
    
    // Calculate views excluding denied submissions
    const validViews = campaignSubmissions
      .filter(s => s.status !== 'denied')
      .reduce((sum, s) => sum + s.views, 0);
    
    // Calculate CPM (Cost Per Mille)
    const cpm = totalViews > 0 ? (budgetClaimed / totalViews) * 1000 : 0;
    
    // Calculate Effective CPM (excluding denied submission views)
    const effectiveCpm = validViews > 0 ? (budgetClaimed / validViews) * 1000 : 0;
    
    // Count unique creators
    const uniqueCreators = new Set(campaignSubmissions.map(s => s.creator_id)).size;
    
    return {
      totalBudget: campaign.totalBudget,
      budgetClaimed,
      cpm,
      effectiveCpm,
      totalSubmissions: campaignSubmissions.length,
      approvedCount: approvedSubmissions.length,
      deniedCount: deniedSubmissions.length,
      pendingCount: pendingSubmissions.length,
      totalViews,
      validViews,
      uniqueCreators
    };
  }, [campaign, submissions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalBudget, campaign.currency)}
          </div>
          <p className="text-xs text-muted-foreground">Campaign budget</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Budget Claimed</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.budgetClaimed, campaign.currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            {((stats.budgetClaimed / stats.totalBudget) * 100).toFixed(1)}% of total budget
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CPM</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.cpm.toFixed(4)}
          </div>
          <p className="text-xs text-muted-foreground">Cost per 1000 views</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Effective CPM</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stats.effectiveCpm.toFixed(4)}
          </div>
          <p className="text-xs text-muted-foreground">Excluding denied views</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Submissions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>{stats.approvedCount} Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <XCircle className="h-3 w-3 text-red-500" />
              <span>{stats.deniedCount} Denied</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingCount}</div>
          <p className="text-xs text-muted-foreground">Awaiting review</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {stats.validViews.toLocaleString()} valid views
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Creators</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.uniqueCreators}</div>
          <p className="text-xs text-muted-foreground">Joined campaign</p>
        </CardContent>
      </Card>
    </div>
  );
}
