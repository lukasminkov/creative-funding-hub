
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User, BarChart3, Users, Compass, Wrench, MessageSquare, CreditCard, Settings } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardSelector() {
  const navigate = useNavigate();

  const handleDashboardSelect = (type: 'business' | 'profile') => {
    localStorage.setItem('selectedDashboard', type);
    navigate(`/dashboard/${type}`);
  };

  const businessFeatures = [
    { icon: BarChart3, title: "Analytics", desc: "Campaign & marketing insights" },
    { icon: Users, title: "Communities", desc: "Manage creator communities" },
    { icon: Wrench, title: "Business Tools", desc: "Advanced business features" },
    { icon: CreditCard, title: "Finance", desc: "Revenue & payment management" }
  ];

  const profileFeatures = [
    { icon: BarChart3, title: "Earnings", desc: "Track your campaign earnings" },
    { icon: Compass, title: "Explore", desc: "Discover campaigns & creators" },
    { icon: Users, title: "Workspace", desc: "Your campaigns & communities" },
    { icon: Wrench, title: "Creator Tools", desc: "Content creation tools" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Welcome to Payper
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to use the platform today. You can switch between modes anytime.
          </p>
        </div>

        {/* Dashboard Options */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Business Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-500/50"
                  onClick={() => handleDashboardSelect('business')}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <Building2 className="h-10 w-10" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">Business Dashboard</CardTitle>
                <p className="text-muted-foreground">
                  Manage campaigns, communities, and grow your business
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {businessFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50 group-hover:bg-blue-50/50 transition-colors">
                      <feature.icon className="h-6 w-6 text-blue-600 mb-2" />
                      <span className="font-medium text-sm">{feature.title}</span>
                      <span className="text-xs text-muted-foreground">{feature.desc}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  Enter Business Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-green-500/50"
                  onClick={() => handleDashboardSelect('profile')}>
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                    <User className="h-10 w-10" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">Profile Dashboard</CardTitle>
                <p className="text-muted-foreground">
                  Create content, join campaigns, and connect with others
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {profileFeatures.map((feature, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50 group-hover:bg-green-50/50 transition-colors">
                      <feature.icon className="h-6 w-6 text-green-600 mb-2" />
                      <span className="font-medium text-sm">{feature.title}</span>
                      <span className="text-xs text-muted-foreground">{feature.desc}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
                  Enter Profile Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            You can switch between dashboards anytime using the toggle in the top navigation
          </p>
        </div>
      </div>
    </div>
  );
}
