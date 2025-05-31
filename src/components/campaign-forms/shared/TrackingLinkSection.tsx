
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TrackingLinkSectionProps {
  requestedTrackingLink: boolean;
  trackingLink: string;
  onRequestedChange: (checked: boolean) => void;
  onLinkChange: (link: string) => void;
}

const TrackingLinkSection = ({
  requestedTrackingLink,
  trackingLink,
  onRequestedChange,
  onLinkChange
}: TrackingLinkSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tracking Link</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormItem className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requestedTrackingLink"
              checked={requestedTrackingLink}
              onCheckedChange={onRequestedChange}
            />
            <Label htmlFor="requestedTrackingLink" className="cursor-pointer">
              Request tracking link in submissions
            </Label>
          </div>
        </FormItem>

        {requestedTrackingLink && (
          <FormItem className="space-y-2">
            <Label htmlFor="trackingLink">Link URL</Label>
            <Input
              id="trackingLink"
              value={trackingLink}
              onChange={(e) => onLinkChange(e.target.value)}
              placeholder="Enter tracking link"
            />
            <p className="text-xs text-muted-foreground">
              This link will be provided to creators for tracking purposes
            </p>
          </FormItem>
        )}
      </CardContent>
    </Card>
  );
};

export default TrackingLinkSection;
