import React, { useState } from "react";
import { Plus, X, Youtube, Instagram, TikTok } from "lucide-react";
import { Platform, ExampleVideo } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SocialIcon } from "@/components/icons/SocialIcons";

interface ExampleVideosProps {
  exampleVideos: ExampleVideo[];
  selectedPlatforms: Platform[];
  onChange: (videos: ExampleVideo[]) => void;
  showLabel?: boolean;
}

const ExampleVideos = ({ 
  exampleVideos, 
  selectedPlatforms, 
  onChange,
  showLabel = true 
}: ExampleVideosProps) => {
  const [videos, setVideos] = useState<ExampleVideo[]>(exampleVideos);

  const handleAddVideo = () => {
    setVideos([...videos, { url: "", platform: selectedPlatforms[0] }]);
  };

  const handleVideoChange = (index: number, field: "url" | "platform", value: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index][field] = value;
    setVideos(updatedVideos);
    onChange(updatedVideos);
  };

  const handleRemoveVideo = (index: number) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
    onChange(updatedVideos);
  };

  return (
    <div className="space-y-4">
      {showLabel && <Label>Example Videos</Label>}
      {videos.map((video, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="url"
              placeholder="Enter video URL"
              value={video.url}
              onChange={(e) => handleVideoChange(index, "url", e.target.value)}
            />
            <div>
              <Label htmlFor={`platform-${index}`} className="sr-only">
                Platform
              </Label>
              <select
                id={`platform-${index}`}
                className="w-full px-3 py-2 border rounded-md bg-background"
                value={video.platform}
                onChange={(e) => handleVideoChange(index, "platform", e.target.value)}
              >
                {selectedPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleRemoveVideo(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={handleAddVideo}>
        <Plus className="h-4 w-4 mr-2" /> Add Video
      </Button>
    </div>
  );
};

export default ExampleVideos;
