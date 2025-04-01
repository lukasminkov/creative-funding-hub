
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Sector, Tooltip, XAxis, YAxis } from "recharts";

// Mock data for charts
const viewsData = [
  { name: 'Jan', value: 12500 },
  { name: 'Feb', value: 18600 },
  { name: 'Mar', value: 15400 },
  { name: 'Apr', value: 22000 },
  { name: 'May', value: 19800 },
  { name: 'Jun', value: 25600 },
  { name: 'Jul', value: 32000 },
];

const campaignPerformance = [
  { name: 'Summer UGC', budget: 5000, spent: 4200, views: 125000, submissions: 15 },
  { name: 'Product Review', budget: 3500, spent: 2800, views: 85000, submissions: 8 },
  { name: 'Holiday Challenge', budget: 7500, spent: 6300, views: 180000, submissions: 22 },
  { name: 'Lifestyle Content', budget: 4200, spent: 3500, views: 95000, submissions: 12 },
];

const contentTypeData = [
  { name: 'UGC', value: 45 },
  { name: 'Faceless', value: 30 },
  { name: 'Clipping', value: 25 },
];

const platformData = [
  { name: 'TikTok', value: 42 },
  { name: 'Instagram Reels', value: 28 },
  { name: 'YouTube Shorts', value: 20 },
  { name: 'Twitter', value: 10 },
];

const monthlySpendData = [
  { name: 'Jan', payPerView: 2500, retainer: 3500, challenge: 1500 },
  { name: 'Feb', payPerView: 3200, retainer: 3500, challenge: 2000 },
  { name: 'Mar', payPerView: 2800, retainer: 3500, challenge: 1000 },
  { name: 'Apr', payPerView: 3500, retainer: 4000, challenge: 2500 },
  { name: 'May', payPerView: 4200, retainer: 4000, challenge: 1800 },
  { name: 'Jun', payPerView: 3800, retainer: 4500, challenge: 3000 },
  { name: 'Jul', payPerView: 4500, retainer: 5000, challenge: 2200 },
];

export default function AnalyticsPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Performance insights across all campaigns and creators
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="spend">Spend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Total Views</CardTitle>
                <CardDescription>Across all campaigns</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold mb-2">485,000</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600">↑14%</span> from last month
                </div>
                <div className="h-36 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={viewsData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="colorView" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorView)" />
                      <XAxis dataKey="name" tick={{fontSize: 10}} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Spend</CardTitle>
                <CardDescription>Budget utilization</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-3xl font-bold mb-2">$16,800</div>
                <div className="text-sm text-muted-foreground">
                  <span className="text-green-600">↑8%</span> from last month
                </div>
                <div className="h-36 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={monthlySpendData} 
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <XAxis dataKey="name" tick={{fontSize: 10}} />
                      <Bar dataKey="payPerView" fill="#8884d8" stackId="a" />
                      <Bar dataKey="retainer" fill="#82ca9d" stackId="a" />
                      <Bar dataKey="challenge" fill="#ffc658" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>By type and platform</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-40">
                    <h4 className="text-sm font-medium mb-1">Content Type</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={contentTypeData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={30}
                          outerRadius={50} 
                          fill="#8884d8" 
                          dataKey="value"
                          nameKey="name"
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-40">
                    <h4 className="text-sm font-medium mb-1">Platform</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={platformData} 
                          cx="50%" 
                          cy="50%" 
                          innerRadius={30}
                          outerRadius={50} 
                          fill="#82ca9d" 
                          dataKey="value"
                          nameKey="name"
                        />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Performance metrics for recent campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={campaignPerformance}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="views" fill="#8884d8" name="Views" />
                    <Bar yAxisId="left" dataKey="submissions" fill="#ffc658" name="Submissions" />
                    <Bar yAxisId="right" dataKey="budget" fill="#82ca9d" name="Budget" />
                    <Bar yAxisId="right" dataKey="spent" fill="#ff8042" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="campaigns" className="mt-0">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Metrics</CardTitle>
                <CardDescription>Performance comparison across all campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={campaignPerformance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="budget" stackId="a" fill="#8884d8" name="Budget" />
                      <Bar dataKey="spent" stackId="a" fill="#82ca9d" name="Amount Spent" />
                      <Bar dataKey="views" fill="#ffc658" name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Additional campaign-specific charts would go here */}
          </div>
        </TabsContent>
        
        <TabsContent value="audience" className="mt-0">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Type Distribution</CardTitle>
                <CardDescription>Types of content across campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={contentTypeData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        fill="#8884d8" 
                        dataKey="value"
                        nameKey="name"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
                <CardDescription>Content performance by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={platformData} 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        fill="#82ca9d" 
                        dataKey="value"
                        nameKey="name"
                        label
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="spend" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spend Analysis</CardTitle>
              <CardDescription>Budget allocation and utilization over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlySpendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="payPerView" stroke="#8884d8" name="Pay Per View" />
                    <Line type="monotone" dataKey="retainer" stroke="#82ca9d" name="Retainer" />
                    <Line type="monotone" dataKey="challenge" stroke="#ffc658" name="Challenge" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
