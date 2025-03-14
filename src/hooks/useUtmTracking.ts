// src/hooks/useUtmTracking.ts
import { useEffect } from 'react';
import mixpanel from 'mixpanel-browser';

/**
 * Hook to extract UTM parameters from URL and track them in Mixpanel
 */
export const useUtmTracking = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    // Parse UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    const utmTerm = urlParams.get('utm_term');
    
    // Only proceed if we have at least one UTM parameter
    if (utmSource || utmMedium || utmCampaign || utmContent || utmTerm) {
      // Create an object to hold all non-null UTM parameters
      const utmParams: Record<string, string> = {};
      
      if (utmSource) utmParams.utm_source = utmSource;
      if (utmMedium) utmParams.utm_medium = utmMedium;
      if (utmCampaign) utmParams.utm_campaign = utmCampaign;
      if (utmContent) utmParams.utm_content = utmContent;
      if (utmTerm) utmParams.utm_term = utmTerm;
      
      // Track the UTM parameters in Mixpanel
      mixpanel.track('Campaign Visit', utmParams);
      
      // Set these as user properties for cohort analysis
      mixpanel.people.set(utmParams);
      
      // Store UTM data for attribution across sessions
      localStorage.setItem('utm_data', JSON.stringify(utmParams));
      localStorage.setItem('initial_landing_page', window.location.pathname);
      localStorage.setItem('landing_timestamp', new Date().toISOString());
    }
  }, []); // Empty dependency array ensures this runs once on mount
};

export default useUtmTracking;