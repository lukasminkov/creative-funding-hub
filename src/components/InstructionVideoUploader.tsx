
import { useState } from "react";
import { Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InstructionVideoUploaderProps {
  videoUrl?: string;
  onVideoChange: (url: string) => void;
}

const InstructionVideoUploader = ({ videoUrl = '', onVideoChange }: InstructionVideoUploaderProps) => {
  const [inputValue, setInputValue] = useState(videoUrl);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onVideoChange(e.target.value);
  };

  const clearVideo = () => {
    setInputValue('');
    onVideoChange('');
  };

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <Label>Instruction Video</Label>
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          value={inputValue}
          onChange={handleInputChange}
        />
        <p className="text-xs text-muted-foreground">
          Provide a link to your instruction video for creators
        </p>
      </div>

      {inputValue && isValidUrl(inputValue) && (
        <div className="relative mt-4 rounded-md overflow-hidden border">
          {isYouTubeUrl(inputValue) ? (
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${inputValue.includes('youtube.com/watch?v=') 
                  ? inputValue.split('v=')[1].split('&')[0] 
                  : inputValue.includes('youtu.be/') 
                    ? inputValue.split('youtu.be/')[1].split('?')[0]
                    : ''}`}
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 bg-muted/20">
              <Video className="h-12 w-12 text-muted-foreground" />
              <p className="ml-3 text-sm">Video URL added</p>
            </div>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            onClick={clearVideo}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default InstructionVideoUploader;
