
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Users, Eye, DollarSign, 
  BarChart3, ArrowUpRight, Plus, Calendar, MessageSquare, Target
} from "lucide-react";

export default function ProfileHome() {
  const earningsData = {
    total: 8642.30,
    approved: 8142.30,
    pending: 500.00,
    change: 12.4
  };

  const applications = [
    {
      id: 1,
      title: "Campaign for new sneakers",
      brand: "Adidas",
      status: "Pending",
      logo: "🏃‍♂️",
      earnings: "$150"
    },
    {
      id: 2,
      title: "Campaign for new sneakers", 
      brand: "Nike",
      status: "Approved",
      logo: "👟",
      earnings: "$200"
    },
    {
      id: 3,
      title: "Summer fashion campaign",
      brand: "H&M",
      status: "In Progress",
      logo: "👕",
      earnings: "$300"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Track your earnings and campaign participation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
            <Target className="h-4 w-4 mr-2" />
            Find Campaigns
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
                    <span className="text-lg text-gray-400">.30</span>
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
                  <span className="text-orange-500 font-medium">${earningsData.pending.toFixed(2)}</span>
                </div>
              </div>

              {/* Simple Chart Placeholder */}
              <div className="h-32 bg-gray-700/30 rounded-lg flex items-end justify-between px-4 pb-4 mt-6">
                {[30, 45, 35, 60, 50, 75, 65].map((height, index) => (
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
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Communities Joined</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Applications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">My Applications</h2>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            3
          </Badge>
        </div>
        
        <div className="space-y-3">
          {applications.map((application) => (
            <Card key={application.id} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-xl">
                      {application.logo}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{application.title}</h3>
                      <p className="text-gray-400 text-sm">{application.brand}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{application.earnings}</span>
                    <Badge 
                      variant="secondary" 
                      className={
                        application.status === 'Approved' 
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : application.status === 'Pending'
                          ? "bg-orange-500/20 text-orange-300 border-orange-500/30"
                          : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                      }
                    >
                      {application.status}
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

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold text-lg mb-2">Earn Money & Stock in Payper</h3>
              <p className="text-gray-300 text-sm">Become an Affiliate</p>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
