
import { useCampaigns } from "@/hooks/useCampaigns";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingUp, Users, DollarSign, Eye } from "lucide-react";
import CampaignSummaryCard from "@/components/dashboard/CampaignSummaryCard";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/campaign-types";

export default function DashboardHome() {
  const { data: campaigns = [], isLoading: campaignsLoading } = useCampaigns();
  const { data: submissions = [], isLoading: submissionsLoading } = useSubmissions();

  // Calculate dashboard metrics
  const totalBudget = campaigns.reduce((sum, campaign) => sum + campaign.totalBudget, 0);
  const activeCampaigns = campaigns.filter(c => new Date(c.endDate) > new Date()).length;
  const totalViews = submissions.reduce((sum, submission) => sum + submission.views, 0);
  const approvedSubmissions = submissions.filter(s => s.status === "approved").length;

  // Get recent campaigns (limit to 3)
  const recentCampaigns = campaigns.slice(0, 3);

  if (campaignsLoading || submissionsLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your campaigns.</p>
        </div>
        
        <Link to="/dashboard/campaigns">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget, "USD")}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Content</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedSubmissions}</div>
            <p className="text-xs text-muted-foreground">Submissions approved</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Campaigns</h2>
          <Link to="/dashboard/campaigns">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>

        {recentCampaigns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No campaigns yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first campaign to get started with influencer marketing
              </p>
              <Link to="/dashboard/campaigns">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Campaign
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCampaigns.map((campaign) => (
              <CampaignSummaryCard
                key={campaign.id}
                campaign={campaign}
                showActions={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
