
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Eye, DollarSign, FileText, TrendingUp, Plus, ArrowRight, Crown, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/campaign-types";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: campaigns = [] } = useCampaigns();
  
  // Mock submissions data - in real app this would come from useSubmissions hook
  const { data: submissions = [] } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => {
      const storedSubmissions = localStorage.getItem("submissions");
      try {
        return storedSubmissions ? JSON.parse(storedSubmissions) : [];
      } catch (e) {
        return [];
      }
    }
  });

  useEffect(() => {
    console.log('DashboardHome mounting');
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate analytics
  const totalViews = submissions.reduce((sum: number, s: any) => sum + (s.views || 0), 0);
  const totalSpend = submissions.reduce((sum: number, s: any) => sum + (s.payment_amount || 0), 0);
  const totalSubmissions = submissions.length;
  const uniqueCreators = new Set(submissions.map((s: any) => s.creator_id)).size;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.totalBudget, 0);
  const budgetSpent = (totalSpend / totalBudget) * 100;

  // Top creators data
  const creatorStats = submissions.reduce((acc: any, submission: any) => {
    const creatorId = submission.creator_id;
    if (!acc[creatorId]) {
      acc[creatorId] = {
        id: creatorId,
        name: submission.creator_name,
        avatar: submission.creator_avatar,
        totalViews: 0,
        totalEarnings: 0,
        submissionCount: 0
      };
    }
    acc[creatorId].totalViews += submission.views || 0;
    acc[creatorId].totalEarnings += submission.payment_amount || 0;
    acc[creatorId].submissionCount += 1;
    return acc;
  }, {});

  const topCreators = Object.values(creatorStats)
    .sort((a: any, b: any) => b.totalViews - a.totalViews)
    .slice(0, 5);

  // Campaign distribution by category
  const campaignDistribution = campaigns.reduce((acc: any, campaign) => {
    const category = campaign.category;
    if (!acc[category]) {
      acc[category] = { name: category, value: 0, campaigns: 0 };
    }
    acc[category].value += campaign.totalBudget;
    acc[category].campaigns += 1;
    return acc;
  }, {});

  const distributionData = Object.values(campaignDistribution);
  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-muted-foreground">
            Track your campaign performance and creator engagement
          </p>
        </div>
        <Link to="/dashboard/campaigns">
          <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </Link>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 dark:from-blue-950/50 dark:to-blue-900/30 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Views</CardTitle>
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {totalViews.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 dark:from-green-950/50 dark:to-green-900/30 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Spend</CardTitle>
            <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              ${totalSpend.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400">
              Creator payments
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 dark:from-purple-950/50 dark:to-purple-900/30 dark:border-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Submissions</CardTitle>
            <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {totalSubmissions}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400">
              Content submissions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200 dark:from-orange-950/50 dark:to-orange-900/30 dark:border-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Creators</CardTitle>
            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {uniqueCreators}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              Active creators
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100/50 border-teal-200 dark:from-teal-950/50 dark:to-teal-900/30 dark:border-teal-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-teal-700 dark:text-teal-300">Budget Spent</CardTitle>
            <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-900 dark:text-teal-100">
              {budgetSpent.toFixed(1)}%
            </div>
            <p className="text-xs text-teal-600 dark:text-teal-400">
              Of total budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Distribution & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Campaign Distribution by Category
              </CardTitle>
              <CardDescription>
                Budget allocation across different campaign categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {distributionData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Budget']} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {distributionData.map((item: any, index) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ${item.value.toLocaleString()} • {item.campaigns} campaigns
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No campaign data available yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <NotificationCenter glass />
        </div>
      </div>

      {/* Top Creators Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Top Performing Creators
          </CardTitle>
          <CardDescription>
            Creators with the highest engagement and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topCreators.length > 0 ? (
            <div className="space-y-4">
              {topCreators.map((creator: any, index) => (
                <div key={creator.id} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-background to-muted/20 border">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} alt={creator.name} />
                        <AvatarFallback>{creator.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{creator.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {creator.submissionCount} submissions
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Views</p>
                      <p className="font-semibold text-blue-600">
                        {creator.totalViews.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Earnings</p>
                      <p className="font-semibold text-green-600">
                        ${creator.totalEarnings.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <Badge variant={index === 0 ? "default" : "secondary"} className="ml-auto">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Link to="/dashboard/creators">
                  <Button variant="outline" className="w-full">
                    View All Creators
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No creator data available yet</p>
              <p className="text-sm">Start a campaign to see top performers here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
