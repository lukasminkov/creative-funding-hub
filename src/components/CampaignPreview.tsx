
import { motion } from "framer-motion";
import { Campaign, formatCurrency, getDaysLeft } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignPreviewProps {
  campaign: Partial<Campaign>;
}

const CampaignPreview = ({ campaign }: CampaignPreviewProps) => {
  const daysLeft = campaign.endDate ? getDaysLeft(campaign.endDate) : 0;
  const isPPV = campaign.type === "payPerView";
  const isRetainer = campaign.type === "retainer";
  const isChallenge = campaign.type === "challenge";
  
  const getRewardText = () => {
    if (isPPV && campaign.type === "payPerView") {
      return `${formatCurrency(campaign.ratePerThousand || 0, campaign.currency)} / 1K`;
    } else if (isRetainer) {
      return `${campaign.creatorTiers?.length || 0} Tiers`;
    } else if (isChallenge && campaign.type === "challenge") {
      return `${formatCurrency(campaign.prizePool?.firstPlace || 0, campaign.currency)} Top Prize`;
    }
    return "-";
  };

  const getPayoutText = () => {
    if (isPPV && campaign.type === "payPerView") {
      return formatCurrency(campaign.maxPayoutPerSubmission || 0, campaign.currency);
    } else if (isRetainer) {
      return "Fixed Rate";
    } else if (isChallenge) {
      return "Prize Pool";
    }
    return "-";
  };

  return (
    <div className="h-full">
      <Card className="h-full border border-border shadow-sm">
        <CardHeader className="border-b border-border/60 py-6 space-y-1.5">
          <CardTitle className="flex items-center justify-between">
            <span>Campaign Preview</span>
            <span className="text-sm font-normal text-muted-foreground">
              Live Update
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 flex flex-col h-full">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 bg-muted/50 rounded-lg p-6 text-center"
            >
              <div className="mb-3">
                <h3 className="text-lg font-medium">
                  {campaign.title || "Campaign Title"}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2">
                  {campaign.description || "Campaign description will appear here"}
                </p>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                We recommend uploading videos with a 16:9 aspect ratio
              </p>
              
              <Button variant="outline" className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload Tutorial
              </Button>
            </motion.div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 p-4 rounded-lg"
              >
                <h4 className="text-sm font-medium text-muted-foreground mb-2">PAID OUT</h4>
                <div className="flex flex-col">
                  <p className="text-sm font-medium">
                    {formatCurrency(0, campaign.currency)} of {formatCurrency(campaign.totalBudget || 0, campaign.currency)} paid out
                  </p>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-muted/50 p-4 rounded-lg"
              >
                <h4 className="text-sm font-medium text-muted-foreground mb-2">TIME LEFT</h4>
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <p className="text-sm font-medium">{daysLeft} days left</p>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ 
                        width: campaign.endDate 
                          ? `${Math.max(0, Math.min(100, (daysLeft / 30) * 100))}%` 
                          : "0%" 
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">REWARD</h4>
                <p className="font-medium text-sm">
                  {getRewardText()}
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">CONTENT TYPE</h4>
                <p className="font-medium text-sm">
                  {campaign.contentType || "-"}
                </p>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">CATEGORY</h4>
                <p className="font-medium text-sm">
                  {campaign.category || "-"}
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-4"
            >
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">MAX PAYOUT (PER SUBMISSION)</h4>
                <p className="font-medium text-sm">
                  {getPayoutText()}
                </p>
              </div>
            </motion.div>
            
            <div className="mt-auto pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <Clock className="inline-block mr-1 h-3 w-3 align-text-bottom" />
                {daysLeft > 0 
                  ? `Campaign ends in ${daysLeft} days` 
                  : "Set an end date for your campaign"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignPreview;
