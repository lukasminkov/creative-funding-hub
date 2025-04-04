
import { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { DollarSign, Eye, TrendingUp } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Campaign } from "@/lib/campaign-types";
import { useQuery } from "@tanstack/react-query";

type AnalyticsData = {
  date: string;
  views: number;
  cpm: number;
  spent: number;
};

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
  trendValue?: string;
};

// Mock data generator function
const generateAnalyticsData = (campaignId?: string) => {
  // Generate 30 days of data
  const data: AnalyticsData[] = [];
  const now = new Date();
  let viewsBase = campaignId ? 100 : 500; // Lower for individual campaigns
  let cpmBase = campaignId ? 8 : 6; // Higher for individual campaigns
  let spentBase = viewsBase * cpmBase / 1000;
  
  // Add some randomness based on campaign ID if present
  if (campaignId) {
    const campaignNum = parseInt(campaignId.replace(/\D/g, ''), 10) || 0;
    viewsBase += campaignNum * 20;
    cpmBase += (campaignNum % 3);
  }
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    // Add some daily variation
    const variation = Math.sin(i * 0.3) * 0.4 + 1; // Oscillates between 0.6 and 1.4
    const dayOfWeek = date.getDay();
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.3 : 1;
    
    const views = Math.round(viewsBase * variation * weekendMultiplier);
    const cpm = +(cpmBase * (1 + (Math.random() * 0.4 - 0.2))).toFixed(2); // CPM varies by ±20%
    const spent = +(views * cpm / 1000).toFixed(2);
    
    data.push({
      date: date.toISOString().split('T')[0],
      views,
      cpm,
      spent
    });
    
    // Slight upward trend as we approach current day
    viewsBase *= 1.03;
    if (i < 15) cpmBase *= 0.99; // CPM decreases slightly in recent days
  }
  
  return data;
};

const StatCard = ({ title, value, description, icon, trend, trendValue }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-4 w-4 text-muted-foreground">{icon}</div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`mt-2 flex items-center text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp className="mr-1 h-3 w-3" />
          <span>{trendValue} compared to last month</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function CampaignAnalytics() {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      const storedCampaigns = localStorage.getItem("campaigns");
      return storedCampaigns ? JSON.parse(storedCampaigns) : [];
    }
  });
  
  useEffect(() => {
    // Generate analytics data based on selection
    setAnalyticsData(generateAnalyticsData(selectedCampaignId === "all" ? undefined : selectedCampaignId));
  }, [selectedCampaignId]);
  
  // Calculate summary statistics
  const totalViews = analyticsData.reduce((sum, day) => sum + day.views, 0);
  const avgCPM = analyticsData.reduce((sum, day) => sum + day.cpm, 0) / analyticsData.length;
  const totalSpent = analyticsData.reduce((sum, day) => sum + day.spent, 0);
  
  // Only include last 14 days for the chart to avoid crowding
  const recentData = analyticsData.slice(-14);
  
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Campaign Analytics</h3>
        <div className="w-[200px]">
          <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
            <SelectTrigger>
              <SelectValue placeholder="Select Campaign" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Campaigns</SelectItem>
              {campaigns.map((campaign: Campaign) => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title="Total Views" 
          value={totalViews.toLocaleString()} 
          description="Last 30 days" 
          icon={<Eye className="h-4 w-4" />}
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard 
          title="Average CPM" 
          value={`$${avgCPM.toFixed(2)}`} 
          description="Cost per thousand views" 
          icon={<TrendingUp className="h-4 w-4" />}
          trend="down"
          trendValue="-3.2%"
        />
        <StatCard 
          title="Total Spent" 
          value={`$${totalSpent.toFixed(2)}`} 
          description="Last 30 days" 
          icon={<DollarSign className="h-4 w-4" />}
          trend="up"
          trendValue="+8.7%"
        />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer 
                config={{
                  views: { theme: { light: '#0ea5e9', dark: '#0ea5e9' } }
                }}
              >
                <AreaChart data={recentData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => 
                      active && payload?.length ? (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          formatter={(value) => {
                            if (typeof value === 'number') {
                              return [`${value.toLocaleString()} views`, 'Views'];
                            }
                            return [`${value} views`, 'Views'];
                          }}
                        />
                      ) : null
                    } 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#0ea5e9" 
                    fillOpacity={1} 
                    fill="url(#colorViews)" 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ChartContainer
                config={{
                  spent: { theme: { light: '#16a34a', dark: '#16a34a' } }
                }}
              >
                <BarChart data={recentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => 
                      active && payload?.length ? (
                        <ChartTooltipContent 
                          active={active}
                          payload={payload}
                          formatter={(value) => {
                            if (typeof value === 'number') {
                              return [`$${value.toFixed(2)}`, 'Spent'];
                            }
                            return [`$${value}`, 'Spent'];
                          }}
                        />
                      ) : null
                    } 
                  />
                  <Bar dataKey="spent" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
