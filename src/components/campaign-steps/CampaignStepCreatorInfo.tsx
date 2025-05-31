import { Campaign } from "@/lib/campaign-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import GuidelinesList from "@/components/GuidelinesList";
import BriefUploader from "@/components/BriefUploader";
import InstructionVideoUploader from "@/components/InstructionVideoUploader";
import ExampleVideos from "@/components/ExampleVideos";
import { CampaignFormErrors } from "@/lib/campaign-validation";

interface CampaignStepCreatorInfoProps {
  campaign: Partial<Campaign>;
  onChange: (updatedCampaign: Partial<Campaign>) => void;
  errors?: CampaignFormErrors;
}

export default function CampaignStepCreatorInfo({ campaign, onChange, errors = {} }: CampaignStepCreatorInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Creator Resources</h3>
        <p className="text-muted-foreground">
          Provide guidelines and resources to help creators succeed
        </p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidelinesList
            dos={campaign.guidelines?.dos || []}
            donts={campaign.guidelines?.donts || []}
            onChange={(guidelines) => onChange({ guidelines })}
            showLabel={false}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Campaign Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <BriefUploader
            brief={campaign.brief}
            onChange={(brief) => onChange({ brief })}
            label=""
          />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Instruction Video</CardTitle>
        </CardHeader>
        <CardContent>
          <InstructionVideoUploader
            value={campaign.instructionVideo}
            onChange={(url) => onChange({ instructionVideo: url })}
            file={campaign.instructionVideoFile}
            onFileChange={(file) => onChange({ instructionVideoFile: file })}
          />
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Tracking Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="requestedTrackingLink"
              checked={campaign.requestedTrackingLink || false}
              onCheckedChange={(checked) => 
                onChange({ requestedTrackingLink: checked as boolean })
              }
            />
            <Label htmlFor="requestedTrackingLink" className="cursor-pointer">
              Request tracking link in submissions
            </Label>
          </div>

          {campaign.requestedTrackingLink && (
            <div className="space-y-2">
              <Label htmlFor="trackingLink">Link URL</Label>
              <Input
                id="trackingLink"
                value={campaign.trackingLink || ""}
                onChange={(e) => onChange({ trackingLink: e.target.value })}
                placeholder="Enter tracking link"
              />
              <p className="text-xs text-muted-foreground">
                This link will be provided to creators for tracking purposes
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Example Videos</CardTitle>
        </CardHeader>
        <CardContent>
          <ExampleVideos
            exampleVideos={campaign.exampleVideos || []}
            selectedPlatforms={campaign.platforms || []}
            onChange={(exampleVideos) => onChange({ exampleVideos })}
            showLabel={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
