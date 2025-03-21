import { useState } from "react";
import { Campaign, CONTENT_TYPES, CATEGORIES, CURRENCIES, Platform, ContentType, Category, Currency, DeliverableMode, DELIVERABLE_MODES, TikTokShopCommission, ExampleVideo, CountryOption } from "@/lib/campaign-types";
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
import { format } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ExternalLink, Plus, Trash, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import BannerImageUpload from "../BannerImageUpload";
import PlatformSelector from "../PlatformSelector";
import GuidelinesList from "../GuidelinesList";
import BriefUploader from "../BriefUploader";
import InstructionVideoUploader from "../InstructionVideoUploader";
import ExampleVideos from "../ExampleVideos";
import CountrySelector from "../CountrySelector";
import RequirementsList from "../RequirementsList";

interface RetainerFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
  showCreatorInfoSection?: boolean;
}

const RetainerForm = ({ campaign, onChange, showCreatorInfoSection = false }: RetainerFormProps) => {
  const [creatorTiers, setCreatorTiers] = useState<{ name: string; price: number }[]>(
    campaign.type === "retainer" && campaign.creatorTiers ? campaign.creatorTiers : [{ name: "Standard", price: 0 }]
  );
  
  const [deliverableMode, setDeliverableMode] = useState<DeliverableMode>(
    campaign.type === "retainer" && campaign.deliverables?.mode 
      ? campaign.deliverables.mode 
      : "videosPerDay"
  );
  
  const [videosPerDay, setVideosPerDay] = useState<number>(
    campaign.type === "retainer" && campaign.deliverables?.videosPerDay 
      ? campaign.deliverables.videosPerDay 
      : 1
  );
  
  const [durationDays, setDurationDays] = useState<number>(
    campaign.type === "retainer" && campaign.deliverables?.durationDays 
      ? campaign.deliverables.durationDays 
      : 30
  );
  
  const [totalVideos, setTotalVideos] = useState<number>(
    campaign.type === "retainer" && campaign.deliverables?.totalVideos 
      ? campaign.deliverables.totalVideos 
      : 30
  );
  
  const [trackingLink, setTrackingLink] = useState(campaign.trackingLink || "");
  const [requestTrackingLink, setRequestTrackingLink] = useState(campaign.requestedTrackingLink || false);

  const [brief, setBrief] = useState({
    type: campaign.brief?.type || 'link',
    value: campaign.brief?.value || ''
  });

  const [instructionVideo, setInstructionVideo] = useState<File | null>(campaign.instructionVideoFile || null);

  const [exampleVideos, setExampleVideos] = useState<ExampleVideo[]>(campaign.exampleVideos || []);

  const [tikTokShopCommission, setTikTokShopCommission] = useState<TikTokShopCommission>(
    campaign.tikTokShopCommission || {
      openCollabCommission: 0,
      increasedCommission: 0
    }
  );

  const handlePlatformSelect = (platform: Platform) => {
    onChange({ ...campaign, platforms: [platform] });
  };

  const isTikTokShop = campaign.platforms?.includes("TikTok Shop");

  const handleGuidelinesChange = (newGuidelines: { dos: string[], donts: string[] }) => {
    onChange({
      ...campaign,
      guidelines: newGuidelines
    });
  };

  const handleRequirementsChange = (requirements: string[]) => {
    onChange({
      ...campaign,
      requirements
    });
  };

  const handleAddTier = () => {
    const updatedTiers = [...creatorTiers, { name: `Tier ${creatorTiers.length + 1}`, price: 0 }];
    setCreatorTiers(updatedTiers);
    
    onChange({
      ...campaign,
      type: "retainer",
      creatorTiers: updatedTiers
    });
  };

  const handleRemoveTier = (index: number) => {
    if (creatorTiers.length > 1) {
      const updatedTiers = creatorTiers.filter((_, i) => i !== index);
      setCreatorTiers(updatedTiers);
      
      onChange({
        ...campaign,
        type: "retainer",
        creatorTiers: updatedTiers
      });
    }
  };

  const handleTierChange = (index: number, field: 'name' | 'price', value: string | number) => {
    const updatedTiers = [...creatorTiers];
    updatedTiers[index] = { 
      ...updatedTiers[index], 
      [field]: field === 'price' ? Number(value) : value 
    };
    
    setCreatorTiers(updatedTiers);
    
    onChange({
      ...campaign,
      type: "retainer",
      creatorTiers: updatedTiers
    });
  };

  const handleDeliverableModeChange = (mode: DeliverableMode) => {
    setDeliverableMode(mode);
    
    if (mode === "videosPerDay") {
      onChange({
        ...campaign,
        type: "retainer",
        deliverables: {
          mode: mode,
          videosPerDay,
          durationDays
        }
      });
    } else {
      onChange({
        ...campaign,
        type: "retainer",
        deliverables: {
          mode: mode,
          totalVideos
        }
      });
    }
  };

  const handleVideosPerDayChange = (value: number) => {
    setVideosPerDay(value);
    
    onChange({
      ...campaign,
      type: "retainer",
      deliverables: {
        mode: deliverableMode,
        videosPerDay: value,
        durationDays
      }
    });
  };

  const handleDurationDaysChange = (value: number) => {
    setDurationDays(value);
    
    onChange({
      ...campaign,
      type: "retainer",
      deliverables: {
        mode: deliverableMode,
        videosPerDay,
        durationDays: value
      }
    });
  };

  const handleTotalVideosChange = (value: number) => {
    setTotalVideos(value);
    
    onChange({
      ...campaign,
      type: "retainer",
      deliverables: {
        mode: deliverableMode,
        totalVideos: value
      }
    });
  };

  const handleTrackingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setTrackingLink(link);
    
    if (link) {
      setRequestTrackingLink(false);
      onChange({
        ...campaign,
        trackingLink: link,
        requestedTrackingLink: false
      });
    } else {
      onChange({
        ...campaign,
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
        trackingLink: "",
        requestedTrackingLink: true
      });
    } else {
      onChange({
        ...campaign,
        requestedTrackingLink: false
      });
    }
  };

  const handleBannerImageSelect = (imageUrl: string) => {
    onChange({
      ...campaign,
      bannerImage: imageUrl
    });
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
    onChange({
      ...campaign,
      instructionVideoFile: file
    });
  };

  const handleExampleVideosChange = (videos: ExampleVideo[]) => {
    onChange({
      ...campaign,
      exampleVideos: videos
    });
  };

  const handleCountryChange = (country: CountryOption) => {
    onChange({
      ...campaign,
      countryAvailability: country
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {!showCreatorInfoSection && (
          <BannerImageUpload 
            onImageSelect={handleBannerImageSelect}
            currentImage={campaign.bannerImage}
          />
        )}
        
        {!showCreatorInfoSection && (
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
        )}
        
        {!showCreatorInfoSection && (
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
        )}
        
        {!showCreatorInfoSection && (
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
            
            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">
                Application Deadline <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.type === "retainer" && campaign.applicationDeadline ? (
                      format(campaign.applicationDeadline, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={campaign.type === "retainer" ? campaign.applicationDeadline : undefined}
                    onSelect={(date) => onChange({ 
                      ...campaign, 
                      type: "retainer",
                      applicationDeadline: date as Date 
                    })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        
        {!showCreatorInfoSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endDate">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
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
                <PopoverContent className="w-auto p-0 bg-card" align="start">
                  <Calendar
                    mode="single"
                    selected={campaign.endDate}
                    onSelect={(date) => onChange({ ...campaign, endDate: date as Date })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        
        {!showCreatorInfoSection && (
          <PlatformSelector
            selectedPlatforms={campaign.platforms || []}
            onChange={handlePlatformSelect}
          />
        )}
        
        {!showCreatorInfoSection && (
          <CountrySelector 
            selectedCountry={campaign.countryAvailability || "worldwide"}
            onChange={handleCountryChange}
          />
        )}
        
        {/* Requirements moved to general information section */}
        {!showCreatorInfoSection && (
          <RequirementsList
            requirements={campaign.requirements || []}
            onChange={handleRequirementsChange}
          />
        )}
        
        {!showCreatorInfoSection && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Creator Tiers</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddTier}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tier
              </Button>
            </div>
            
            <div className="space-y-3">
              {creatorTiers.map((tier, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Tier name"
                    value={tier.name}
                    onChange={(e) => handleTierChange(index, 'name', e.target.value)}
                    className="flex-grow"
                  />
                  <div className="flex w-36">
                    <Input
                      type="number"
                      min={0}
                      placeholder="Price"
                      value={tier.price}
                      onChange={(e) => handleTierChange(index, 'price', e.target.value)}
                      className="rounded-r-none"
                    />
                    <div className="flex h-10 w-10 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted text-muted-foreground">
                      {campaign.currency || "USD"}
                    </div>
                  </div>
                  {creatorTiers.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveTier(index)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!showCreatorInfoSection && (
          <div className="space-y-4">
            <div>
              <Label>Deliverables</Label>
              <div className="flex mt-2 space-x-2">
                {DELIVERABLE_MODES.map((mode) => (
                  <Button
                    key={mode}
                    type="button"
                    variant={deliverableMode === mode ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeliverableModeChange(mode)}
                    className="flex-1"
                  >
                    {mode === "videosPerDay" ? "Videos Per Day" : "Total Videos"}
                  </Button>
                ))}
              </div>
            </div>
            
            {deliverableMode === "videosPerDay" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="videosPerDay">Videos Per Day</Label>
                  <Input
                    id="videosPerDay"
                    type="number"
                    min={1}
                    value={videosPerDay}
                    onChange={(e) => handleVideosPerDayChange(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="durationDays">Duration (Days)</Label>
                  <Input
                    id="durationDays"
                    type="number"
                    min={1}
                    value={durationDays}
                    onChange={(e) => handleDurationDaysChange(Number(e.target.value))}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="totalVideos">Total Videos</Label>
                <Input
                  id="totalVideos"
                  type="number"
                  min={1}
                  value={totalVideos}
                  onChange={(e) => handleTotalVideosChange(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Guidelines list moved to Creator Information section */}
        {showCreatorInfoSection && (
          <GuidelinesList
            dos={campaign.guidelines?.dos || []}
            donts={campaign.guidelines?.donts || []}
            onChange={handleGuidelinesChange}
          />
        )}
        
        {/* Creator info section */}
        {showCreatorInfoSection && (
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
        )}
        
        {/* TikTok Shop Commission */}
        {isTikTokShop && showCreatorInfoSection && (
          <div className="pt-4 border-t border-border/60">
            <h3 className="text-lg font-medium mb-4">TikTok Shop Commission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="openCollabCommission">Open Collab Commission %</Label>
                <Input
                  id="openCollabCommission"
                  type="number"
                  min={0}
                  max={100}
                  value={tikTokShopCommission.openCollabCommission}
                  onChange={(e) => handleTikTokShopCommissionChange("openCollabCommission", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="increasedCommission">Increased Commission %</Label>
                <Input
                  id="increasedCommission"
                  type="number"
                  min={0}
                  max={100}
                  value={tikTokShopCommission.increasedCommission}
                  onChange={(e) => handleTikTokShopCommissionChange("increasedCommission", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Example Videos */}
        {showCreatorInfoSection && (
          <div className="pt-4 border-t border-border/60">
            <ExampleVideos
              exampleVideos={campaign.exampleVideos || []}
              selectedPlatforms={campaign.platforms || []}
              onChange={handleExampleVideosChange}
            />
          </div>
        )}
        
        {/* Brief Uploader */}
        {showCreatorInfoSection && (
          <BriefUploader 
            briefType={brief.type}
            briefValue={brief.value}
            onBriefChange={handleBriefChange}
          />
        )}
        
        {/* Instruction Video Uploader */}
        {showCreatorInfoSection && (
          <InstructionVideoUploader
            videoFile={instructionVideo}
            onVideoChange={handleVideoChange}
          />
        )}
      </div>
    </div>
  );
};

export default RetainerForm;
