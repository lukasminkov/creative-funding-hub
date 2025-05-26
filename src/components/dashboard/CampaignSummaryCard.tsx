
import { useState } from "react";
import { Link } from "react-router-dom";
import { Campaign } from "@/lib/campaign-types";
import { formatCurrency } from "@/lib/campaign-types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Share2, Trash2, ArrowUpRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import DefaultCampaignBanner from "../DefaultCampaignBanner";

interface CampaignSummaryCardProps {
  campaign: Campaign;
  showActions?: boolean;
  onDelete?: (id: string) => void;
}

export default function CampaignSummaryCard({ campaign, showActions = true, onDelete }: CampaignSummaryCardProps) {
  const now = new Date();
  const endDate = new Date(campaign.endDate);
  
  let status = "Active";
  let statusColor = "bg-green-100 text-green-800";
  let progress = 0;
  let progressText = "";
  
  if (endDate < now) {
    status = "Ended";
    statusColor = "bg-gray-100 text-gray-800";
    progress = 100;
  } else if (campaign.type === "retainer") {
    const appDeadline = new Date(campaign.applicationDeadline);
    if (appDeadline > now) {
      status = "Application Phase";
      statusColor = "bg-purple-100 text-purple-800";
      progress = 0;
    } else {
      progress = 40;
    }
    const totalVideos = campaign.deliverables?.totalVideos || 10;
    progressText = `${Math.round(totalVideos * (progress / 100))}/${totalVideos} deliverables`;
  } else if (campaign.type === "payPerView") {
    progress = status === "Ended" ? 100 : 30;
    progressText = `$${(campaign.totalBudget * (progress / 100)).toFixed(2)}/$${campaign.totalBudget} claimed`;
  } else if (campaign.type === "challenge") {
    const submitDeadline = new Date(campaign.submissionDeadline);
    if (submitDeadline < now) {
      status = "Judging";
      statusColor = "bg-yellow-100 text-yellow-800";
      progress = 100;
    } else {
      const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      const total = submitDeadline.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      progress = Math.min(100, Math.floor((elapsed / total) * 100));
    }
    progressText = `${Math.round(progress)}% complete`;
  }
  
  // Generate sample metrics
  const views = Math.floor(Math.random() * 50000) + 10000;
  const cpm = Number(((campaign.totalBudget * 0.3) / (views / 1000)).toFixed(2));
  
  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/dashboard/campaigns/${campaign.id}`);
    toast.success("Campaign link copied to clipboard");
  };
  
  const handleDelete = () => {
    if (onDelete && campaign.id) {
      onDelete(campaign.id);
    }
  };

  return (
    <Card glass className="overflow-hidden h-full transition-all hover:shadow-md flex flex-col">
      {campaign.bannerImage ? (
        <div className="h-40 relative">
          <img src={campaign.bannerImage} alt={campaign.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <h3 className="text-lg font-medium text-white">{campaign.title}</h3>
            <p className="text-sm text-white/80">
              {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
            </p>
          </div>
          {showActions && (
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <DefaultCampaignBanner 
            title={campaign.title}
            type={campaign.type}
            className="h-40"
          />
          {showActions && (
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Campaign Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 flex-grow flex flex-col backdrop-blur-sm">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{progressText}</span>
            <span className={`text-xs py-1 px-2 rounded-full ${statusColor}`}>
              {status}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {campaign.platforms && campaign.platforms.slice(0, 3).map(platform => (
            <span key={platform} className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
              {platform.split(' ')[0]}
            </span>
          ))}
          {campaign.platforms && campaign.platforms.length > 3 && (
            <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded">
              +{campaign.platforms.length - 3}
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <p className="text-muted-foreground">Budget:</p>
            <p className="font-medium">{formatCurrency(campaign.totalBudget, campaign.currency)}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Views:</p>
            <p className="font-medium">{views.toLocaleString()}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">CPM:</p>
            <p className="font-medium">{formatCurrency(cpm, campaign.currency)}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground">Creators:</p>
            <p className="font-medium">{Math.floor(Math.random() * 5) + 1}</p>
          </div>
        </div>
        
        <div className="mt-auto">
          <Link to={`/dashboard/campaigns/${campaign.id}`}>
            <Button variant="outline" className="w-full group">
              View Details
              <ArrowUpRight className="h-4 w-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
