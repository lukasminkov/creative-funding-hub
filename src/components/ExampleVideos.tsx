
import { useState } from "react";
import { Platform, PLATFORMS, ExampleVideo } from "@/lib/campaign-types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Plus, Trash2, Video } from "lucide-react";

interface ExampleVideosProps {
  exampleVideos: ExampleVideo[];
  selectedPlatforms: Platform[];
  onChange: (exampleVideos: ExampleVideo[]) => void;
}

const ExampleVideos: React.FC<ExampleVideosProps> = ({ 
  exampleVideos = [], 
  selectedPlatforms,
  onChange 
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoPlatform, setVideoPlatform] = useState<Platform | "">(
    selectedPlatforms.length > 0 ? selectedPlatforms[0] : ""
  );

  const addExampleVideo = () => {
    if (!videoUrl || !videoPlatform) return;
    
    const newExampleVideo: ExampleVideo = {
      platform: videoPlatform as Platform,
      url: videoUrl
    };
    
    onChange([...exampleVideos, newExampleVideo]);
    setVideoUrl("");
    setVideoPlatform(selectedPlatforms.length > 0 ? selectedPlatforms[0] : "");
  };

  const removeExampleVideo = (index: number) => {
    const updatedVideos = [...exampleVideos];
    updatedVideos.splice(index, 1);
    onChange(updatedVideos);
  };

  const renderVideoEmbed = (url: string, platform: Platform) => {
    // Extract video ID based on platform
    let videoId = "";
    
    if (platform === "YouTube Shorts") {
      // YouTube URL formats: 
      // - https://www.youtube.com/watch?v=VIDEO_ID
      // - https://youtu.be/VIDEO_ID
      // - https://youtube.com/shorts/VIDEO_ID
      const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\s]+)/;
      const match = url.match(youtubeRegex);
      videoId = match ? match[1] : "";
      
      if (videoId) {
        return (
          <iframe 
            width="100%" 
            height="315" 
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="rounded-md"
          />
        );
      }
    } else if (platform === "TikTok" || platform === "TikTok Shop") {
      // TikTok URL format: https://www.tiktok.com/@username/video/VIDEO_ID
      const tiktokRegex = /tiktok\.com\/@[^/]+\/video\/(\d+)/;
      const match = url.match(tiktokRegex);
      videoId = match ? match[1] : "";
      
      if (videoId) {
        return (
          <blockquote 
            className="tiktok-embed rounded-md overflow-hidden" 
            cite={url}
            data-video-id={videoId}
            style={{ maxWidth: "605px", minWidth: "325px" }}
          >
            <section>
              <a target="_blank" href={url}>TikTok Video</a>
            </section>
            {/* TikTok embed script will replace this with an iframe */}
            <script async src="https://www.tiktok.com/embed.js"></script>
          </blockquote>
        );
      }
    } else if (platform === "Instagram Reels") {
      // Instagram URL format: https://www.instagram.com/reel/CODE
      const instaRegex = /instagram\.com\/(?:p|reel)\/([^/?#&]+)/;
      const match = url.match(instaRegex);
      videoId = match ? match[1] : "";
      
      if (videoId) {
        return (
          <iframe 
            src={`https://www.instagram.com/p/${videoId}/embed/`}
            width="100%" 
            height="450"
            frameBorder="0" 
            scrolling="no" 
            allowTransparency={true}
            className="rounded-md"
          />
        );
      }
    } else if (platform === "Twitter") {
      // For Twitter, we'll render a link since embedding requires Twitter API
      return (
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
        >
          <Video className="mr-2 h-4 w-4" />
          View Twitter Video
        </a>
      );
    }

    // Fallback for invalid or unsupported URLs
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors"
      >
        <Video className="mr-2 h-4 w-4" />
        View Video
      </a>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Example Videos</h3>
      <p className="text-sm text-muted-foreground">
        Add example videos to show creators what you're looking for
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <Label htmlFor="videoPlatform" className="mb-2 block">Platform</Label>
          <Select
            value={videoPlatform}
            onValueChange={(value) => setVideoPlatform(value as Platform)}
            disabled={selectedPlatforms.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {selectedPlatforms.map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="videoUrl" className="mb-2 block">Video URL</Label>
          <div className="flex space-x-2">
            <Input
              id="videoUrl"
              placeholder="Paste video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={selectedPlatforms.length === 0}
            />
            <Button 
              onClick={addExampleVideo} 
              disabled={!videoUrl || !videoPlatform || selectedPlatforms.length === 0}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {selectedPlatforms.length === 0 && (
        <p className="text-sm text-amber-500 mt-2">
          Select at least one platform to add example videos
        </p>
      )}
      
      {exampleVideos.length > 0 && (
        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-medium">Added Videos</h4>
          <div className="grid grid-cols-1 gap-4">
            {exampleVideos.map((video, index) => (
              <div key={index} className="border border-border rounded-md p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">{video.platform}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExampleVideo(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="embed-container">
                  {renderVideoEmbed(video.url, video.platform)}
                </div>
                
                <p className="text-xs text-muted-foreground break-all mt-2">
                  {video.url}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleVideos;
