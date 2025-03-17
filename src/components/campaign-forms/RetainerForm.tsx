
import { useState } from "react";
import { X, Plus, Link2, ExternalLink, Percent } from "lucide-react";
import { Campaign, CONTENT_TYPES, CATEGORIES, CURRENCIES, CreatorTier, Platform, ContentType, Category, Currency, TikTokShopCommission } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Switch 
} from "@/components/ui/switch";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { CalendarIcon } from "lucide-react";
import BannerImageUpload from "../BannerImageUpload";
import PlatformSelector from "../PlatformSelector";
import RequirementsList from "../RequirementsList";
import GuidelinesList from "../GuidelinesList";
import BriefUploader from "../BriefUploader";
import InstructionVideoUploader from "../InstructionVideoUploader";

interface RetainerFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
}

const RetainerForm = ({ campaign, onChange }: RetainerFormProps) => {
  const [creatorTiers, setCreatorTiers] = useState<CreatorTier[]>(
    campaign.type === "retainer" && campaign.creatorTiers 
      ? campaign.creatorTiers 
      : [{ name: "Basic", price: 500 }]
  );
  
  const [deliverables, setDeliverables] = useState({
    videosPerDay: campaign.type === "retainer" && campaign.deliverables 
      ? campaign.deliverables.videosPerDay 
      : 1,
    durationDays: campaign.type === "retainer" && campaign.deliverables 
      ? campaign.deliverables.durationDays 
      : 30
  });

  const [requirements, setRequirements] = useState<string[]>(
    campaign.type === "retainer" && campaign.requirements
      ? campaign.requirements
      : []
  );

  const [guidelines, setGuidelines] = useState({
    dos: campaign.type === "retainer" && campaign.guidelines
      ? campaign.guidelines.dos
      : [],
    donts: campaign.type === "retainer" && campaign.guidelines
      ? campaign.guidelines.donts
      : []
  });

  const [trackingLink, setTrackingLink] = useState(
    campaign.type === "retainer" ? campaign.trackingLink || "" : ""
  );

  const [requestTrackingLink, setRequestTrackingLink] = useState(
    campaign.type === "retainer" ? campaign.requestedTrackingLink || false : false
  );

  const [applicationDeadline, setApplicationDeadline] = useState<Date>(
    campaign.type === "retainer" && campaign.applicationDeadline
      ? campaign.applicationDeadline
      : new Date()
  );

  const [brief, setBrief] = useState({
    type: campaign.brief?.type || 'link',
    value: campaign.brief?.value || ''
  });

  const [instructionVideo, setInstructionVideo] = useState<File | null>(campaign.instructionVideoFile || null);

  const minEndDate = addDays(applicationDeadline, 30);
  
  const [tikTokShopCommission, setTikTokShopCommission] = useState<TikTokShopCommission>(
    campaign.tikTokShopCommission || {
      openCollabCommission: 0,
      increasedCommission: 0
    }
  );

  const handlePlatformSelect = (platform: Platform) => {
    onChange({ ...campaign, platforms: [platform] });
  };

  const isTikTokShop = campaign.platforms?.[0] === "TikTok Shop";

  const addCreatorTier = () => {
    const newTier: CreatorTier = {
      name: `Tier ${creatorTiers.length + 1}`,
      price: 0
    };
    const updatedTiers = [...creatorTiers, newTier];
    setCreatorTiers(updatedTiers);
    onChange({ 
      ...campaign, 
      type: "retainer", 
      creatorTiers: updatedTiers 
    });
  };

  const removeCreatorTier = (index: number) => {
    if (creatorTiers.length === 1) return;
    
    const updatedTiers = creatorTiers.filter((_, i) => i !== index);
    setCreatorTiers(updatedTiers);
    onChange({ 
      ...campaign, 
      type: "retainer", 
      creatorTiers: updatedTiers 
    });
  };

  const updateCreatorTier = (index: number, field: keyof CreatorTier, value: string | number) => {
    const updatedTiers = creatorTiers.map((tier, i) => {
      if (i === index) {
        return { ...tier, [field]: value };
      }
      return tier;
    });
    
    setCreatorTiers(updatedTiers);
    onChange({ 
      ...campaign, 
      type: "retainer", 
      creatorTiers: updatedTiers 
    });
  };

  const updateDeliverables = (field: keyof typeof deliverables, value: number) => {
    const updatedDeliverables = { ...deliverables, [field]: value };
    setDeliverables(updatedDeliverables);
    onChange({ 
      ...campaign, 
      type: "retainer", 
      deliverables: updatedDeliverables 
    });
  };

  const handleRequirementsChange = (newRequirements: string[]) => {
    setRequirements(newRequirements);
    onChange({
      ...campaign,
      type: "retainer",
      requirements: newRequirements
    });
  };

  const handleGuidelinesChange = (newGuidelines: { dos: string[], donts: string[] }) => {
    setGuidelines(newGuidelines);
    onChange({
      ...campaign,
      type: "retainer",
      guidelines: newGuidelines
    });
  };

  const handleApplicationDeadlineChange = (date: Date | undefined) => {
    if (!date) return;
    
    setApplicationDeadline(date);
    
    const currentEndDate = campaign.endDate;
    if (!currentEndDate || currentEndDate < addDays(date, 30)) {
      onChange({
        ...campaign,
        type: "retainer",
        applicationDeadline: date,
        endDate: addDays(date, 30)
      });
    } else {
      onChange({
        ...campaign,
        type: "retainer",
        applicationDeadline: date
      });
    }
  };

  const handleBannerImageSelect = (imageUrl: string) => {
    onChange({
      ...campaign,
      bannerImage: imageUrl
    });
  };

  const handleTrackingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setTrackingLink(link);
    
    if (link) {
      setRequestTrackingLink(false);
      onChange({
        ...campaign,
        type: "retainer",
        trackingLink: link,
        requestedTrackingLink: false
      });
    } else {
      onChange({
        ...campaign,
        type: "retainer",
        trackingLink: "",
        requestedTrackingLink: requestTrackingLink
      });
    }
  };

  const handleRequestTrackingLinkChange = (checked: boolean) => {
    setRequestTrackingLink(checked);
    
    if (checked) {
      setTrackingLink("");
      onChange({
        ...campaign,
        type: "retainer",
        trackingLink: "",
        requestedTrackingLink: true
      });
    } else {
      onChange({
        ...campaign,
        type: "retainer",
        requestedTrackingLink: false
      });
    }
  };

  const handleTikTokShopCommissionChange = (field: keyof TikTokShopCommission, value: number) => {
    const newCommission = { ...tikTokShopCommission, [field]: value };
    setTikTokShopCommission(newCommission);
    onChange({
      ...campaign,
      tikTokShopCommission: newCommission
    });
  };

  const handleBriefChange = (type: 'link' | 'file', value: string) => {
    onChange({
      ...campaign,
      brief: { type, value }
    });
  };

  const handleVideoChange = (file: File | null) => {
    setInstructionVideo(file);
    onChange({
      ...campaign,
      instructionVideoFile: file
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <BannerImageUpload 
          onImageSelect={handleBannerImageSelect}
          currentImage={campaign.bannerImage}
        />
        
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Campaign Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter campaign title"
              value={campaign.title || ""}
              onChange={(e) => onChange({ ...campaign, title: e.target.value })}
              className="placeholder-animate"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              placeholder="Enter campaign description"
              rows={3}
              value={campaign.description || ""}
              onChange={(e) => onChange({ ...campaign, description: e.target.value })}
              className="placeholder-animate"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contentType">
              Content Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={campaign.contentType || ""}
              onValueChange={(value) => onChange({ ...campaign, contentType: value as ContentType })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose type" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {CONTENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={campaign.category || ""}
              onValueChange={(value) => onChange({ ...campaign, category: value as Category })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="budget">
                Total Budget <span className="text-destructive">*</span>
              </Label>
            </div>
            <div className="flex">
              <Input
                id="budget"
                type="number"
                min={0}
                placeholder="Enter budget"
                value={campaign.totalBudget || ""}
                onChange={(e) => onChange({ ...campaign, totalBudget: Number(e.target.value) })}
                className="rounded-r-none"
              />
              <Select
                value={campaign.currency || "USD"}
                onValueChange={(value) => onChange({ ...campaign, currency: value as Currency })}
              >
                <SelectTrigger className="w-24 rounded-l-none border-l-0">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <PlatformSelector
          selectedPlatform={campaign.platforms?.[0] || undefined}
          onChange={handlePlatformSelect}
          singleSelection={true}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="applicationDeadline">
              Application Deadline <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="applicationDeadline"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {applicationDeadline ? (
                    format(applicationDeadline, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={applicationDeadline}
                  onSelect={handleApplicationDeadlineChange}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endDate">
              Campaign End <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="endDate"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {campaign.endDate ? (
                    format(campaign.endDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={campaign.endDate}
                  onSelect={(date) => onChange({ ...campaign, endDate: date || new Date() })}
                  initialFocus
                  disabled={(date) => date < minEndDate}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Must be at least 30 days after application deadline
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>{isTikTokShop ? "TAP Link" : "Tracking Link"}</Label>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex">
                <div className="flex-grow relative">
                  <Input
                    type="url"
                    placeholder={isTikTokShop ? "Enter TAP link" : "Enter tracking link"}
                    value={trackingLink}
                    onChange={handleTrackingLinkChange}
                    disabled={requestTrackingLink}
                    className={requestTrackingLink ? "bg-muted text-muted-foreground" : ""}
                  />
                  {trackingLink && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={trackingLink.startsWith('http') ? trackingLink : `https://${trackingLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open link</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="request-tracking"
                  checked={requestTrackingLink}
                  onCheckedChange={handleRequestTrackingLinkChange}
                />
                <Label htmlFor="request-tracking" className="text-sm cursor-pointer">
                  {isTikTokShop ? "I don't have a TAP link, please provide one" : "I don't have a tracking link, please provide one"}
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {isTikTokShop && (
          <div className="pt-4 border-t border-border/60">
            <h3 className="text-lg font-medium mb-4">TikTok Shop Commission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openCollabCommission">Open Collab Commission %</Label>
                <div className="flex">
                  <Input
                    id="openCollabCommission"
                    type="number"
                    min={0}
                    max={100}
                    value={tikTokShopCommission.openCollabCommission}
                    onChange={(e) => handleTikTokShopCommissionChange("openCollabCommission", Number(e.target.value))}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                    <Percent className="h-4 w-4" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="increasedCommission">Increased Commission %</Label>
                <div className="flex">
                  <Input
                    id="increasedCommission"
                    type="number"
                    min={0}
                    max={100}
                    value={tikTokShopCommission.increasedCommission}
                    onChange={(e) => handleTikTokShopCommissionChange("increasedCommission", Number(e.target.value))}
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                    <Percent className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <BriefUploader 
          briefType={brief.type}
          briefValue={brief.value}
          onBriefChange={handleBriefChange}
        />
        
        <InstructionVideoUploader
          videoFile={instructionVideo}
          onVideoChange={handleVideoChange}
        />
        
        <RequirementsList
          requirements={requirements}
          onChange={handleRequirementsChange}
          maxItems={5}
        />
        
        <GuidelinesList
          dos={guidelines.dos}
          donts={guidelines.donts}
          onChange={handleGuidelinesChange}
        />
        
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Creator Tiers</h3>
            <Button size="sm" variant="outline" onClick={addCreatorTier}>
              <Plus className="h-4 w-4 mr-1" /> Add Tier
            </Button>
          </div>
          
          <AnimatePresence>
            {creatorTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-4"
              >
                <Card>
                  <CardHeader className="py-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {tier.name}
                      </CardTitle>
                      {creatorTiers.length > 1 && (
                        <Button size="icon" variant="ghost" onClick={() => removeCreatorTier(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`tier-${index}-name`}>Tier Name</Label>
                        <Input
                          id={`tier-${index}-name`}
                          value={tier.name}
                          onChange={(e) => updateCreatorTier(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`tier-${index}-price`}>Price ({campaign.currency})</Label>
                        <Input
                          id={`tier-${index}-price`}
                          type="number"
                          min={0}
                          value={tier.price}
                          onChange={(e) => updateCreatorTier(index, "price", Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <div className="pt-4 border-t border-border/60">
          <h3 className="text-lg font-medium mb-4">Deliverables</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="videosPerDay">Videos Per Day</Label>
              <Input
                id="videosPerDay"
                type="number"
                min={1}
                value={deliverables.videosPerDay}
                onChange={(e) => updateDeliverables("videosPerDay", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="durationDays">Duration (Days)</Label>
              <Input
                id="durationDays"
                type="number"
                min={1}
                value={deliverables.durationDays}
                onChange={(e) => updateDeliverables("durationDays", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetainerForm;
