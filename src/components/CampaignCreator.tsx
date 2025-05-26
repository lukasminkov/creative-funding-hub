import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import CampaignPaymentModal from "./CampaignPaymentModal";
import { Save, Rocket, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import CampaignStepBasics from "./campaign-steps/CampaignStepBasics";
import CampaignStepType from "./campaign-steps/CampaignStepType";
import CampaignStepDetails from "./campaign-steps/CampaignStepDetails";
import CampaignStepCreatorInfo from "./campaign-steps/CampaignStepCreatorInfo";
import CampaignStepReview from "./campaign-steps/CampaignStepReview";

interface CampaignCreatorProps {
  onCancel: () => void;
  onSubmit: (campaign: Campaign) => void;
  campaign?: Campaign;
  isEditing?: boolean;
  disableBudgetEdit?: boolean;
  isModal?: boolean;
}

const STEPS = [
  { id: 'basics', title: 'Campaign Basics', description: 'Name, description & budget' },
  { id: 'type', title: 'Campaign Type', description: 'Choose your campaign model' },
  { id: 'details', title: 'Campaign Details', description: 'Requirements & settings' },
  { id: 'creator-info', title: 'Creator Information', description: 'Guidelines & resources' },
  { id: 'review', title: 'Review & Launch', description: 'Final review before launch' }
];

const CampaignCreator = ({ 
  onCancel, 
  onSubmit, 
  campaign: initialCampaign, 
  isEditing = false, 
  disableBudgetEdit = false,
  isModal = false
}: CampaignCreatorProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [campaign, setCampaign] = useState<Partial<Campaign>>(initialCampaign || {
    title: "",
    description: "",
    contentType: CONTENT_TYPES[0],
    category: CATEGORIES[0],
    totalBudget: 0,
    currency: "USD",
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    platforms: [],
    type: "retainer",
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    guidelines: { dos: [], donts: [] },
    trackingLink: "",
    requestedTrackingLink: false,
    exampleVideos: [],
    visibility: "public",
    countryAvailability: COUNTRY_OPTIONS[0],
  });

  const handleCampaignChange = (updatedCampaign: Partial<Campaign>) => {
    if (disableBudgetEdit && isEditing && 'totalBudget' in updatedCampaign) {
      const { totalBudget, ...rest } = updatedCampaign;
      setCampaign({ ...campaign, ...rest });
    } else {
      setCampaign({ ...campaign, ...updatedCampaign });
    }
  };

  const validateStep = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Basics
        if (!campaign.title?.trim()) {
          toast.error("Please enter a campaign title");
          return false;
        }
        if (!campaign.description?.trim()) {
          toast.error("Please enter a campaign description");
          return false;
        }
        if (!campaign.totalBudget || campaign.totalBudget <= 0) {
          toast.error("Please enter a valid budget");
          return false;
        }
        return true;
        
      case 1: // Type
        if (!campaign.type) {
          toast.error("Please select a campaign type");
          return false;
        }
        return true;
        
      case 2: // Details
        if (!campaign.platforms || campaign.platforms.length === 0) {
          toast.error("Please select at least one platform");
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
        return true;
        
      case 3: // Creator Info
        return true;
        
      case 4: // Review
        return validateAllSteps();
        
      default:
        return true;
    }
  };

  const validateAllSteps = (): boolean => {
    // Basic validation
    if (!campaign.title || !campaign.description || !campaign.totalBudget || campaign.totalBudget <= 0) {
      toast.error("Please complete all required basic information");
      return false;
    }

    if (!campaign.platforms || campaign.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return false;
    }

    // Type-specific validation
    if (campaign.type === "retainer" && !campaign.applicationDeadline) {
      toast.error("Please set an application deadline");
      return false;
    }
    
    if (campaign.type === "challenge" && !campaign.submissionDeadline) {
      toast.error("Please set a submission deadline");
      return false;
    }
    
    if (campaign.type === "payPerView") {
      if (!campaign.ratePerThousand || campaign.ratePerThousand <= 0) {
        toast.error("Please enter a valid rate per 1000 views");
        return false;
      }
      if (!campaign.maxPayoutPerSubmission || campaign.maxPayoutPerSubmission <= 0) {
        toast.error("Please enter a valid max payout per submission");
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep || validateStep(currentStep)) {
      setCurrentStep(stepIndex);
    }
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
    if (!validateAllSteps()) {
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

  const progressPercentage = ((currentStep + 1) / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignStepBasics 
            campaign={campaign} 
            onChange={handleCampaignChange}
            disableBudgetEdit={disableBudgetEdit && isEditing}
          />
        );
      case 1:
        return (
          <CampaignStepType 
            campaign={campaign} 
            onChange={handleCampaignChange}
          />
        );
      case 2:
        return (
          <CampaignStepDetails 
            campaign={campaign} 
            onChange={handleCampaignChange}
          />
        );
      case 3:
        return (
          <CampaignStepCreatorInfo 
            campaign={campaign} 
            onChange={handleCampaignChange}
          />
        );
      case 4:
        return (
          <CampaignStepReview 
            campaign={campaign as Campaign}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${isModal ? 'space-y-6' : 'max-w-4xl mx-auto'}`}>
      {/* Progress Header */}
      <div className={`${isModal ? 'pb-6 border-b' : 'p-6 border-b border-border/30 bg-gradient-to-r from-background to-muted/20'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">{STEPS[currentStep].title}</h2>
            <p className="text-sm text-muted-foreground">{STEPS[currentStep].description}</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
        </div>
        
        <Progress value={progressPercentage} className="h-2 mb-4" />
        
        {/* Step Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                index === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : index < currentStep
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {index < currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="w-3 h-3 rounded-full bg-current opacity-60 flex-shrink-0" />
              )}
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className={`${isModal ? 'pt-6 border-t' : 'p-6 border-t border-border/30 bg-gradient-to-r from-background to-muted/20'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {!isEditing && (
              <Button variant="outline" onClick={handleSaveAsDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            
            {currentStep < STEPS.length - 1 ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleLaunchCampaign} className="bg-gradient-to-r from-primary to-primary/80">
                <Rocket className="h-4 w-4 mr-2" />
                {isEditing ? "Update Campaign" : "Launch Campaign"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <CampaignPaymentModal
          campaign={campaign as Campaign}
          open={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default CampaignCreator;
