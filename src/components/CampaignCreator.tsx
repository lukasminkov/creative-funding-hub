import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Campaign, 
  RetainerCampaign, 
  PayPerViewCampaign, 
  ChallengeCampaign, 
  CONTENT_TYPES, 
  CATEGORIES, 
  ApplicationQuestion, 
  RestrictedAccess, 
  COUNTRY_OPTIONS 
} from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import RetainerForm from "./campaign-forms/RetainerForm";
import PayPerViewForm from "./campaign-forms/PayPerViewForm";
import ChallengeForm from "./campaign-forms/ChallengeForm";
import CampaignPaymentModal from "./CampaignPaymentModal";
import { Save, Rocket } from "lucide-react";
import { toast } from "sonner";
import VisibilitySelector from "./VisibilitySelector";

interface CampaignCreatorProps {
  onCancel: () => void;
  onSubmit: (campaign: Campaign) => void;
  campaign?: Campaign;
  isEditing?: boolean;
  disableBudgetEdit?: boolean;
}

const CampaignCreator = ({ onCancel, onSubmit, campaign: initialCampaign, isEditing = false, disableBudgetEdit = false }: CampaignCreatorProps) => {
  const [campaignType, setCampaignType] = useState<"retainer" | "payPerView" | "challenge">(
    initialCampaign?.type || "retainer"
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [campaign, setCampaign] = useState<Partial<Campaign>>(initialCampaign || {
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
    guidelines: { dos: [], donts: [] },
    trackingLink: "",
    requestedTrackingLink: false,
    exampleVideos: [],
    visibility: "public",
    countryAvailability: COUNTRY_OPTIONS[0], // Default to worldwide
  });

  const handleCampaignChange = (updatedCampaign: Partial<Campaign>) => {
    if (disableBudgetEdit && isEditing && 'totalBudget' in updatedCampaign) {
      const { totalBudget, ...rest } = updatedCampaign;
      setCampaign({ ...campaign, ...rest });
    } else {
      setCampaign({ ...campaign, ...updatedCampaign });
    }
  };

  const handleRetainerCampaignChange = (updatedCampaign: Partial<RetainerCampaign>) => {
    handleCampaignChange(updatedCampaign as Partial<Campaign>);
  };

  const handlePayPerViewCampaignChange = (updatedCampaign: Partial<PayPerViewCampaign>) => {
    handleCampaignChange(updatedCampaign as Partial<Campaign>);
  };

  const handleChallengeCampaignChange = (updatedCampaign: Partial<ChallengeCampaign>) => {
    handleCampaignChange(updatedCampaign as Partial<Campaign>);
  };

  const handleVisibilityChange = (
    visibility: any, 
    applicationQuestions?: ApplicationQuestion[], 
    restrictedAccess?: RestrictedAccess
  ) => {
    setCampaign({
      ...campaign,
      visibility,
      applicationQuestions,
      restrictedAccess
    });
  };

  const validateCampaign = (): boolean => {
    if (!campaign.title) {
      toast.error("Please enter a campaign title");
      return false;
    }

    if (!campaign.contentType) {
      toast.error("Please select a content type");
      return false;
    }

    if (!campaign.category) {
      toast.error("Please select a category");
      return false;
    }

    if (!campaign.totalBudget || campaign.totalBudget <= 0) {
      toast.error("Please enter a valid budget");
      return false;
    }

    if (!campaign.platforms || campaign.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return false;
    }

    if (!campaign.countryAvailability) {
      toast.error("Please select country availability");
      return false;
    }

    if (campaign.type === "retainer") {
      if (!campaign.applicationDeadline) {
        toast.error("Please set an application deadline");
        return false;
      }
    } else if (campaign.type === "challenge") {
      if (!campaign.submissionDeadline) {
        toast.error("Please set a submission deadline");
        return false;
      }
    } else if (campaign.type === "payPerView") {
      if (!campaign.ratePerThousand || campaign.ratePerThousand <= 0) {
        toast.error("Please enter a valid rate per 1000 views");
        return false;
      }
      if (!campaign.maxPayoutPerSubmission || campaign.maxPayoutPerSubmission <= 0) {
        toast.error("Please enter a valid max payout per submission");
        return false;
      }
    }

    if (campaign.visibility === "applicationOnly" && 
        (!campaign.applicationQuestions || campaign.applicationQuestions.length === 0)) {
      toast.error("Please add at least one application question");
      return false;
    }

    if (campaign.visibility === "restricted" && 
        campaign.restrictedAccess?.type === "offer" && 
        (!campaign.restrictedAccess.offerIds || campaign.restrictedAccess.offerIds.length === 0)) {
      toast.error("Please select at least one offer for restricted access");
      return false;
    }

    return true;
  };

  const handleSaveAsDraft = () => {
    if (!campaign.title) {
      toast.error("Please enter a campaign title before saving");
      return;
    }

    toast.success("Campaign saved as draft");
    onSubmit(campaign as Campaign);
  };

  const handleLaunchCampaign = () => {
    if (!validateCampaign()) {
      return;
    }

    if (isEditing) {
      onSubmit(campaign as Campaign);
    } else {
      setShowPaymentModal(true);
    }
  };

  const handlePaymentComplete = () => {
    setShowPaymentModal(false);
    toast.success("Campaign launched successfully!");
    onSubmit(campaign as Campaign);
  };

  const renderCampaignForm = (type: "retainer" | "payPerView" | "challenge") => {
    const generalInfoSection = (
      <div className="py-3 px-4 bg-muted/40 rounded-lg mb-2">
        <h3 className="text-lg font-medium mb-1">General Information</h3>
        <p className="text-sm text-muted-foreground">
          This will be displayed to all users before they apply or join your campaign
        </p>
      </div>
    );

    const creatorInfoSection = (
      <div className="py-3 px-4 bg-muted/40 rounded-lg mb-2">
        <h3 className="text-lg font-medium mb-1">Creator Information</h3>
        <p className="text-sm text-muted-foreground">
          This information will only be visible to creators who have joined or been accepted
        </p>
      </div>
    );

    const getFormContent = () => {
      if (type === "retainer") {
        return (
          <>
            <div className="space-y-6">
              {generalInfoSection}
              <RetainerForm
                campaign={campaign as Partial<RetainerCampaign>}
                onChange={handleRetainerCampaignChange}
                showCreatorInfoSection={false}
                disableBudgetEdit={disableBudgetEdit && isEditing}
              />
              <div className="mt-6">
                <VisibilitySelector
                  visibility={campaign.visibility || "public"}
                  applicationQuestions={campaign.applicationQuestions}
                  restrictedAccess={campaign.restrictedAccess}
                  onChange={handleVisibilityChange}
                />
              </div>
            </div>
            
            <Separator className="my-8 bg-muted" />
            
            <div className="space-y-6">
              {creatorInfoSection}
              <RetainerForm
                campaign={campaign as Partial<RetainerCampaign>}
                onChange={handleRetainerCampaignChange}
                showCreatorInfoSection={true}
              />
            </div>
          </>
        );
      } else if (type === "payPerView") {
        return (
          <>
            <div className="space-y-6">
              {generalInfoSection}
              <PayPerViewForm
                campaign={campaign as Partial<PayPerViewCampaign>}
                onChange={handlePayPerViewCampaignChange}
                showCreatorInfoSection={false}
                disableBudgetEdit={disableBudgetEdit && isEditing}
              />
              <div className="mt-6">
                <VisibilitySelector
                  visibility={campaign.visibility || "public"}
                  applicationQuestions={campaign.applicationQuestions}
                  restrictedAccess={campaign.restrictedAccess}
                  onChange={handleVisibilityChange}
                />
              </div>
            </div>
            
            <Separator className="my-8 bg-muted" />
            
            <div className="space-y-6">
              {creatorInfoSection}
              <PayPerViewForm
                campaign={campaign as Partial<PayPerViewCampaign>}
                onChange={handlePayPerViewCampaignChange}
                showCreatorInfoSection={true}
              />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="space-y-6">
              {generalInfoSection}
              <ChallengeForm
                campaign={campaign as Partial<ChallengeCampaign>}
                onChange={handleChallengeCampaignChange}
                showCreatorInfoSection={false}
                disableBudgetEdit={disableBudgetEdit && isEditing}
              />
              <div className="mt-6">
                <VisibilitySelector
                  visibility={campaign.visibility || "public"}
                  applicationQuestions={campaign.applicationQuestions}
                  restrictedAccess={campaign.restrictedAccess}
                  onChange={handleVisibilityChange}
                />
              </div>
            </div>
            
            <Separator className="my-8 bg-muted" />
            
            <div className="space-y-6">
              {creatorInfoSection}
              <ChallengeForm
                campaign={campaign as Partial<ChallengeCampaign>}
                onChange={handleChallengeCampaignChange}
                showCreatorInfoSection={true}
              />
            </div>
          </>
        );
      }
    };

    return (
      <div className="space-y-8">
        {getFormContent()}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-5xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-lg overflow-hidden shadow-sm"
      >
        <div className="p-6">
          <Tabs
            defaultValue={campaignType}
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
            
            <TabsContent value="retainer" className="mt-0">
              <motion.div
                key="retainer-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderCampaignForm("retainer")}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="payPerView" className="mt-0">
              <motion.div
                key="payPerView-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderCampaignForm("payPerView")}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="challenge" className="mt-0">
              <motion.div
                key="challenge-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {renderCampaignForm("challenge")}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="p-6 border-t border-border/60 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="outline" onClick={handleSaveAsDraft}>
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Save Changes" : "Save as Draft"}
            </Button>
          </div>
          <Button onClick={handleLaunchCampaign}>
            <Rocket className="h-4 w-4 mr-2" />
            {isEditing ? "Update Campaign" : "Create Campaign"}
          </Button>
        </div>
      </motion.div>

      {showPaymentModal && (
        <CampaignPaymentModal
          campaign={campaign as Campaign}
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </motion.div>
  );
};

export default CampaignCreator;
