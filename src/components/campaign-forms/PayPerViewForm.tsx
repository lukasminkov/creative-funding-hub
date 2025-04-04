import { useState } from "react";
import { Campaign, CONTENT_TYPES, CATEGORIES, CURRENCIES, Platform, ContentType, Category, Currency, TikTokShopCommission, ExampleVideo } from "@/lib/campaign-types";
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
import { CalendarIcon, ExternalLink, Percent } from "lucide-react";
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
import { CountryOption } from "@/lib/campaign-types";

interface PayPerViewFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
  showCreatorInfoSection?: boolean;
}

const PayPerViewForm = ({ campaign, onChange, showCreatorInfoSection = false }: PayPerViewFormProps) => {
  const [ratePerThousand, setRatePerThousand] = useState<number>(
    campaign.type === "payPerView" && "ratePerThousand" in campaign 
      ? campaign.ratePerThousand 
      : 0
  );
  
  const [maxPayoutPerSubmission, setMaxPayoutPerSubmission] = useState<number>(
    campaign.type === "payPerView" && "maxPayoutPerSubmission" in campaign 
      ? campaign.maxPayoutPerSubmission 
      : 0
  );

  const [guidelines, setGuidelines] = useState({
    dos: campaign.guidelines ? campaign.guidelines.dos : [],
    donts: campaign.guidelines ? campaign.guidelines.donts : []
  });

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

  const isTikTokShop = campaign.platforms?.[0] === "TikTok Shop";

  const handleGuidelinesChange = (newGuidelines: { dos: string[], donts: string[] }) => {
    setGuidelines(newGuidelines);
    onChange({
      ...campaign,
      type: "payPerView",
      guidelines: newGuidelines
    });
  };

  const handleRatePerThousandChange = (value: number) => {
    setRatePerThousand(value);
    onChange({
      ...campaign,
      type: "payPerView",
      ratePerThousand: value
    });
  };

  const handleMaxPayoutChange = (value: number) => {
    setMaxPayoutPerSubmission(value);
    onChange({
      ...campaign,
      type: "payPerView",
      maxPayoutPerSubmission: value
    });
  };

  const handleTrackingLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setTrackingLink(link);
    
    if (link) {
      setRequestTrackingLink(false);
      onChange({
        ...campaign,
        type: "payPerView",
        trackingLink: link,
        requestedTrackingLink: false
      });
    } else {
      onChange({
        ...campaign,
        type: "payPerView",
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
        type: "payPerView",
        trackingLink: "",
        requestedTrackingLink: true
      });
    } else {
      onChange({
        ...campaign,
        type: "payPerView",
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

  const handleRequirementsChange = (requirements: string[]) => {
    onChange({
      ...campaign,
      requirements
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
              <Label htmlFor="endDate">
                End Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                    id="endDate"
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
                    onSelect={(date) => onChange({
                      ...campaign,
                      endDate: date
                    })}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
        
        {!showCreatorInfoSection && (
          <PlatformSelector
            selectedPlatform={campaign.platforms?.[0] || undefined}
            onChange={handlePlatformSelect}
            singleSelection={true}
          />
        )}
        
        {!showCreatorInfoSection && (
          <CountrySelector 
            selectedCountry={campaign.countryAvailability || "worldwide"}
            onChange={handleCountryChange}
          />
        )}
        
        {!showCreatorInfoSection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ratePerThousand">
                Rate per 1000 Views <span className="text-destructive">*</span>
              </Label>
              <Input
                id="ratePerThousand"
                type="number"
                min={0}
                placeholder="Enter rate"
                value={ratePerThousand}
                onChange={(e) => handleRatePerThousandChange(Number(e.target.value))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPayout">
                Max Payout per Submission <span className="text-destructive">*</span>
              </Label>
              <Input
                id="maxPayout"
                type="number"
                min={0}
                placeholder="Enter max payout"
                value={maxPayoutPerSubmission}
                onChange={(e) => handleMaxPayoutChange(Number(e.target.value))}
                required
              />
            </div>
          </div>
        )}
        
        {!showCreatorInfoSection && (
          <RequirementsList
            requirements={campaign.requirements || []}
            onChange={handleRequirementsChange}
          />
        )}
        
        {showCreatorInfoSection && (
          <GuidelinesList
            dos={guidelines.dos}
            donts={guidelines.donts}
            onChange={handleGuidelinesChange}
          />
        )}
        
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
        
        {isTikTokShop && showCreatorInfoSection && (
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
        
        {showCreatorInfoSection && (
          <div className="pt-4 border-t border-border/60">
            <ExampleVideos
              exampleVideos={campaign.exampleVideos || []}
              selectedPlatforms={campaign.platforms || []}
              onChange={handleExampleVideosChange}
            />
          </div>
        )}
        
        {showCreatorInfoSection && (
          <BriefUploader 
            briefType={brief.type}
            briefValue={brief.value}
            onBriefChange={handleBriefChange}
          />
        )}
        
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

export default PayPerViewForm;
