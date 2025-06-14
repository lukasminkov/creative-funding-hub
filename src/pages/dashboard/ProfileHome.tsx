
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Clock, Star, Play, Users } from "lucide-react";

export default function ProfileHome() {
  const earnings = {
    thisMonth: 2450,
    lastMonth: 1890,
    pending: 320,
    total: 8750
  };

  const activeCampaigns = [
    {
      title: "Fashion Brand Retainer",
      brand: "StyleCorp",
      earnings: 850,
      progress: 75,
      deadline: "Dec 28",
      status: "active"
    },
    {
      title: "Tech Product Review",
      brand: "TechFlow",
      earnings: 500,
      progress: 45,
      deadline: "Jan 5",
      status: "active"
    }
  ];

  const completedCampaigns = [
    {
      title: "Holiday Campaign",
      brand: "GiftBox",
      earnings: 1200,
      rating: 4.8,
      completedAt: "Dec 15"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">Track your earnings and manage your creative work</p>
        </div>
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          Creator Profile
        </Badge>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">${earnings.thisMonth}</p>
                <p className="text-sm text-green-600">+{Math.round(((earnings.thisMonth - earnings.lastMonth) / earnings.lastMonth) * 100)}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">${earnings.pending}</p>
                <p className="text-sm text-orange-600">2 campaigns</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Earned</p>
                <p className="text-2xl font-bold">${earnings.total}</p>
                <p className="text-sm text-blue-600">All time</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-yellow-600">Excellent</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeCampaigns.map((campaign, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{campaign.title}</h3>
                    <p className="text-sm text-muted-foreground">by {campaign.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">${campaign.earnings}</p>
                    <p className="text-sm text-muted-foreground">Due {campaign.deadline}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{campaign.progress}%</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Completions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recent Completions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-medium">{campaign.title}</h3>
                  <p className="text-sm text-muted-foreground">by {campaign.brand} • Completed {campaign.completedAt}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">${campaign.earnings}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{campaign.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
