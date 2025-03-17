import { useState } from "react";
import { Campaign, CONTENT_TYPES, CATEGORIES, PLATFORMS, CURRENCIES } from "@/lib/campaign-types";
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
import { CalendarIcon, Trophy, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import BannerImageUpload from "../BannerImageUpload";
import BriefUploader from "../BriefUploader";
import InstructionVideoUploader from "../InstructionVideoUploader";

interface ChallengeFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
}

const ChallengeForm = ({ campaign, onChange }: ChallengeFormProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaign.platforms || []);
  const [instructionVideo, setInstructionVideo] = useState<File | null>(campaign.instructionVideoFile || null);
  
  const initialPlaces = campaign.type === "challenge" && campaign.prizePool 
    ? campaign.prizePool.places 
    : [
        { position: 1, prize: 1000 },
        { position: 2, prize: 500 },
        { position: 3, prize: 250 }
      ];
  
  const [places, setPlaces] = useState(initialPlaces);
  
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    onChange({ ...campaign, platforms: newPlatforms });
  };

  const addPlace = () => {
    if (places.length >= 10) return;
    
    const newPosition = places.length + 1;
    const newPlaces = [...places, { position: newPosition, prize: 100 }];
    
    setPlaces(newPlaces);
    updatePrizePool(newPlaces);
  };

  const removePlace = (position: number) => {
    if (places.length <= 1) return;
    
    const filteredPlaces = places.filter(place => place.position !== position);
    
    const reindexedPlaces = filteredPlaces.map((place, index) => ({
      ...place,
      position: index + 1
    }));
    
    setPlaces(reindexedPlaces);
    updatePrizePool(reindexedPlaces);
  };

  const updatePlace = (position: number, prize: number) => {
    const updatedPlaces = places.map(place => {
      if (place.position === position) {
        return { ...place, prize };
      }
      return place;
    });
    
    setPlaces(updatedPlaces);
    updatePrizePool(updatedPlaces);
  };

  const updatePrizePool = (updatedPlaces: typeof places) => {
    onChange({
      ...campaign,
      type: "challenge",
      prizePool: {
        places: updatedPlaces
      }
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

  const totalPrizePool = places.reduce((sum, place) => sum + place.prize, 0);

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
              onValueChange={(value) => onChange({ ...campaign, contentType: value })}
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
              onValueChange={(value) => onChange({ ...campaign, category: value })}
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
                onValueChange={(value) => onChange({ ...campaign, currency: value })}
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
        
        <BriefUploader 
          briefType={campaign.brief?.type}
          briefValue={campaign.brief?.value}
          onBriefChange={handleBriefChange}
        />
        
        <InstructionVideoUploader
          videoFile={instructionVideo}
          onVideoChange={handleVideoChange}
        />
        
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
    </div>
  );
};

export default ChallengeForm;
