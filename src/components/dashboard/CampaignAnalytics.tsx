
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
import { Button } from "@/components/ui/button";
import { DollarSign, Eye, TrendingUp, Calendar, ChevronDown } from "lucide-react";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { Campaign } from "@/lib/campaign-types";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, startOfWeek, startOfMonth, startOfYear, endOfMonth, subMonths } from "date-fns";

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

type DateRange = {
  from: Date;
  to: Date;
};

type DateRangePreset = 'custom' | 'wtd' | 'mtd' | 'ytd' | 'lastMonth';

// Mock data generator function
const generateAnalyticsData = (campaignId?: string, dateRange?: DateRange) => {
  // Generate 30 days of data by default or use the date range if provided
  const data: AnalyticsData[] = [];
  const now = new Date();
  const endDate = dateRange?.to || now;
  const startDate = dateRange?.from || subDays(now, 29); // Default to last 30 days
  
  // Calculate number of days in the range
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  let viewsBase = campaignId ? 100 : 500; // Lower for individual campaigns
  let cpmBase = campaignId ? 8 : 6; // Higher for individual campaigns
  let spentBase = viewsBase * cpmBase / 1000;
  
  // Add some randomness based on campaign ID if present
  if (campaignId) {
    const campaignNum = parseInt(campaignId.replace(/\D/g, ''), 10) || 0;
    viewsBase += campaignNum * 20;
    cpmBase += (campaignNum % 3);
  }
  
  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
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
    if (i > daysDiff / 2) cpmBase *= 0.99; // CPM decreases slightly in recent days
  }
  
  return data;
};

// Helper function to get date range based on preset
const getDateRangeFromPreset = (preset: DateRangePreset): DateRange => {
  const now = new Date();
  
  switch (preset) {
    case 'wtd': // Week to date
      return {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: now
      };
    case 'mtd': // Month to date
      return {
        from: startOfMonth(now),
        to: now
      };
    case 'ytd': // Year to date
      return {
        from: startOfYear(now),
        to: now
      };
    case 'lastMonth': // Last month
      const lastMonth = subMonths(now, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth)
      };
    case 'custom':
    default:
      // Default to last 30 days
      return {
        from: subDays(now, 29),
        to: now
      };
  }
};

const formatDateRange = (range: DateRange): string => {
  return `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`;
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
  const [selectedDatePreset, setSelectedDatePreset] = useState<DateRangePreset>('mtd');
  const [dateRange, setDateRange] = useState<DateRange>(getDateRangeFromPreset('mtd'));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      const storedCampaigns = localStorage.getItem("campaigns");
      return storedCampaigns ? JSON.parse(storedCampaigns) : [];
    }
  });
  
  useEffect(() => {
    // Generate analytics data based on selection and date range
    setAnalyticsData(generateAnalyticsData(
      selectedCampaignId === "all" ? undefined : selectedCampaignId,
      dateRange
    ));
  }, [selectedCampaignId, dateRange]);
  
  const handleDatePresetChange = (preset: DateRangePreset) => {
    setSelectedDatePreset(preset);
    if (preset !== 'custom') {
      setDateRange(getDateRangeFromPreset(preset));
    }
  };
  
  const handleCalendarSelect = (range: { from: Date; to: Date }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to });
      setSelectedDatePreset('custom');
      setIsCalendarOpen(false);
    }
  };
  
  // Calculate summary statistics
  const totalViews = analyticsData.reduce((sum, day) => sum + day.views, 0);
  const avgCPM = analyticsData.reduce((sum, day) => sum + day.cpm, 0) / analyticsData.length;
  const totalSpent = analyticsData.reduce((sum, day) => sum + day.spent, 0);
  
  // Only include the most recent data points for the charts to avoid overcrowding
  // For shorter date ranges, show all data; for longer ones, limit to most recent 14 days
  const maxDataPoints = dateRange.from && dateRange.to && 
    Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) > 14 
    ? 14 : analyticsData.length;
  
  const chartData = analyticsData.slice(-maxDataPoints);
  
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-lg font-medium">Campaign Analytics</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
            <SelectTrigger className="w-full sm:w-[200px]">
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
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto flex items-center justify-between gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">{formatDateRange(dateRange)}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-2 border-b">
                  <div className="grid grid-cols-1 gap-2">
                    <Button 
                      variant={selectedDatePreset === 'wtd' ? 'default' : 'ghost'} 
                      onClick={() => handleDatePresetChange('wtd')}
                      size="sm"
                      className="justify-start"
                    >
                      Week to date
                    </Button>
                    <Button 
                      variant={selectedDatePreset === 'mtd' ? 'default' : 'ghost'} 
                      onClick={() => handleDatePresetChange('mtd')}
                      size="sm"
                      className="justify-start"
                    >
                      Month to date
                    </Button>
                    <Button 
                      variant={selectedDatePreset === 'ytd' ? 'default' : 'ghost'} 
                      onClick={() => handleDatePresetChange('ytd')}
                      size="sm"
                      className="justify-start"
                    >
                      Year to date
                    </Button>
                    <Button 
                      variant={selectedDatePreset === 'lastMonth' ? 'default' : 'ghost'} 
                      onClick={() => handleDatePresetChange('lastMonth')}
                      size="sm"
                      className="justify-start"
                    >
                      Last month
                    </Button>
                  </div>
                </div>
                <div className="p-2">
                  <h4 className="mb-2 text-sm font-medium">Custom Range</h4>
                  <CalendarComponent
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to
                    }}
                    onSelect={handleCalendarSelect}
                    numberOfMonths={2}
                    defaultMonth={dateRange.from}
                    className="p-3 pointer-events-auto rounded-md border"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard 
          title="Total Views" 
          value={totalViews.toLocaleString()} 
          description={formatDateRange(dateRange)} 
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
          description={formatDateRange(dateRange)} 
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
          <CardContent className="p-4">
            <div className="h-[200px] w-full">
              <ChartContainer 
                config={{
                  views: { theme: { light: '#0ea5e9', dark: '#0ea5e9' } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Daily Spend</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[200px] w-full">
              <ChartContainer
                config={{
                  spent: { theme: { light: '#16a34a', dark: '#16a34a' } }
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
