
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, Layers, CreditCard, TrendingUp, Bookmark } from "lucide-react";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 376,
    totalBrands: 42,
    totalCampaigns: 156,
    totalPayments: "$285,432",
    activeCampaigns: 78,
    pendingApprovals: 24
  });
  
  const campaignData = [
    { name: 'Jan', count: 12 },
    { name: 'Feb', count: 19 },
    { name: 'Mar', count: 15 },
    { name: 'Apr', count: 21 },
    { name: 'May', count: 25 },
    { name: 'Jun', count: 18 },
    { name: 'Jul', count: 22 },
    { name: 'Aug', count: 28 },
  ];
  
  const platformData = [
    { name: 'TikTok', value: 48 },
    { name: 'Instagram', value: 32 },
    { name: 'YouTube', value: 18 },
    { name: 'Twitter', value: 2 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.totalBrands}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Layers className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.totalPayments}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bookmark className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Campaigns by Month</CardTitle>
            <CardDescription>Number of campaigns created each month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
            <CardDescription>Campaign distribution by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New campaign created", user: "Brand X", time: "5 minutes ago" },
                { action: "User payment processed", user: "Creator Y", time: "1 hour ago" },
                { action: "New creator sign-up", user: "John Doe", time: "2 hours ago" },
                { action: "Campaign approved", user: "Admin Z", time: "3 hours ago" },
                { action: "Submission reviewed", user: "Moderator A", time: "5 hours ago" }
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">By {activity.user}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
