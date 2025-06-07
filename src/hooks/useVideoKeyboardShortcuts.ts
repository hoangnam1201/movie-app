import { useEffect, useCallback } from 'react';

interface UseVideoKeyboardShortcutsProps {
  onToggleFullscreen: () => void;
  onGoBack: () => void;
  onNextVideo?: () => void;
  onPreviousVideo?: () => void;
  isFullscreen: boolean;
  disabled?: boolean;
}

const useVideoKeyboardShortcuts = ({
  onToggleFullscreen,
  onGoBack,
  onNextVideo,
  onPreviousVideo,
  isFullscreen,
  disabled = false
}: UseVideoKeyboardShortcutsProps) => {
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Prevent shortcuts when user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    switch (event.key.toLowerCase()) {
      case 'f':
        event.preventDefault();
        onToggleFullscreen();
        break;
      case 'escape':
        if (isFullscreen) {
          event.preventDefault();
          onToggleFullscreen();
        }
        break;
      case 'backspace':
        event.preventDefault();
        onGoBack();
        break;
      case 'arrowright':
        if (onNextVideo) {
          event.preventDefault();
          onNextVideo();
        }
        break;
      case 'arrowleft':
        if (onPreviousVideo) {
          event.preventDefault();
          onPreviousVideo();
        }
        break;
      default:
        break;
    }
  }, [disabled, onToggleFullscreen, onGoBack, onNextVideo, onPreviousVideo, isFullscreen]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    shortcuts: [
      { key: 'F', action: 'Toggle Fullscreen' },
      { key: 'Esc', action: 'Exit Fullscreen' },
      { key: 'Backspace', action: 'Go Back' },
      { key: '← →', action: 'Previous/Next Video' }
    ]
  };
};

export default useVideoKeyboardShortcuts;
