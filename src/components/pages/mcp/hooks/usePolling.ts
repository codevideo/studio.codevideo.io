import { useRef, useCallback, useEffect } from 'react';

export function usePolling() {
  const intervalRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const startPolling = useCallback((key: string, callback: () => void, interval: number = 2000) => {
    // Clear existing interval for this key
    const existingInterval = intervalRefs.current.get(key);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    // Start new interval
    const newInterval = setInterval(callback, interval);
    intervalRefs.current.set(key, newInterval);

    return newInterval;
  }, []);

  const stopPolling = useCallback((key: string) => {
    const interval = intervalRefs.current.get(key);
    if (interval) {
      clearInterval(interval);
      intervalRefs.current.delete(key);
    }
  }, []);

  const stopAllPolling = useCallback(() => {
    intervalRefs.current.forEach((interval) => {
      clearInterval(interval);
    });
    intervalRefs.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllPolling();
    };
  }, [stopAllPolling]);

  return {
    startPolling,
    stopPolling,
    stopAllPolling,
  };
}
