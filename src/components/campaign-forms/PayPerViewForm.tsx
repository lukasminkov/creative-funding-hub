
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
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PayPerViewFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
}

const PayPerViewForm = ({ campaign, onChange }: PayPerViewFormProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaign.platforms || []);
  
  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    onChange({ ...campaign, platforms: newPlatforms });
  };

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
          <h3 className="text-lg font-medium mb-4">Pay Per View Settings</h3>
          
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="ratePerThousand">
                Rate per 1,000 Views <span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">
                  {campaign.currency || "USD"}
                </span>
                <Input
                  id="ratePerThousand"
                  type="number"
                  min={0}
                  value={campaign.type === "payPerView" ? campaign.ratePerThousand || "" : ""}
                  onChange={(e) => 
                    onChange({ 
                      ...campaign, 
                      type: "payPerView", 
                      ratePerThousand: Number(e.target.value) 
                    })
                  }
                  className="rounded-l-none"
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Amount paid per 1,000 views
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxPayoutPerSubmission">
                Max Payout (per submission) <span className="text-destructive">*</span>
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-sm text-muted-foreground">
                  {campaign.currency || "USD"}
                </span>
                <Input
                  id="maxPayoutPerSubmission"
                  type="number"
                  min={0}
                  value={campaign.type === "payPerView" ? campaign.maxPayoutPerSubmission || "" : ""}
                  onChange={(e) => 
                    onChange({ 
                      ...campaign, 
                      type: "payPerView", 
                      maxPayoutPerSubmission: Number(e.target.value) 
                    })
                  }
                  className="rounded-l-none"
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Maximum amount paid per video submission
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayPerViewForm;
