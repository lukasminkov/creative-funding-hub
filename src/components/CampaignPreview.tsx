
import { motion } from "framer-motion";
import { Campaign, formatCurrency, getDaysLeft } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      return `${campaign.prizePool?.places.length || 0} Winners`;
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
              className="mb-6 bg-muted/50 rounded-lg p-6 text-center relative"
            >
              {campaign.bannerImage && (
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <img 
                    src={campaign.bannerImage} 
                    alt="Campaign banner" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60"></div>
                </div>
              )}
              
              <div className={`mb-3 relative ${campaign.bannerImage ? 'text-white' : ''}`}>
                <h3 className="text-lg font-medium">
                  {campaign.title || "Campaign Title"}
                </h3>
                <p className={`${campaign.bannerImage ? 'text-white/80' : 'text-muted-foreground'} text-sm line-clamp-2`}>
                  {campaign.description || "Campaign description will appear here"}
                </p>
              </div>
              
              <p className={`text-sm ${campaign.bannerImage ? 'text-white/70' : 'text-muted-foreground'} mt-4 relative`}>
                {campaign.type === "challenge" ? "Submit your best content to win prizes" 
                : "We're looking for creators to partner with"}
              </p>
              
              <Button variant="outline" className={`mt-4 gap-2 relative ${campaign.bannerImage ? 'bg-white hover:bg-white/90' : ''}`}>
                <Upload className="h-4 w-4" />
                {isChallenge ? "Submit Entry" : "Apply Now"}
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
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  {isRetainer ? "REQUIREMENTS" : 
                   isChallenge ? "TOP PRIZE" : 
                   "MAX PAYOUT (PER SUBMISSION)"}
                </h4>
                {isRetainer && campaign.type === "retainer" && campaign.requirements && campaign.requirements.length > 0 ? (
                  <div className="space-y-2">
                    {campaign.requirements.slice(0, 2).map((req, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                        <p className="text-sm">
                          {req}
                        </p>
                      </div>
                    ))}
                    {campaign.requirements.length > 2 && (
                      <p className="text-xs text-muted-foreground">
                        +{campaign.requirements.length - 2} more requirements
                      </p>
                    )}
                  </div>
                ) : isChallenge && campaign.type === "challenge" && campaign.prizePool ? (
                  <p className="font-medium text-sm">
                    {campaign.prizePool.places && campaign.prizePool.places.length > 0 
                      ? formatCurrency(campaign.prizePool.places[0].prize, campaign.currency) 
                      : "-"}
                  </p>
                ) : (
                  <p className="font-medium text-sm">
                    {getPayoutText()}
                  </p>
                )}
              </div>
            </motion.div>
            
            {isRetainer && campaign.type === "retainer" && campaign.guidelines && 
             (campaign.guidelines.dos.length > 0 || campaign.guidelines.donts.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-4"
              >
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">GUIDELINES</h4>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.guidelines.dos.length > 0 && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-200">
                        {campaign.guidelines.dos.length} Do's
                      </Badge>
                    )}
                    {campaign.guidelines.donts.length > 0 && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200">
                        {campaign.guidelines.donts.length} Don'ts
                      </Badge>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {campaign.platforms && campaign.platforms.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">PLATFORMS</h4>
                  <div className="flex gap-2 flex-wrap">
                    {campaign.platforms.map((platform) => (
                      <Badge key={platform} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="mt-auto pt-6">
              <p className="text-sm text-muted-foreground text-center">
                <Clock className="inline-block mr-1 h-3 w-3 align-text-bottom" />
                {isRetainer && campaign.type === "retainer" && campaign.applicationDeadline 
                  ? `Applications close in ${getDaysLeft(campaign.applicationDeadline)} days` 
                  : isChallenge && campaign.type === "challenge" && campaign.submissionDeadline
                  ? `Submissions close in ${getDaysLeft(campaign.submissionDeadline)} days`
                  : daysLeft > 0 
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
