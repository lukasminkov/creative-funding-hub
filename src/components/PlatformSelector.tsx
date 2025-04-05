
import { useState } from 'react';
import { Check } from 'lucide-react';
import { PLATFORMS, Platform } from '@/lib/campaign-types';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
  selectedPlatform?: string;
  selectedPlatforms?: string[];
  onChange: (platform: string) => void;
  singleSelection?: boolean;
  showLabel?: boolean;
}

const PlatformSelector = ({
  selectedPlatform,
  selectedPlatforms = [],
  onChange,
  singleSelection = false,
  showLabel = true
}: PlatformSelectorProps) => {
  const isSelected = (platform: string) => {
    if (singleSelection) {
      return selectedPlatform === platform;
    } else {
      return selectedPlatforms.includes(platform);
    }
  };

  const getPlatformLogo = (platform: string) => {
    switch (platform) {
      case 'TikTok':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path 
              fill="currentColor" 
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
            />
          </svg>
        );
      case 'TikTok Shop':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path 
              fill="currentColor" 
              d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.242V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"
            />
            <path 
              fill="currentColor" 
              d="M12 22.5a1.5 1.5 0 0 1-1.5-1.5v-7.5a1.5 1.5 0 0 1 1.5-1.5h7.5a1.5 1.5 0 0 1 1.5 1.5v4.5a3 3 0 0 1-3 3h-6Z"
              opacity="0.5"
            />
          </svg>
        );
      case 'Instagram Reels':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path 
              fill="currentColor" 
              d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
            />
          </svg>
        );
      case 'Twitter':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path 
              fill="currentColor" 
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
            />
          </svg>
        );
      case 'YouTube Shorts':
        return (
          <svg viewBox="0 0 24 24" className="h-6 w-6">
            <path 
              fill="currentColor" 
              d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {showLabel && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Platforms {singleSelection ? "(select one)" : "(select multiple)"}
        </label>
      )}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {PLATFORMS.map((platform) => (
          <div
            key={platform}
            onClick={() => onChange(platform)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all cursor-pointer",
              isSelected(platform)
                ? "border-primary bg-primary/10 text-primary"
                : "border-muted-foreground/20 hover:border-muted-foreground/40"
            )}
          >
            <div className="relative">
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-full mb-2",
                isSelected(platform) ? "text-primary" : "text-muted-foreground"
              )}>
                {getPlatformLogo(platform)}
              </div>
              {isSelected(platform) && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary text-white rounded-full p-0.5">
                  <Check className="h-3 w-3" />
                </div>
              )}
            </div>
            <span className="text-xs text-center font-medium mt-1">{platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformSelector;
