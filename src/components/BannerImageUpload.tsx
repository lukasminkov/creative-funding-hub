
import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface BannerImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
}

const BannerImageUpload = ({ onImageSelect, currentImage }: BannerImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);
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

  return (
    <div className="space-y-4">
      <Label>Banner Image</Label>
      
      {previewUrl ? (
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={previewUrl} 
            alt="Banner preview" 
            className="w-full h-48 object-cover rounded-lg"
          />
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
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center h-48 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Click to upload a banner image
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Recommended size: 1200x400px
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
