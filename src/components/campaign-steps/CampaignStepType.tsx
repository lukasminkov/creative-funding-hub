
import { Campaign } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Eye, Trophy, DollarSign, Users, Calendar } from "lucide-react";

interface CampaignStepTypeProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
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
    bestFor: "Maximizing reach and paying for actual results"
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

export default function CampaignStepType({ campaign, onChange }: CampaignStepTypeProps) {
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
