
import { useState, useRef } from "react";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BannerImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

const BannerImageUpload = ({ onImageSelect, currentImage }: BannerImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Here we'd normally upload to a server, but for this example
    // we'll create a local object URL for preview
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setPreviewUrl(undefined);
    onImageSelect("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Banner Image</Label>
      
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Banner preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button 
              variant="outline"
              size="sm"
              className="mr-2 bg-white text-black hover:bg-white/90"
              onClick={() => fileInputRef.current?.click()}
            >
              Change
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={clearImage}
            >
              Remove
            </Button>
          </div>
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2 rounded-full"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div 
          className={cn(
            "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-48 cursor-pointer transition-colors",
            isDragging 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 bg-muted/30 hover:bg-muted/50"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
            <Image className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-1 text-center">
            Drag and drop your banner image here or click to browse
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Recommended size: 1200x400px • JPG, PNG, or GIF
          </p>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default BannerImageUpload;
