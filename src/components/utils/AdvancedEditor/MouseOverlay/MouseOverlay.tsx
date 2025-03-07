import React, { useRef,  } from 'react';
import { GUIMode, IPoint } from '@fullstackcraftllc/codevideo-types';
import { Box } from '@radix-ui/themes';

interface IMouseOverlayProps {
  mode: GUIMode
  mousePosition: IPoint;
  mouseVisible: boolean;
}

export const MouseOverlay = (props: IMouseOverlayProps) => {
  const { mode, mouseVisible, mousePosition } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  if (!mouseVisible) {
    return <></>
  }

  // only animate mouse movement in replay mode - in step mode, we will "jump" from location to location when in step mode
  const transition = mode === 'replay' ? 'transform 0.75s ease-in-out' : undefined;

  return (
    <Box
      id="mouse-overlay"
      ref={overlayRef}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(0.8)`,
        transition,
        zIndex: 100000000,
        position: 'absolute',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z"
          fill="black"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  );
};