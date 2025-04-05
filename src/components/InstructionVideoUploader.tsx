
import { useState, useRef } from "react";
import { Video, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface InstructionVideoUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  file?: File | null;
  onFileChange: (file: File | null) => void;
  showLabel?: boolean;
}

const InstructionVideoUploader = ({ 
  value, 
  onChange, 
  file, 
  onFileChange,
  showLabel = false
}: InstructionVideoUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast.error("Please upload a valid video file");
        return;
      }
      
      // Create a preview URL for the video
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      onChange(objectUrl);
      onFileChange(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const clearVideo = () => {
    setPreviewUrl(null);
    onChange("");
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // When component unmounts or preview changes, revoke object URL to avoid memory leaks
  const revokeObjectURL = (url: string) => {
    URL.revokeObjectURL(url);
  };

  // useEffect(() => {
  //   return () => {
  //     if (previewUrl) {
  //       revokeObjectURL(previewUrl);
  //     }
  //   };
  // }, [previewUrl]);

  return (
    <div className="space-y-4">
      {showLabel && <Label>Instruction Video</Label>}
      <div className="space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleButtonClick}
        >
          <Upload className="h-4 w-4" />
          Upload Video
        </Button>
        <p className="text-xs text-muted-foreground">
          Upload an instruction video for creators (MP4, WebM, MOV)
        </p>
      </div>

      {previewUrl && (
        <div className="relative mt-4 rounded-md overflow-hidden border">
          <div className="relative pt-[56.25%]">
            <video 
              className="absolute top-0 left-0 w-full h-full object-contain"
              src={previewUrl}
              controls
            />
          </div>
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
