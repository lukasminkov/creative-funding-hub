import React from "react";
import { Campaign } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  CONTENT_TYPES, 
  CATEGORIES, 
  PLATFORMS, 
  CURRENCIES,
  COUNTRY_OPTIONS,
  getCountryLabel
} from "@/lib/campaign-types";
import { CalendarIcon, Plus, Trash2, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RetainerFormProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  showCreatorInfoSection: boolean;
  disableBudgetEdit?: boolean;
}

const RetainerForm = ({ campaign, onChange, showCreatorInfoSection, disableBudgetEdit = false }: RetainerFormProps) => {
  const handleInputChange = (field: string, value: any) => {
    onChange({ [field]: value });
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      onChange({ [field]: date });
    }
  };

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = campaign.platforms || [];
    const updatedPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];
    
    onChange({ platforms: updatedPlatforms });
  };

  const handleGuidelineChange = (type: 'dos' | 'donts', index: number, value: string) => {
    const guidelines = { ...(campaign.guidelines || { dos: [], donts: [] }) };
    guidelines[type][index] = value;
    onChange({ guidelines });
  };

  const addGuideline = (type: 'dos' | 'donts') => {
    const guidelines = { ...(campaign.guidelines || { dos: [], donts: [] }) };
    guidelines[type] = [...guidelines[type], ''];
    onChange({ guidelines });
  };

  const removeGuideline = (type: 'dos' | 'donts', index: number) => {
    const guidelines = { ...(campaign.guidelines || { dos: [], donts: [] }) };
    guidelines[type] = guidelines[type].filter((_, i) => i !== index);
    onChange({ guidelines });
  };

  const handleCreatorTierChange = (index: number, field: string, value: any) => {
    const tiers = [...(campaign.creatorTiers || [])];
    tiers[index] = { ...tiers[index], [field]: value };
    onChange({ creatorTiers: tiers });
  };

  const addCreatorTier = () => {
    const tiers = [...(campaign.creatorTiers || []), { name: '', price: 0 }];
    onChange({ creatorTiers: tiers });
  };

  const removeCreatorTier = (index: number) => {
    const tiers = (campaign.creatorTiers || []).filter((_, i) => i !== index);
    onChange({ creatorTiers: tiers });
  };

  const handleDeliverablesChange = (field: string, value: any) => {
    const deliverables = { ...(campaign.deliverables || { mode: 'totalVideos', totalVideos: 10 }) };
    onChange({ deliverables: { ...deliverables, [field]: value } });
  };

  return (
    <div className="space-y-6">
      {!showCreatorInfoSection && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input
                id="title"
                value={campaign.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter campaign title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contentType">Content Type</Label>
              <Select
                value={campaign.contentType}
                onValueChange={(value) => handleInputChange('contentType', value)}
              >
                <SelectTrigger id="contentType">
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={campaign.category}
                onValueChange={(value) => handleInputChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget</Label>
              <Input
                id="totalBudget"
                type="number"
                min="0"
                value={campaign.totalBudget || ""}
                onChange={(e) => onChange({ totalBudget: Number(e.target.value) })}
                placeholder="Campaign budget"
                disabled={disableBudgetEdit}
                className={disableBudgetEdit ? "bg-muted cursor-not-allowed" : ""}
              />
              {disableBudgetEdit && (
                <p className="text-xs text-muted-foreground mt-1">
                  Budget can only be increased using the "Add Budget" button
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={campaign.currency}
                onValueChange={(value) => handleInputChange('currency', value)}
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="countryAvailability">Country Availability</Label>
              <Select
                value={campaign.countryAvailability}
                onValueChange={(value) => handleInputChange('countryAvailability', value)}
              >
                <SelectTrigger id="countryAvailability">
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {getCountryLabel(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !campaign.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.endDate ? format(campaign.endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={campaign.endDate}
                    onSelect={(date) => handleDateChange('endDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicationDeadline">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !campaign.applicationDeadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {campaign.applicationDeadline ? format(campaign.applicationDeadline, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={campaign.applicationDeadline}
                    onSelect={(date) => handleDateChange('applicationDeadline', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PLATFORMS.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={`platform-${platform}`}
                    checked={(campaign.platforms || []).includes(platform)}
                    onCheckedChange={() => handlePlatformToggle(platform)}
                  />
                  <label
                    htmlFor={`platform-${platform}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {platform}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Campaign Description</Label>
            <Textarea
              id="description"
              value={campaign.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your campaign"
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bannerImage">Banner Image</Label>
            <div className="flex items-center gap-4">
              {campaign.bannerImage ? (
                <div className="relative w-full h-40 bg-muted rounded-md overflow-hidden">
                  <img
                    src={campaign.bannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleInputChange('bannerImage', '')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Drag and drop or click to upload
                    </p>
                    <Input
                      id="bannerImage"
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // In a real app, you'd upload this to a server
                          // For now, we'll create a local URL
                          const url = URL.createObjectURL(file);
                          handleInputChange('bannerImage', url);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => document.getElementById('bannerImage')?.click()}
                    >
                      Select Image
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreatorInfoSection && (
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Creator Tiers</h3>
            <p className="text-sm text-muted-foreground">
              Define different tiers for creators based on their audience size or quality
            </p>

            {(campaign.creatorTiers || []).map((tier, index) => (
              <div key={index} className="flex items-center gap-4">
                <Input
                  placeholder="Tier name (e.g. Micro, Macro)"
                  value={tier.name}
                  onChange={(e) => handleCreatorTierChange(index, 'name', e.target.value)}
                  className="flex-1"
                />
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Price"
                    value={tier.price}
                    onChange={(e) => handleCreatorTierChange(index, 'price', Number(e.target.value))}
                    className="w-24"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCreatorTier(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addCreatorTier}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Deliverables</h3>
            <p className="text-sm text-muted-foreground">
              Define what creators need to deliver for this campaign
            </p>

            <RadioGroup
              value={campaign.deliverables?.mode || 'totalVideos'}
              onValueChange={(value) => handleDeliverablesChange('mode', value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="totalVideos" id="totalVideos" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="totalVideos" className="font-medium">Total Videos</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={campaign.deliverables?.totalVideos || 10}
                      onChange={(e) => handleDeliverablesChange('totalVideos', Number(e.target.value))}
                      className="w-20"
                      disabled={campaign.deliverables?.mode !== 'totalVideos'}
                    />
                    <span className="text-sm text-muted-foreground">videos in total</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <RadioGroupItem value="videosPerDay" id="videosPerDay" className="mt-1" />
                <div className="grid gap-1.5">
                  <Label htmlFor="videosPerDay" className="font-medium">Videos Per Day</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={campaign.deliverables?.videosPerDay || 1}
                      onChange={(e) => handleDeliverablesChange('videosPerDay', Number(e.target.value))}
                      className="w-20"
                      disabled={campaign.deliverables?.mode !== 'videosPerDay'}
                    />
                    <span className="text-sm text-muted-foreground">videos per day for</span>
                    <Input
                      type="number"
                      min="1"
                      value={campaign.deliverables?.durationDays || 30}
                      onChange={(e) => handleDeliverablesChange('durationDays', Number(e.target.value))}
                      className="w-20"
                      disabled={campaign.deliverables?.mode !== 'videosPerDay'}
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Content Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              Provide clear guidelines for creators to follow
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Do's</h4>
                {(campaign.guidelines?.dos || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => handleGuidelineChange('dos', index, e.target.value)}
                      placeholder="Add a guideline"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuideline('dos', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addGuideline('dos')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Do
                </Button>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Don'ts</h4>
                {(campaign.guidelines?.donts || []).map((item, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => handleGuidelineChange('donts', index, e.target.value)}
                      placeholder="Add a guideline"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuideline('donts', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addGuideline('donts')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Don't
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Tracking Link</h3>
                <p className="text-sm text-muted-foreground">
                  Provide a tracking link for creators to use
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="requestedTrackingLink"
                  checked={campaign.requestedTrackingLink}
                  onCheckedChange={(checked) => handleInputChange('requestedTrackingLink', checked)}
                />
                <Label htmlFor="requestedTrackingLink">Required</Label>
              </div>
            </div>

            <Input
              placeholder="Enter tracking link"
              value={campaign.trackingLink || ''}
              onChange={(e) => handleInputChange('trackingLink', e.target.value)}
              disabled={!campaign.requestedTrackingLink}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Example Videos</h3>
            <p className="text-sm text-muted-foreground">
              Provide examples of the type of content you're looking for
            </p>

            {(campaign.exampleVideos || []).map((video, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Select
                  value={video.platform}
                  onValueChange={(value) => {
                    const updatedVideos = [...(campaign.exampleVideos || [])];
                    updatedVideos[index] = { ...video, platform: value as Platform };
                    handleInputChange('exampleVideos', updatedVideos);
                  }}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={video.url}
                  onChange={(e) => {
                    const updatedVideos = [...(campaign.exampleVideos || [])];
                    updatedVideos[index] = { ...video, url: e.target.value };
                    handleInputChange('exampleVideos', updatedVideos);
                  }}
                  placeholder="Video URL"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const updatedVideos = (campaign.exampleVideos || []).filter((_, i) => i !== index);
                    handleInputChange('exampleVideos', updatedVideos);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const updatedVideos = [
                  ...(campaign.exampleVideos || []),
                  { platform: PLATFORMS[0], url: '' }
                ];
                handleInputChange('exampleVideos', updatedVideos);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Example
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetainerForm;
