import { useState, useEffect } from 'react';

// Custom hook to detect if viewport is desktop size
export const useIsDesktop = (breakpoint = 768) => {
  // Initialize with server-side compatible check
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > breakpoint : true
  );

  useEffect(() => {
    // Handler to call on window resize
    const handleResize = () => {
      setIsDesktop(window.innerWidth > breakpoint);
    };
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Call handler right away to establish initial state
    handleResize();
    
    // Clean up on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isDesktop;
};
