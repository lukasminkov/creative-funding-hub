
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLazyLoad } from '@/hooks/useLazyLoad';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  aspectRatio?: string;
  priority?: boolean;
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ src, alt, fallbackSrc, className, aspectRatio, priority = false, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const { isVisible, setRef } = useLazyLoad({ enabled: !priority });

    const handleLoad = () => setIsLoaded(true);
    const handleError = () => {
      setHasError(true);
      if (fallbackSrc) setIsLoaded(true);
    };

    const shouldLoad = priority || isVisible;
    const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;

    return (
      <div
        ref={setRef}
        className={cn(
          "overflow-hidden bg-muted flex items-center justify-center",
          aspectRatio && `aspect-[${aspectRatio}]`,
          className
        )}
      >
        {shouldLoad ? (
          <img
            ref={ref}
            src={imageSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              "transition-opacity duration-300",
              isLoaded ? "opacity-100" : "opacity-0",
              "w-full h-full object-cover"
            )}
            {...props}
          />
        ) : (
          <div className="w-full h-full bg-muted animate-pulse" />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";
