
import { useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
  onNext?: () => void;
  onPrevious?: () => void;
  onSelect?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export const useKeyboardNavigation = ({
  onNext,
  onPrevious,
  onSelect,
  onEscape,
  enabled = true
}: UseKeyboardNavigationOptions) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        onNext?.();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        onPrevious?.();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onSelect?.();
        break;
      case 'Escape':
        event.preventDefault();
        onEscape?.();
        break;
    }
  }, [enabled, onNext, onPrevious, onSelect, onEscape]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);
};
