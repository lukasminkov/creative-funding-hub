
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Campaign, 
  CONTENT_TYPES, 
  CATEGORIES
} from "@/lib/campaign-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Save, Rocket, ArrowLeft, ArrowRight, Check, 
  FileText, Settings, Users, Eye 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  { 
    id: 'basics', 
    title: 'Campaign Basics', 
    description: 'Name, description & budget',
    icon: FileText
  },
  { 
    id: 'type', 
    title: 'Campaign Type', 
    description: 'Choose your campaign model',
    icon: Settings
  },
  { 
    id: 'details', 
    title: 'Campaign Details', 
    description: 'Requirements & settings',
    icon: Users
  },
  { 
    id: 'creator-info', 
    title: 'Creator Information', 
    description: 'Guidelines & resources',
    icon: Users
  },
  { 
    id: 'review', 
    title: 'Review & Launch', 
    description: 'Final review before launch',
    icon: Eye
  }
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
        return true;
        
      default:
        return true;
    }
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
    if (!validateStep(currentStep)) {
      return;
    }
    
    toast.success(isEditing ? "Campaign updated successfully!" : "Campaign launched successfully!");
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
    <div className="w-full space-y-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                {React.createElement(STEPS[currentStep].icon, { className: "h-5 w-5" })}
              </div>
              {STEPS[currentStep].title}
            </h2>
            <p className="text-muted-foreground">{STEPS[currentStep].description}</p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm">
            Step {currentStep + 1} of {STEPS.length}
          </Badge>
        </div>
        
        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, index) => {
              return (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 min-w-fit",
                    index === currentStep
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg scale-[1.02]"
                      : index < currentStep
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:scale-[1.02]"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-[1.02]"
                  )}
                >
                  <div className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center text-xs",
                    index <= currentStep ? "bg-white/20" : "bg-current/20"
                  )}>
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      React.createElement(step.icon, { className: "h-4 w-4" })
                    )}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Card className="glass-card">
        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[400px]"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} className="h-11 px-6">
            Cancel
          </Button>
          {!isEditing && (
            <Button variant="outline" onClick={handleSaveAsDraft} className="h-11 px-6">
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {currentStep > 0 && (
            <Button variant="outline" onClick={handlePrevious} className="h-11 px-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
          
          {currentStep < STEPS.length - 1 ? (
            <Button onClick={handleNext} className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleLaunchCampaign} 
              className="h-11 px-8 bg-gradient-to-r from-primary to-primary/90 shadow-lg hover:shadow-xl"
            >
              <Rocket className="h-4 w-4 mr-2" />
              {isEditing ? "Update Campaign" : "Launch Campaign"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignCreator;
