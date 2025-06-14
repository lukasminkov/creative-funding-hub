
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Users, Eye, DollarSign, 
  BarChart3, ArrowUpRight, Plus, Calendar 
} from "lucide-react";

export default function BusinessHome() {
  const earningsData = {
    total: 12842.60,
    approved: 12642.00,
    pending: 200.60,
    change: 17.2
  };

  const campaigns = [
    {
      id: 1,
      title: "Campaign for new sneakers",
      brand: "Adidas",
      status: "Pending",
      logo: "🏃‍♂️"
    },
    {
      id: 2,
      title: "Campaign for new sneakers",
      brand: "Nike",
      status: "Pending", 
      logo: "👟"
    },
    {
      id: 3,
      title: "Campaign for new sneakers",
      brand: "Adidas",
      status: "Pending",
      logo: "🏃‍♂️"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your business campaigns and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Earnings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Total Earnings</h2>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View all
          </Button>
        </div>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-white">
                      ${earningsData.total.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-400">.60</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500 font-medium">+{earningsData.change}%</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-white text-sm">Approved:</span>
                  <span className="text-green-500 font-medium">${earningsData.approved.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-white text-sm">Pending:</span>
                  <span className="text-orange-500 font-medium">${earningsData.pending}</span>
                </div>
              </div>

              {/* Simple Chart Placeholder */}
              <div className="h-32 bg-gray-700/30 rounded-lg flex items-end justify-between px-4 pb-4 mt-6">
                {[40, 60, 45, 80, 65, 90, 75].map((height, index) => (
                  <div 
                    key={index}
                    className="w-6 bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Time Period Buttons */}
              <div className="flex gap-2 mt-4">
                {['7D', '1M', '3M', '1Y', 'ALL'].map((period) => (
                  <Button
                    key={period}
                    variant={period === '7D' ? 'default' : 'ghost'}
                    size="sm"
                    className={period === '7D' 
                      ? 'bg-gray-700 text-white hover:bg-gray-600' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Campaigns</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Applications</p>
                <p className="text-2xl font-bold text-white">248</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg. Engagement</p>
                <p className="text-2xl font-bold text-white">24.8%</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            View all
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl">
                      {campaign.logo}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{campaign.title}</h3>
                      <p className="text-gray-400 text-sm">{campaign.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-orange-500/20 text-orange-300 border-orange-500/30"
                    >
                      {campaign.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
