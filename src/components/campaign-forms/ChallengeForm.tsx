
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
import { CalendarIcon, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ChallengeFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
}

const ChallengeForm = ({ campaign, onChange }: ChallengeFormProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaign.platforms || []);
  const [prizePool, setPrizePool] = useState({
    firstPlace: campaign.type === "challenge" && campaign.prizePool ? campaign.prizePool.firstPlace : 1000,
    secondPlace: campaign.type === "challenge" && campaign.prizePool ? campaign.prizePool.secondPlace : 500,
    thirdPlace: campaign.type === "challenge" && campaign.prizePool ? campaign.prizePool.thirdPlace : 250,
    runnerUps: campaign.type === "challenge" && campaign.prizePool ? campaign.prizePool.runnerUps : 100,
    runnerUpsCount: campaign.type === "challenge" && campaign.prizePool ? campaign.prizePool.runnerUpsCount : 5
  });
  
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    onChange({ ...campaign, platforms: newPlatforms });
  };

  const updatePrizePool = (field: keyof typeof prizePool, value: number) => {
    const updatedPrizePool = { ...prizePool, [field]: value };
    setPrizePool(updatedPrizePool);
    onChange({
      ...campaign,
      type: "challenge",
      prizePool: updatedPrizePool
    });
  };

  // Calculate total prize pool
  const totalPrizePool = 
    prizePool.firstPlace + 
    prizePool.secondPlace + 
    prizePool.thirdPlace + 
    (prizePool.runnerUps * prizePool.runnerUpsCount);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
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
                <div className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <p className="text-sm font-medium mb-1">1st Place</p>
                  <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: campaign.currency || 'USD',
                    minimumFractionDigits: 0 
                  }).format(prizePool.firstPlace)}</p>
                </div>
                <div className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium mb-1">2nd Place</p>
                  <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: campaign.currency || 'USD',
                    minimumFractionDigits: 0 
                  }).format(prizePool.secondPlace)}</p>
                </div>
                <div className="p-4 text-center">
                  <div className="flex justify-center mb-2">
                    <Trophy className="h-6 w-6 text-amber-700" />
                  </div>
                  <p className="text-sm font-medium mb-1">3rd Place</p>
                  <p className="text-lg font-semibold">{new Intl.NumberFormat('en-US', { 
                    style: 'currency', 
                    currency: campaign.currency || 'USD',
                    minimumFractionDigits: 0 
                  }).format(prizePool.thirdPlace)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstPlace">1st Place Prize</Label>
                <Input
                  id="firstPlace"
                  type="number"
                  min={0}
                  value={prizePool.firstPlace}
                  onChange={(e) => updatePrizePool("firstPlace", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondPlace">2nd Place Prize</Label>
                <Input
                  id="secondPlace"
                  type="number"
                  min={0}
                  value={prizePool.secondPlace}
                  onChange={(e) => updatePrizePool("secondPlace", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thirdPlace">3rd Place Prize</Label>
                <Input
                  id="thirdPlace"
                  type="number"
                  min={0}
                  value={prizePool.thirdPlace}
                  onChange={(e) => updatePrizePool("thirdPlace", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="runnerUps">Runner-up Prize (each)</Label>
                <Input
                  id="runnerUps"
                  type="number"
                  min={0}
                  value={prizePool.runnerUps}
                  onChange={(e) => updatePrizePool("runnerUps", Number(e.target.value))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="runnerUpsCount">Number of Runner-ups</Label>
              <Input
                id="runnerUpsCount"
                type="number"
                min={0}
                max={20}
                value={prizePool.runnerUpsCount}
                onChange={(e) => updatePrizePool("runnerUpsCount", Number(e.target.value))}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Total for runner-ups: {new Intl.NumberFormat('en-US', { 
                  style: 'currency', 
                  currency: campaign.currency || 'USD' 
                }).format(prizePool.runnerUps * prizePool.runnerUpsCount)}
              </p>
            </div>
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
