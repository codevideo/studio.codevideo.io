import { useEffect } from 'react';
import { handleMonacoCancellations } from '../utils/monacoCancellation';

export function useMonacoCancellationHandling() {
  // Keep the listener through route transitions too: Monaco can finish cancelling
  // after its preview has unmounted. App owns the matching listener's lifetime.
  useEffect(() => handleMonacoCancellations(window), []);
}
