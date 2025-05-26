
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Submission, 
  Campaign
} from "@/lib/campaign-types";
import RetainerSubmissionsTable from "./RetainerSubmissionsTable";
import PayPerViewSubmissionsTable from "./PayPerViewSubmissionsTable";
import { toast } from "sonner";
import { Banknote, Briefcase, Trophy } from "lucide-react";

interface CampaignSubmissionsProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
  campaign?: Campaign;
}

const CampaignSubmissions: React.FC<CampaignSubmissionsProps> = ({ 
  submissions,
  onApprove,
  onDeny,
  campaign
}) => {
  const [activeTab, setActiveTab] = useState("retainer");
  
  // Filter submissions by campaign type
  const retainerSubmissions = submissions.filter(s => s.campaign_type === "retainer");
  const payPerViewSubmissions = submissions.filter(s => s.campaign_type === "payPerView");
  const challengeSubmissions = submissions.filter(s => s.campaign_type === "challenge");
  
  // If we have a specific campaign, only show the relevant tab
  if (campaign) {
    return (
      <div className="space-y-4">
        {campaign.type === "retainer" && (
          <RetainerSubmissionsTable 
            submissions={retainerSubmissions}
            campaigns={[]} // We'll use real campaign data now
            onApprove={onApprove}
            onDeny={onDeny}
          />
        )}
        
        {campaign.type === "payPerView" && (
          <PayPerViewSubmissionsTable 
            submissions={payPerViewSubmissions}
            campaigns={[]} // We'll use real campaign data now
            onApprove={onApprove}
            onDeny={onDeny}
          />
        )}
        
        {campaign.type === "challenge" && (
          <div className="text-center py-6 text-muted-foreground">
            {challengeSubmissions.length === 0 ? (
              "No challenge submissions yet"
            ) : (
              "Challenge submissions view will be implemented soon"
            )}
          </div>
        )}
      </div>
    );
  }
  
  // If no specific campaign is provided, show the tabbed interface
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="retainer" className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2" />
            Retainer ({retainerSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="payPerView" className="flex items-center">
            <Banknote className="h-4 w-4 mr-2" />
            Pay-Per-View ({payPerViewSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="challenge" className="flex items-center">
            <Trophy className="h-4 w-4 mr-2" />
            Challenge ({challengeSubmissions.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="retainer" className="pt-4">
          <RetainerSubmissionsTable 
            submissions={retainerSubmissions}
            campaigns={[]}
            onApprove={onApprove}
            onDeny={onDeny}
          />
        </TabsContent>
        
        <TabsContent value="payPerView" className="pt-4">
          <PayPerViewSubmissionsTable 
            submissions={payPerViewSubmissions}
            campaigns={[]}
            onApprove={onApprove}
            onDeny={onDeny}
          />
        </TabsContent>
        
        <TabsContent value="challenge" className="pt-4">
          {challengeSubmissions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No challenge submissions yet
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Challenge submissions view will be implemented soon
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignSubmissions;
