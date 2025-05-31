
import React from "react";
import { Campaign, RetainerCampaign, Platform, DeliverableMode, DELIVERABLE_MODES, CreatorTier } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RetainerForm from "@/components/campaign-forms/RetainerForm";
import PayPerViewForm from "@/components/campaign-forms/PayPerViewForm";
import ChallengeForm from "@/components/campaign-forms/ChallengeForm";

interface CampaignStepDetailsProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
}

const CampaignStepDetails = ({ campaign, onChange }: CampaignStepDetailsProps) => {
  const handleAddCreatorTier = () => {
    const retainerCampaign = campaign as Partial<RetainerCampaign>;
    const tiers = [...(retainerCampaign.creatorTiers || [])];
    tiers.push({ name: "", price: 0 });
    onChange({ creatorTiers: tiers });
  };

  const handleUpdateCreatorTier = (index: number, field: keyof CreatorTier, value: string | number) => {
    const retainerCampaign = campaign as Partial<RetainerCampaign>;
    const tiers = [...(retainerCampaign.creatorTiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    onChange({ creatorTiers: tiers });
  };

  const handleRemoveCreatorTier = (index: number) => {
    const retainerCampaign = campaign as Partial<RetainerCampaign>;
    const tiers = [...(retainerCampaign.creatorTiers || [])];
    tiers.splice(index, 1);
    onChange({ creatorTiers: tiers });
  };

  const handleDeliverableModeChange = (mode: DeliverableMode) => {
    const retainerCampaign = campaign as Partial<RetainerCampaign>;
    onChange({
      deliverables: {
        ...retainerCampaign.deliverables,
        mode,
      },
    });
  };

  // Render different forms based on campaign type
  if (campaign.type === "retainer") {
    const retainerCampaign = campaign as Partial<RetainerCampaign>;
    
    return (
      <div className="space-y-6">
        {/* Standard retainer form for platform selection and requirements */}
        <RetainerForm
          campaign={retainerCampaign}
          onChange={onChange}
          showCreatorInfoSection={false}
        />

        {/* Retainer-specific sections for step 3 */}
        <div className="space-y-6">
          {/* Payout Tiers Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Payout Structure
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddCreatorTier}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Tier
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(retainerCampaign.creatorTiers || []).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No payout tiers defined. Add tiers to set different pricing levels for creators (e.g., Micro, Macro, Celebrity).
                </p>
              )}
              
              {(retainerCampaign.creatorTiers || []).map((tier, index) => (
                <div 
                  key={index} 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-border rounded-md bg-muted/20"
                >
                  <FormItem className="space-y-2">
                    <Label htmlFor={`tier-${index}-name`}>Tier Name</Label>
                    <Input
                      id={`tier-${index}-name`}
                      value={tier.name}
                      onChange={(e) => handleUpdateCreatorTier(index, "name", e.target.value)}
                      placeholder="e.g. Micro, Macro, Celebrity"
                    />
                  </FormItem>
                  
                  <FormItem className="space-y-2">
                    <Label htmlFor={`tier-${index}-price`}>Payout Amount ($)</Label>
                    <Input
                      id={`tier-${index}-price`}
                      type="number"
                      min="0"
                      value={tier.price}
                      onChange={(e) => handleUpdateCreatorTier(index, "price", Number(e.target.value))}
                      placeholder="Payment amount"
                    />
                  </FormItem>
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => handleRemoveCreatorTier(index)}
                      className="h-10 w-10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Deliverable Requirements Section */}
          <Card>
            <CardHeader>
              <CardTitle>Submission Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormItem className="space-y-2">
                <Label>Deliverable Structure <span className="text-destructive">*</span></Label>
                <Select
                  value={retainerCampaign.deliverables?.mode || "videosPerDay"}
                  onValueChange={(value) => handleDeliverableModeChange(value as DeliverableMode)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select deliverable mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERABLE_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode === "videosPerDay" ? "Videos Per Day" : "Total Videos"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>

              {retainerCampaign.deliverables?.mode === "videosPerDay" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem className="space-y-2">
                    <Label htmlFor="videosPerDay">
                      Videos Per Day <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="videosPerDay"
                      type="number"
                      min="1"
                      value={retainerCampaign.deliverables?.videosPerDay || ""}
                      onChange={(e) => onChange({
                        deliverables: {
                          ...retainerCampaign.deliverables,
                          videosPerDay: Number(e.target.value),
                        },
                      })}
                      placeholder="Number of videos per day"
                    />
                  </FormItem>
                  
                  <FormItem className="space-y-2">
                    <Label htmlFor="durationDays">
                      Duration (days) <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="durationDays"
                      type="number"
                      min="1"
                      value={retainerCampaign.deliverables?.durationDays || ""}
                      onChange={(e) => onChange({
                        deliverables: {
                          ...retainerCampaign.deliverables,
                          durationDays: Number(e.target.value),
                        },
                      })}
                      placeholder="Number of days"
                    />
                  </FormItem>
                </div>
              )}

              {retainerCampaign.deliverables?.mode === "totalVideos" && (
                <FormItem className="space-y-2">
                  <Label htmlFor="totalVideos">
                    Total Videos <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="totalVideos"
                    type="number"
                    min="1"
                    value={retainerCampaign.deliverables?.totalVideos || ""}
                    onChange={(e) => onChange({
                      deliverables: {
                        ...retainerCampaign.deliverables,
                        totalVideos: Number(e.target.value),
                      },
                    })}
                    placeholder="Total number of videos"
                  />
                </FormItem>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // For other campaign types, render their respective forms
  if (campaign.type === "payPerView") {
    return (
      <PayPerViewForm
        campaign={campaign}
        onChange={onChange}
        showCreatorInfoSection={false}
      />
    );
  }

  if (campaign.type === "challenge") {
    return (
      <ChallengeForm
        campaign={campaign}
        onChange={onChange}
        showCreatorInfoSection={false}
      />
    );
  }

  return null;
};

export default CampaignStepDetails;
