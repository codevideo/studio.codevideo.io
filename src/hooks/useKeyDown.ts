import { useEffect, useCallback, useRef } from 'react';

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyConfig {
  [key: string]: {
    handler: KeyHandler;
    combo?: KeyCombo;
    preventDefault?: boolean;
  };
}

interface UseKeyDownOptions {
    enabled?: boolean;
    target?: 'document' | 'window' | HTMLElement;
}

export const useKeyDown = (
  keyConfig: KeyConfig,
  options: UseKeyDownOptions
) => {
  const { enabled = true, target = 'document' } = options;
  const handlersRef = useRef<KeyConfig>(keyConfig);
  
  // Update ref when config changes
  useEffect(() => {
    handlersRef.current = keyConfig;
  }, [keyConfig]);

  // Check if a key event matches a key combo
  const matchesKeyCombo = useCallback((event: KeyboardEvent, combo: KeyCombo): boolean => {
    const modifiersMatch = 
      (!!combo.ctrl === event.ctrlKey || combo.ctrl === undefined) &&
      (!!combo.shift === event.shiftKey || combo.shift === undefined) &&
      (!!combo.alt === event.altKey || combo.alt === undefined) &&
      (!!combo.meta === event.metaKey || combo.meta === undefined);

    const keyMatches = event.key.toLowerCase() === combo.key.toLowerCase();

    return modifiersMatch && keyMatches;
  }, []);

  // Main event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Log for debugging purposes
    console.log('KeyDown Event:', {
      key: event.key,
      code: event.code,
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey,
      target: event.target,
      defaultPrevented: event.defaultPrevented
    });

    Object.entries(handlersRef.current).forEach(([key, config]) => {
      const shouldHandle = config.combo 
        ? matchesKeyCombo(event, config.combo)
        : event.key.toLowerCase() === key.toLowerCase();

      if (shouldHandle) {
        if (config.preventDefault) {
          event.preventDefault();
        }
        config.handler(event);
      }
    });
  }, [enabled, matchesKeyCombo]);

  useEffect(() => {
    const targetElement = target === 'window' 
      ? window 
      : target === 'document' 
        ? document 
        : target;

    if (!targetElement) return;

    targetElement.addEventListener('keydown', handleKeyDown as EventListener);
    return () => targetElement.removeEventListener('keydown', handleKeyDown as EventListener);
  }, [handleKeyDown, target]);

  // Return methods to enable/disable specific handlers
  return {
    isEnabled: enabled,
    // Add any additional utility methods here if needed
  };
}