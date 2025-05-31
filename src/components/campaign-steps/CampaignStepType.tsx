import { Campaign } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Trophy, DollarSign, Users, Calendar, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CampaignFormErrors } from "@/lib/campaign-validation";

interface CampaignStepTypeProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  errors?: CampaignFormErrors;
}

const CAMPAIGN_TYPES = [
  {
    id: "retainer",
    title: "Retainer Campaign",
    description: "Work with creators on an ongoing basis",
    icon: Users,
    features: [
      "Long-term partnerships",
      "Regular content creation",
      "Application-based selection",
      "Fixed monthly payments"
    ],
    bestFor: "Building brand relationships and consistent content"
  },
  {
    id: "payPerView",
    title: "Pay Per View",
    description: "Pay creators based on their content performance",
    icon: Eye,
    features: [
      "Performance-based payments",
      "Immediate creator participation",
      "View-based compensation",
      "Scalable reach"
    ],
    bestFor: "Maximizing reach and paying for actual results",
    info: {
      title: "How Pay Per View Works",
      description: "All submissions will have 10 days to accumulate views after which the payment to the creators is automatically generated for Approved and pending payouts. Denied submissions will not receive a payout.",
      additionalInfo: "You can cap the payout per submission to have a more predictable budget spend."
    }
  },
  {
    id: "challenge",
    title: "Challenge Campaign",
    description: "Create a contest with prizes for the best content",
    icon: Trophy,
    features: [
      "Competition-based format",
      "Winner selection process",
      "Prize pool distribution",
      "High engagement potential"
    ],
    bestFor: "Viral campaigns and creative content generation"
  }
];

export default function CampaignStepType({ campaign, onChange, errors = {} }: CampaignStepTypeProps) {
  const handleTypeSelect = (type: "retainer" | "payPerView" | "challenge") => {
    onChange({ type });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Choose Your Campaign Type</h3>
        <p className="text-muted-foreground">
          Select the campaign model that best fits your goals and budget
        </p>
      </div>

      {errors.type && (
        <p className="text-sm font-medium text-destructive text-center">{errors.type}</p>
      )}

      <div className="grid gap-4">
        {CAMPAIGN_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = campaign.type === type.id;
          
          return (
            <Card
              key={type.id}
              className={`cursor-pointer transition-all border-2 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border/50 hover:border-border hover:shadow-sm"
              }`}
              onClick={() => handleTypeSelect(type.id as any)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold">{type.title}</h4>
                        <p className="text-muted-foreground">{type.description}</p>
                      </div>
                      {isSelected && (
                        <Badge className="bg-primary text-primary-foreground">
                          Selected
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-2 border-t border-border/30">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Best for:</span> {type.bestFor}
                      </p>
                    </div>

                    {type.info && (
                      <Alert className="mt-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-sm">
                          <div className="space-y-2">
                            <p className="font-medium text-blue-800 dark:text-blue-200">
                              {type.info.title}
                            </p>
                            <p className="text-blue-700 dark:text-blue-300">
                              {type.info.description}
                            </p>
                            <p className="text-blue-600 dark:text-blue-400 text-xs">
                              💡 {type.info.additionalInfo}
                            </p>
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
