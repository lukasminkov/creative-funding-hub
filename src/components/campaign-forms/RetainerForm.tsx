
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Campaign, CONTENT_TYPES, CATEGORIES, PLATFORMS, CURRENCIES, CreatorTier } from "@/lib/campaign-types";
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
import { format } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RetainerFormProps {
  campaign: Partial<Campaign>;
  onChange: (campaign: Partial<Campaign>) => void;
}

const RetainerForm = ({ campaign, onChange }: RetainerFormProps) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(campaign.platforms || []);
  const [creatorTiers, setCreatorTiers] = useState<CreatorTier[]>(
    campaign.type === "retainer" && campaign.creatorTiers 
      ? campaign.creatorTiers 
      : [{ name: "Basic", price: 500, requirements: "At least 10K followers" }]
  );
  const [deliverables, setDeliverables] = useState({
    videosPerDay: campaign.type === "retainer" && campaign.deliverables 
      ? campaign.deliverables.videosPerDay 
      : 1,
    durationDays: campaign.type === "retainer" && campaign.deliverables 
      ? campaign.deliverables.durationDays 
      : 30
  });

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter(p => p !== platform)
      : [...selectedPlatforms, platform];
    
    setSelectedPlatforms(newPlatforms);
    onChange({ ...campaign, platforms: newPlatforms });
  };

  const addCreatorTier = () => {
    const newTier: CreatorTier = {
      name: `Tier ${creatorTiers.length + 1}`,
      price: 0,
      requirements: ""
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
                    <div className="space-y-2">
                      <Label htmlFor={`tier-${index}-requirements`}>Requirements</Label>
                      <Input
                        id={`tier-${index}-requirements`}
                        value={tier.requirements}
                        onChange={(e) => updateCreatorTier(index, "requirements", e.target.value)}
                        placeholder="e.g. Minimum followers, past performance"
                      />
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
