
import React from "react";
import { Bell, Check, Clock, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Campaign, Submission } from "@/lib/campaign-types";
import { toast } from "sonner";

const NotificationCenter = () => {
  // In a real app, we would fetch this data from an API
  // For demo purposes, we'll simulate with stored data
  const { data: submissions = [], isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['submissions'],
    queryFn: () => {
      // Simulate getting submissions from localStorage or storage
      const storedSubmissions = localStorage.getItem("submissions");
      try {
        return storedSubmissions ? JSON.parse(storedSubmissions) : [];
      } catch (e) {
        console.error("Error parsing submissions:", e);
        return [];
      }
    }
  });

  const { data: campaigns = [], isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => {
      const storedCampaigns = localStorage.getItem("campaigns");
      try {
        return storedCampaigns ? JSON.parse(storedCampaigns) : [];
      } catch (e) {
        console.error("Error parsing campaigns:", e);
        return [];
      }
    }
  });

  // Calculate notification stats
  const pendingSubmissions = submissions.filter((s: Submission) => s.status === "pending");
  const pendingRetainerSubmissions = pendingSubmissions.filter((s: Submission) => s.campaign_type === "retainer");
  const pendingPayPerViewSubmissions = pendingSubmissions.filter((s: Submission) => s.campaign_type === "payPerView");
  
  // Get campaigns ending soon (within 7 days)
  const today = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  
  const campaignsEndingSoon = campaigns.filter((campaign: Campaign) => {
    const endDate = new Date(campaign.endDate);
    return endDate >= today && endDate <= sevenDaysFromNow;
  });

  // Handle notification click to mark as read
  const handleNotificationClick = (id: string) => {
    toast.success("Notification marked as read");
  };

  if (isLoadingSubmissions || isLoadingCampaigns) {
    return (
      <Card className="bg-card border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-20 bg-muted/40 animate-pulse rounded-md"></div>
            <div className="h-20 bg-muted/40 animate-pulse rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No notifications scenario
  if (pendingSubmissions.length === 0 && campaignsEndingSoon.length === 0) {
    return (
      <Card className="bg-card border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            <p>All caught up! No pending submissions or urgent campaigns.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 to-transparent">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/60">
          {pendingSubmissions.length > 0 && (
            <div 
              className="p-4 bg-gradient-to-r from-secondary/5 to-transparent hover:bg-secondary/10 transition-colors cursor-pointer"
              onClick={() => handleNotificationClick("pending-submissions")}
            >
              <Link to="/dashboard/campaigns" className="block">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-foreground">Pending Content Review</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You have {pendingSubmissions.length} submission{pendingSubmissions.length !== 1 ? 's' : ''} waiting for review.
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {pendingRetainerSubmissions.length > 0 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {pendingRetainerSubmissions.length} Retainer
                        </span>
                      )}
                      {pendingPayPerViewSubmissions.length > 0 && (
                        <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-full">
                          {pendingPayPerViewSubmissions.length} Pay-Per-View
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                      <span className="text-xs font-medium text-primary-foreground">{pendingSubmissions.length}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {campaignsEndingSoon.map((campaign: Campaign) => (
            <div 
              key={campaign.id} 
              className="p-4 bg-gradient-to-r from-orange-50 to-transparent hover:bg-orange-100/30 dark:from-amber-950/20 dark:to-transparent dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
              onClick={() => handleNotificationClick(campaign.id)}
            >
              <Link to={`/dashboard/campaigns/${campaign.id}`} className="block">
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 dark:bg-amber-900/30 p-2 rounded-full">
                    <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1 text-foreground">Campaign Ending Soon</h4>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">{campaign.title}</span> is ending on {new Date(campaign.endDate).toLocaleDateString()}.
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs bg-orange-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                      {Math.ceil((new Date(campaign.endDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))} days left
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {(pendingSubmissions.length > 2 || campaignsEndingSoon.length > 1) && (
          <div className="p-3 text-center border-t border-border/40">
            <Link to="/dashboard/notifications" className="text-sm text-primary hover:underline">
              View all notifications
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCenter;
