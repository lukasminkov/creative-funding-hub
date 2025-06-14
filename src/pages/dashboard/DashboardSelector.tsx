import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, User, BarChart3, Users, Compass, Wrench, TrendingUp, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
export default function DashboardSelector() {
  const navigate = useNavigate();
  const handleDashboardSelect = (type: 'business' | 'profile') => {
    localStorage.setItem('selectedDashboardType', type);
    navigate(`/dashboard/${type}`);
  };
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center mb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl">
              <BarChart3 className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose how you'd like to use Payper today. You can switch between modes anytime.
          </p>
        </div>

        {/* Dashboard Options */}
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Business Dashboard */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.1
        }} whileHover={{
          scale: 1.02
        }} className="cursor-pointer" onClick={() => handleDashboardSelect('business')}>
            <Card className="h-full bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <Building2 className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="font-bold text-white mb-2 text-xl">Business</CardTitle>
                <p className="text-gray-400 text-sm">
                  Manage campaigns, communities, and grow your business
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-white text-sm font-medium">Analytics</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    <span className="text-white text-sm font-medium">Campaigns</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-white text-sm font-medium">Communities</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <Wrench className="h-5 w-5 text-orange-500" />
                    <span className="text-white text-sm font-medium">Tools</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3">
                  Open Business Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Dashboard */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.2
        }} whileHover={{
          scale: 1.02
        }} className="cursor-pointer" onClick={() => handleDashboardSelect('profile')}>
            <Card className="h-full bg-gray-800 border-gray-700 hover:border-green-500/50 transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
                    <User className="h-8 w-8" />
                  </div>
                </div>
                <CardTitle className="font-bold text-white mb-2 text-xl">Profile</CardTitle>
                <p className="text-gray-400 text-sm">
                  Track earnings, join campaigns, and connect with others
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-white text-sm font-medium">Earnings</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    <span className="text-white text-sm font-medium">Workspace</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <Compass className="h-5 w-5 text-purple-500" />
                    <span className="text-white text-sm font-medium">Explore</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                    <User className="h-5 w-5 text-orange-500" />
                    <span className="text-white text-sm font-medium">Profile</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-3">
                  Open Profile Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>;
}