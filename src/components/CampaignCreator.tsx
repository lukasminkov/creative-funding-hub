
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Campaign, CONTENT_TYPES, CATEGORIES } from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RetainerForm from "./campaign-forms/RetainerForm";
import PayPerViewForm from "./campaign-forms/PayPerViewForm";
import ChallengeForm from "./campaign-forms/ChallengeForm";
import CampaignPreview from "./CampaignPreview";
import { toast } from "sonner";

interface CampaignCreatorProps {
  onCancel: () => void;
  onSubmit: (campaign: Campaign) => void;
}

const CampaignCreator = ({ onCancel, onSubmit }: CampaignCreatorProps) => {
  const [campaignType, setCampaignType] = useState<"retainer" | "payPerView" | "challenge">("retainer");
  const [campaign, setCampaign] = useState<Partial<Campaign>>({
    title: "",
    description: "",
    contentType: CONTENT_TYPES[0],
    category: CATEGORIES[0],
    totalBudget: 0,
    currency: "USD",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    platforms: [],
    type: "retainer",
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now for application deadline
    requirements: [],
    guidelines: { dos: [], donts: [] },
    trackingLink: "",
    requestedTrackingLink: false
  });

  const handleCampaignChange = (updatedCampaign: Partial<Campaign>) => {
    setCampaign({ ...campaign, ...updatedCampaign });
  };

  const handleSubmit = () => {
    // Validate the campaign before submitting
    if (!campaign.title) {
      toast.error("Please enter a campaign title");
      return;
    }

    if (!campaign.contentType) {
      toast.error("Please select a content type");
      return;
    }

    if (!campaign.category) {
      toast.error("Please select a category");
      return;
    }

    if (!campaign.totalBudget || campaign.totalBudget <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    if (!campaign.platforms || campaign.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    // Validate type-specific fields
    if (campaign.type === "retainer") {
      if (!campaign.applicationDeadline) {
        toast.error("Please set an application deadline");
        return;
      }
      if (!campaign.platforms || campaign.platforms.length !== 1) {
        toast.error("Please select exactly one platform for retainer campaigns");
        return;
      }
    } else if (campaign.type === "challenge") {
      if (!campaign.submissionDeadline) {
        toast.error("Please set a submission deadline");
        return;
      }
    }

    toast.success("Campaign created successfully!");
    onSubmit(campaign as Campaign);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="campaign-layout"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
      >
        <div className="p-6 border-b border-border/60">
          <h2 className="text-2xl font-medium">Create New Campaign</h2>
          <p className="text-muted-foreground">Set up rewards for creator content</p>
        </div>
        
        <div className="p-6">
          <Tabs
            defaultValue="retainer"
            value={campaignType}
            onValueChange={(value) => {
              setCampaignType(value as "retainer" | "payPerView" | "challenge");
              setCampaign({
                ...campaign,
                type: value as "retainer" | "payPerView" | "challenge"
              });
            }}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="retainer">Retainer</TabsTrigger>
              <TabsTrigger value="payPerView">Pay Per View</TabsTrigger>
              <TabsTrigger value="challenge">Challenge</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="retainer" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <RetainerForm
                    campaign={campaign}
                    onChange={handleCampaignChange}
                  />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="payPerView" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <PayPerViewForm
                    campaign={campaign}
                    onChange={handleCampaignChange}
                  />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="challenge" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChallengeForm
                    campaign={campaign}
                    onChange={handleCampaignChange}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </div>
        
        <div className="p-6 border-t border-border/60 flex items-center justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Campaign
          </Button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CampaignPreview campaign={campaign} />
      </motion.div>
    </motion.div>
  );
};

export default CampaignCreator;
