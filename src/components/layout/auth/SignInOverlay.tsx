import React, { useEffect } from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Box, Flex } from '@radix-ui/themes';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setShowSignInOverlay } from '../../../store/authSlice';

export const SignInOverlay = () => {
    const { showSignInOverlay } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    
  // Prevent scrolling on body when overlay is open
  useEffect(() => {
    if (showSignInOverlay) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSignInOverlay]);

  // Handle escape key press to close overlay
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSignInOverlay) {
        dispatch(setShowSignInOverlay(false));
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [showSignInOverlay]);

  if (!showSignInOverlay) {
    return <></>
  }

  return (
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 999,
        }}
        onClick={() => dispatch(setShowSignInOverlay(false))}
      >
        <Flex
          justify="center"
          align="center"
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside the box from closing the overlay
          >
            <SignIn />
          </Box>
        </Flex>
      </Box>
  );
};