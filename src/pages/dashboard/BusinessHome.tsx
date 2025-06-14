
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, DollarSign, TrendingUp, Eye, MessageSquare } from "lucide-react";

export default function BusinessHome() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$12,345",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Active Campaigns",
      value: "8",
      change: "+2",
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Community Members",
      value: "1,234",
      change: "+89",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Total Views",
      value: "45.2K",
      change: "+18.2%",
      icon: Eye,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Dashboard</h1>
          <p className="text-muted-foreground">Manage your campaigns and grow your business</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          Business Account
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>{stat.change}</p>
                </div>
                <div className={`h-12 w-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Fashion Brand Retainer</p>
                  <p className="text-sm text-muted-foreground">Active • 24 submissions</p>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Performing Well
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Tech Product Launch</p>
                  <p className="text-sm text-muted-foreground">Active • 12 submissions</p>
                </div>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  On Track
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">VIP Creator Circle</p>
                  <p className="text-sm text-muted-foreground">24 members • 8 new messages</p>
                </div>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Brand Ambassadors</p>
                  <p className="text-sm text-muted-foreground">156 members • 23 new messages</p>
                </div>
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
