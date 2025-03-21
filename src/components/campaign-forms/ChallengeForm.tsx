import { useState } from "react";
import { Campaign, CONTENT_TYPES, CATEGORIES, PLATFORMS, CURRENCIES, Platform, ContentType, Category, Currency, TikTokShopCommission, ExampleVideo } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Trophy, Plus, Trash2, Link as LinkIcon, Percent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import BannerImageUpload from "../BannerImageUpload";
import BriefUploader from "../BriefUploader";
import InstructionVideoUploader from "../InstructionVideoUploader";
import GuidelinesList from "../GuidelinesList";
import { Switch } from "@/components/ui/switch";
import ExampleVideos from "../ExampleVideos";
import CountrySelector from "../CountrySelector";
import { CountryOption } from "@/lib/campaign-types";

interface ChallengeFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
  showCreatorInfoSection?: boolean;
}

const ChallengeForm = ({ campaign, onChange, showCreatorInfoSection = false }: ChallengeFormProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(campaign.platforms || []);
  const [instructionVideo, setInstructionVideo] = useState<File | null>(campaign.instructionVideoFile || null);
  const [tikTokShopCommission, setTikTokShopCommission] = useState<TikTokShopCommission>(
    campaign.tikTokShopCommission || {
      openCollabCommission: 0,
      increasedCommission: 0
    }
  );
  
  const initialPlaces = campaign.type === "challenge" && campaign.prizePool 
    ? campaign.prizePool.places 
    : [
        { position: 1, prize: 1000 },
        { position: 2, prize: 500 },
        { position: 3, prize: 250 }
      ];
  
  const [places, setPlaces] = useState(initialPlaces);
  
  const handlePlatformToggle = (platform: Platform) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    onChange({ ...campaign, platforms: newPlatforms });
  };

  const hasTikTokShop = selectedPlatforms.includes("TikTok Shop");

  const handleTikTokShopCommissionChange = (field: keyof TikTokShopCommission, value: number) => {
    const newCommission = { ...tikTokShopCommission, [field]: value };
    setTikTokShopCommission(newCommission);
    onChange({
      ...campaign,
      tikTokShopCommission: newCommission
    });
  };

  const handleBannerImageSelect = (imageUrl: string) => {
    onChange({
      ...campaign,
      bannerImage: imageUrl
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

  const handleGuidelinesChange = (guidelines: { dos: string[]; donts: string[] }) => {
    onChange({
      ...campaign,
      guidelines
    });
  };

  const addPlace = () => {
    const nextPosition = Math.max(...places.map(p => p.position)) + 1;
    const newPlace = { position: nextPosition, prize: 100 };
    const updatedPlaces = [...places, newPlace];
    setPlaces(updatedPlaces);
    onChange({
      ...campaign,
      type: "challenge",
      prizePool: { places: updatedPlaces }
    });
  };

  const removePlace = (position: number) => {
    const updatedPlaces = places.filter(place => place.position !== position);
    setPlaces(updatedPlaces);
    onChange({
      ...campaign,
      type: "challenge",
      prizePool: { places: updatedPlaces }
    });
  };

  const updatePlace = (position: number, prize: number) => {
    const updatedPlaces = places.map(place => {
      if (place.position === position) {
        return { ...place, prize };
      }
      return place;
    });
    setPlaces(updatedPlaces);
    onChange({
      ...campaign,
      type: "challenge",
      prizePool: { places: updatedPlaces }
    });
  };

  const totalPrizePool = places.reduce((sum, place) => sum + place.prize, 0);

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

  const renderGeneralInfo = () => (
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
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={campaign.endDate}
                onSelect={(date) => onChange({ ...campaign, endDate: date || new Date() })}
                initialFocus
                disabled={(date) => date < new Date()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>
          Platforms <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((platform) => (
            <Badge
              key={platform}
              variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
              className={cn(
                "cursor-pointer hover:bg-primary/90 transition-all",
                selectedPlatforms.includes(platform) 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-background hover:text-primary-foreground"
              )}
              onClick={() => handlePlatformToggle(platform)}
            >
              {platform}
            </Badge>
          ))}
        </div>
      </div>
      
      <ExampleVideos
        exampleVideos={campaign.exampleVideos || []}
        selectedPlatforms={campaign.platforms || []}
        onChange={handleExampleVideosChange}
      />
      
      {hasTikTokShop && (
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
      
      <div className="pt-4 border-t border-border/60">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Prize Pool</h3>
          <div className="text-sm font-medium">
            Total: {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: campaign.currency || 'USD' 
            }).format(totalPrizePool)}
          </div>
        </div>
        
        <Card className="mb-6 overflow-hidden bg-muted/30">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              {places.slice(0, 3).map((place) => (
                <div key={place.position} className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className={cn(
                      "h-6 w-6",
                      place.position === 1 ? "text-yellow-500" : 
                      place.position === 2 ? "text-gray-400" : 
                      "text-amber-700"
                    )} />
                  </div>
                  <p className="text-sm font-medium mb-1">{place.position}st Place</p>
                  <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: campaign.currency || 'USD',
                    minimumFractionDigits: 0 
                  }).format(place.prize)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4">
          {places.map((place) => (
            <div key={place.position} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <span className="font-semibold">{place.position}</span>
              </div>
              <div className="flex-grow">
                <Input
                  type="number"
                  min={0}
                  value={place.prize}
                  onChange={(e) => updatePlace(place.position, Number(e.target.value))}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removePlace(place.position)}
                disabled={places.length <= 1}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))}
          
          {places.length < 10 && (
            <Button 
              variant="outline" 
              onClick={addPlace} 
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prize Place
            </Button>
          )}
        </div>
        
        <div className="mt-6 space-y-2">
          <Label htmlFor="submissionDeadline">
            Submission Deadline <span className="text-destructive">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {campaign.type === "challenge" && campaign.submissionDeadline ? (
                  format(campaign.submissionDeadline, "PPP")
                ) : (
                  <span>Pick a deadline</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={campaign.type === "challenge" ? campaign.submissionDeadline : undefined}
                onSelect={(date) => onChange({ 
                  ...campaign, 
                  type: "challenge", 
                  submissionDeadline: date || new Date() 
                })}
                initialFocus
                disabled={(date) => {
                  const now = new Date();
                  const maxDate = campaign.endDate || new Date();
                  return date < now || date > maxDate;
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">
            Deadline must be before the campaign end date
          </p>
        </div>
      </div>
    </div>
  );

  const renderCreatorInfo = () => (
    <div className="space-y-6">
      <ExampleVideos
        exampleVideos={campaign.exampleVideos || []}
        selectedPlatforms={campaign.platforms || []}
        onChange={handleExampleVideosChange}
      />
      
      <BriefUploader 
        briefType={campaign.brief?.type}
        briefValue={campaign.brief?.value}
        onBriefChange={handleBriefChange}
      />
      
      <InstructionVideoUploader
        videoFile={instructionVideo}
        onVideoChange={handleVideoChange}
      />
      
      <GuidelinesList
        dos={campaign.guidelines?.dos || []}
        donts={campaign.guidelines?.donts || []}
        onChange={handleGuidelinesChange}
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="trackingLink">{hasTikTokShop ? "TAP Link" : "Tracking Link"}</Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="requestedTrackingLink"
              checked={campaign.requestedTrackingLink || false}
              onCheckedChange={(checked) => 
                onChange({ ...campaign, requestedTrackingLink: checked })
              }
            />
            <Label htmlFor="requestedTrackingLink" className="text-sm text-muted-foreground">
              Request from Payper
            </Label>
          </div>
        </div>
        <div className="flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
          </div>
          <Input
            id="trackingLink"
            placeholder={hasTikTokShop ? "Enter TAP link" : "Enter tracking link"}
            value={campaign.trackingLink || ""}
            onChange={(e) => onChange({ ...campaign, trackingLink: e.target.value })}
            className="rounded-l-none"
            disabled={campaign.requestedTrackingLink}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          {campaign.requestedTrackingLink 
            ? hasTikTokShop
              ? "Payper will provide a TAP link for your campaign"
              : "Payper will provide a tracking link for your campaign" 
            : hasTikTokShop
              ? "Provide a TAP link for creators to use in their content"
              : "Provide a link for creators to use in their content"}
        </p>
      </div>
    </div>
  );

  if (showCreatorInfoSection) {
    return renderCreatorInfo();
  }
  
  return renderGeneralInfo();
};

export default ChallengeForm;
