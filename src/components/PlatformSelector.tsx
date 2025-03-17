
import { useState } from "react";
import { PLATFORMS } from "@/lib/campaign-types";
import { CheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PlatformSelectorProps {
  selectedPlatform: string | undefined;
  onChange: (platform: string) => void;
  singleSelection?: boolean;
}

const PlatformSelector = ({ 
  selectedPlatform, 
  onChange, 
  singleSelection = false 
}: PlatformSelectorProps) => {
  
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'TikTok Shop':
      case 'TikTok':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M19.321 5.562a5.122 5.122 0 0 1-5.115-4.85h-3.525v13.173c0 2.898-2.376 5.271-5.277 5.271-2.901 0-5.277-2.373-5.277-5.271s2.376-5.271 5.277-5.271c.36 0 .717.037 1.062.107v-3.61a8.742 8.742 0 0 0-1.062-.064C2.433 5.047 0 7.476 0 10.885c0 3.409 2.433 5.838 5.404 5.838 2.971 0 5.404-2.429 5.404-5.838V9.219a8.741 8.741 0 0 0 3.147 2.157v-3.614a5.123 5.123 0 0 1 5.366-2.2Z" />
          </svg>
        );
      case 'Instagram Reels':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
          </svg>
        );
      case 'Twitter':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
          </svg>
        );
      case 'YouTube Shorts':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <Label>
        {singleSelection ? "Platform" : "Platforms"}
        <span className="text-destructive ml-1">*</span>
      </Label>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        {PLATFORMS.map((platform) => {
          const isSelected = 
            singleSelection 
              ? selectedPlatform === platform 
              : Array.isArray(selectedPlatform) && selectedPlatform.includes(platform);
          
          return (
            <div
              key={platform}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected 
                  ? "border-primary bg-primary/10" 
                  : "border-muted bg-card hover:border-primary/50"
              )}
              onClick={() => onChange(platform)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                  <CheckIcon className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
              <div className={cn(
                "text-muted-foreground",
                isSelected && "text-primary"
              )}>
                {getPlatformIcon(platform)}
              </div>
              <p className={cn(
                "mt-2 text-xs text-center",
                isSelected ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {platform}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformSelector;
