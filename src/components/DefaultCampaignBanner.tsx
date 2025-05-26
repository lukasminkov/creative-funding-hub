
import { DollarSign, TrendingUp, Users, Zap } from "lucide-react";

interface DefaultCampaignBannerProps {
  title: string;
  type?: string;
  className?: string;
}

export default function DefaultCampaignBanner({ 
  title, 
  type = "Campaign", 
  className = "" 
}: DefaultCampaignBannerProps) {
  return (
    <div className={`relative h-40 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4 text-4xl">💰</div>
        <div className="absolute top-8 right-12 text-3xl">💎</div>
        <div className="absolute bottom-6 left-8 text-2xl">🚀</div>
        <div className="absolute bottom-4 right-6 text-3xl">💵</div>
        <div className="absolute top-12 left-1/3 text-2xl">⭐</div>
        <div className="absolute bottom-8 right-1/3 text-2xl">🎯</div>
      </div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-300 rounded-full transform -translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-400 rounded-lg transform rotate-45"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 text-yellow-300">
            <DollarSign className="h-5 w-5" />
            <span className="font-bold text-lg">Payper</span>
          </div>
          <div className="flex items-center gap-1 opacity-80">
            <Users className="h-4 w-4" />
            <TrendingUp className="h-4 w-4" />
            <Zap className="h-4 w-4" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-white/90 text-sm">
          {type.charAt(0).toUpperCase() + type.slice(1)} Campaign • Earn with Content
        </p>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 text-white/70">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <DollarSign className="h-4 w-4" />
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
