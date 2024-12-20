import { useEffect, useRef } from 'react';

export const useScrollToActiveStep = (
  containerRef: React.RefObject<HTMLDivElement>,
  activeIndex: number,
  totalItems: number
) => {
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize or update refs array when total items change
  useEffect(() => {
    stepRefs.current = stepRefs.current.slice(0, totalItems);
  }, [totalItems]);

  // Handle scrolling when activeIndex changes
  useEffect(() => {
    if (
      containerRef.current && 
      stepRefs.current[activeIndex] && 
      activeIndex >= 0 && 
      activeIndex < totalItems
    ) {
      const container = containerRef.current;
      const activeStep = stepRefs.current[activeIndex];
      
      const containerRect = container.getBoundingClientRect();
      const stepRect = activeStep.getBoundingClientRect();
      
      // Calculate the scroll position to place the active step at the top
      const scrollTop = container.scrollTop + (stepRect.top - containerRect.top);
      
      // Immediately scroll to position without smooth behavior
      container.scrollTop = scrollTop;
    }
  }, [activeIndex, totalItems]);

  return {
    stepRefs,
    registerStepRef: (index: number) => (node: HTMLDivElement | null) => {
      stepRefs.current[index] = node;
    }
  };
};