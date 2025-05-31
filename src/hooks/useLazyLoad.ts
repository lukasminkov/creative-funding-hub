
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const { threshold = 0.1, rootMargin = '50px', enabled = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (elementRef.current) {
      // Clean up previous observer
    }
    elementRef.current = node;
  }, []);

  useEffect(() => {
    if (!enabled || hasLoaded || !elementRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [threshold, rootMargin, enabled, hasLoaded]);

  return { isVisible: isVisible || hasLoaded, setRef };
};
