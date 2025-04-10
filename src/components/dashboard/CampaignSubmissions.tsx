
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Submission, 
  RetainerCampaign, 
  PayPerViewCampaign, 
  ChallengeCampaign
} from "@/lib/campaign-types";
import RetainerSubmissionsTable from "./RetainerSubmissionsTable";
import PayPerViewSubmissionsTable from "./PayPerViewSubmissionsTable";
import { toast } from "sonner";
import { Banknote, Briefcase, Trophy } from "lucide-react";

// Mock campaigns data for demonstration
const mockRetainerCampaigns: RetainerCampaign[] = [
  {
    id: "campaign-1",
    title: "30-Day Product Review Series",
    type: "retainer",
    contentType: "UGC",
    category: "Fashion",
    platforms: ["TikTok", "Instagram Reels"],
    totalBudget: 15000,
    currency: "USD",
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() - 5)),
    creatorTiers: [
      { name: "Standard", price: 1000 },
      { name: "Premium", price: 2000 }
    ],
    deliverables: {
      mode: "videosPerDay",
      videosPerDay: 1,
      durationDays: 30
    },
    guidelines: {
      dos: ["Show product from multiple angles", "Mention key features"],
      donts: ["Don't criticize competitors", "Don't use background music"]
    },
    visibility: "public",
    countryAvailability: "worldwide",
    requirements: ["Must have 10K+ followers"]
  },
  {
    id: "campaign-2",
    title: "Weekly Tech Reviews",
    type: "retainer",
    contentType: "UGC",
    category: "Tech",
    platforms: ["YouTube Shorts", "TikTok"],
    totalBudget: 8000,
    currency: "USD",
    endDate: new Date(new Date().setDate(new Date().getDate() + 45)),
    applicationDeadline: new Date(new Date().setDate(new Date().getDate() - 10)),
    creatorTiers: [
      { name: "Basic", price: 800 },
      { name: "Advanced", price: 1500 }
    ],
    deliverables: {
      mode: "totalVideos",
      totalVideos: 8
    },
    guidelines: {
      dos: ["Demonstrate the product in use", "Share honest opinions"],
      donts: ["Don't share incorrect information", "Don't make exaggerated claims"]
    },
    visibility: "public",
    countryAvailability: "usa",
    requirements: ["Tech knowledge required", "Previous tech review experience"]
  }
];

const mockPayPerViewCampaigns: PayPerViewCampaign[] = [
  {
    id: "campaign-3",
    title: "Summer Fashion Collection",
    type: "payPerView",
    contentType: "UGC",
    category: "Fashion",
    platforms: ["Instagram Reels", "TikTok"],
    totalBudget: 10000,
    currency: "USD",
    endDate: new Date(new Date().setDate(new Date().getDate() + 60)),
    ratePerThousand: 20,
    maxPayoutPerSubmission: 500,
    viewValidationPeriod: 10,
    guidelines: {
      dos: ["Show at least 3 items from the collection", "Tag the brand"],
      donts: ["Don't combine with competitor products", "Don't alter product colors"]
    },
    visibility: "public",
    countryAvailability: "worldwide",
    requirements: ["Fashion niche creators only"]
  },
  {
    id: "campaign-4",
    title: "Fitness App Promotion",
    type: "payPerView",
    contentType: "UGC",
    category: "Fitness",
    platforms: ["TikTok", "Instagram Reels"],
    totalBudget: 12000,
    currency: "USD",
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    ratePerThousand: 15,
    maxPayoutPerSubmission: 750,
    viewValidationPeriod: 7,
    guidelines: {
      dos: ["Show app interface", "Demonstrate a full workout", "Share results"],
      donts: ["Don't make false health claims", "Don't promise specific results"]
    },
    visibility: "public",
    countryAvailability: "worldwide",
    requirements: ["Fitness enthusiasts or trainers"]
  }
];

interface CampaignSubmissionsProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => Promise<void>;
  onDeny: (submission: Submission, reason: string) => Promise<void>;
}

const CampaignSubmissions: React.FC<CampaignSubmissionsProps> = ({ 
  submissions,
  onApprove,
  onDeny
}) => {
  const [activeTab, setActiveTab] = useState("retainer");
  
  // Filter submissions by campaign type
  const retainerSubmissions = submissions.filter(s => s.campaign_type === "retainer");
  const payPerViewSubmissions = submissions.filter(s => s.campaign_type === "payPerView");
  const challengeSubmissions = submissions.filter(s => s.campaign_type === "challenge");
  
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
            campaigns={mockRetainerCampaigns}
            onApprove={onApprove}
            onDeny={onDeny}
          />
        </TabsContent>
        
        <TabsContent value="payPerView" className="pt-4">
          <PayPerViewSubmissionsTable 
            submissions={payPerViewSubmissions}
            campaigns={mockPayPerViewCampaigns}
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
