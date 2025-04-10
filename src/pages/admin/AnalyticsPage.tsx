
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, LineChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { 
  TrendingUp, Users, Building2, DollarSign, Calendar, 
  Download, ArrowUpCircle, ArrowDownCircle, PercentCircle,
  Activity, ArrowRight
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState("30d");
  
  // Mock MAU data
  const mauData = [
    { month: 'Jan', users: 3200, creators: 2100, brands: 1100 },
    { month: 'Feb', users: 3400, creators: 2300, brands: 1100 },
    { month: 'Mar', users: 3800, creators: 2500, brands: 1300 },
    { month: 'Apr', users: 4200, creators: 2800, brands: 1400 },
    { month: 'May', users: 4600, creators: 3100, brands: 1500 },
    { month: 'Jun', users: 4900, creators: 3300, brands: 1600 },
    { month: 'Jul', users: 5100, creators: 3400, brands: 1700 },
    { month: 'Aug', users: 5600, creators: 3800, brands: 1800 },
  ];
  
  // Mock revenue data
  const revenueData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 48000 },
    { month: 'Mar', revenue: 55000 },
    { month: 'Apr', revenue: 64000 },
    { month: 'May', revenue: 72000 },
    { month: 'Jun', revenue: 80000 },
    { month: 'Jul', revenue: 88000 },
    { month: 'Aug', revenue: 96000 },
  ];
  
  // Mock campaign performance data
  const campaignPerformance = [
    { name: 'Retainer', value: 45 },
    { name: 'Pay Per View', value: 35 },
    { name: 'Challenge', value: 20 },
  ];
  
  // Mock user activity data
  const userActivity = [
    { day: 'Mon', logins: 350, submissions: 120 },
    { day: 'Tue', logins: 320, submissions: 100 },
    { day: 'Wed', logins: 380, submissions: 130 },
    { day: 'Thu', logins: 420, submissions: 140 },
    { day: 'Fri', logins: 450, submissions: 160 },
    { day: 'Sat', logins: 280, submissions: 90 },
    { day: 'Sun', logins: 220, submissions: 70 },
  ];
  
  // Mock platform distribution data
  const platformData = [
    { name: 'TikTok', value: 48 },
    { name: 'Instagram', value: 32 },
    { name: 'YouTube', value: 18 },
    { name: 'Twitter', value: 2 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AB47BC', '#FF7043'];
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform performance and user metrics</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[160px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">5,600</div>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              <span>+8.9% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">1,800</div>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              <span>+5.9% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{formatCurrency(96000)}</div>
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <ArrowUpCircle className="h-3 w-3 mr-1" />
              <span>+9.1% from last month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <PercentCircle className="h-5 w-5 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">24.8%</div>
            </div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <ArrowDownCircle className="h-3 w-3 mr-1" />
              <span>-1.2% from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trends</CardTitle>
            <CardDescription>Monthly active users (MAU) over time</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="creators">Creators</TabsTrigger>
                <TabsTrigger value="brands">Brands</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mauData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} users`, 'MAU']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="creators" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mauData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} creators`, 'Creators']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="creators" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="brands" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mauData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} brands`, 'Brands']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="brands" 
                      stroke="#ffc658" 
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Monthly platform revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#8884d8" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Daily User Activity</CardTitle>
            <CardDescription>User logins and content submissions</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="logins" fill="#8884d8" name="Daily Logins" />
                <Bar dataKey="submissions" fill="#82ca9d" name="Content Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Campaign Distribution</CardTitle>
            <CardDescription>Breakdown by campaign type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[350px]">
              <div className="h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaignPerformance}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => 
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {campaignPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col justify-center">
                <h4 className="text-base font-medium mb-4">Distribution by Type</h4>
                <div className="space-y-4">
                  {campaignPerformance.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
                
                <Button variant="link" className="mt-4 px-0 justify-start">
                  View detailed report
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Distribution</CardTitle>
          <CardDescription>Campaign performance by social media platform</CardDescription>
        </CardHeader>
        <CardContent className="h-[350px]">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            <div className="lg:col-span-1 flex flex-col justify-center">
              <h4 className="text-base font-medium mb-4">Top Platforms</h4>
              <div className="space-y-5">
                {platformData.map((platform, index) => (
                  <div key={platform.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div 
                          className="h-3 w-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{platform.name}</span>
                      </div>
                      <span className="font-medium">{platform.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${platform.value}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Percentage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for percent circle icon
const PercentCircle = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m8 16 8-8" />
    <path d="M9 9h.01" />
    <path d="M15 15h.01" />
  </svg>
);
