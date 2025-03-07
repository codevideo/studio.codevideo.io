import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
//@ts-ignore
import gifshot from 'gifshot';

interface GifshotResponse {
  error: boolean;
  image: string;
}

export function useGifRecorder(
  elementId: string,
  isRecording: boolean,
  captureInterval: number = 1000 // lower value for higher FPS (e.g., 100ms ~ 10 FPS)
): { progress: number } {
  const framesRef = useRef<string[]>([]);
  const intervalRef = useRef<number | null>(null);
  const dimensionsRef = useRef<{ width: number; height: number } | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    if (isRecording) {
      // Reset progress and frames when starting a new recording.
      setProgress(0);
      framesRef.current = [];
      const element = document.getElementById(elementId);
      if (element) {
        dimensionsRef.current = {
          width: element.offsetWidth,
          height: element.offsetHeight,
        };
      }
      intervalRef.current = window.setInterval(() => {
        const element = document.getElementById(elementId);
        if (element) {
          // Capture the element at its native resolution.
          html2canvas(element, { scale: window.devicePixelRatio || 1 }).then(canvas => {
            framesRef.current.push(canvas.toDataURL('image/png'));
          });
        }
      }, captureInterval);
    } else {
      // Stop capturing screenshots.
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Generate the GIF if any frames were captured.
      if (framesRef.current.length > 0) {
        gifshot.createGIF(
          {
            images: framesRef.current,
            interval: captureInterval / 1000, // gifshot expects seconds
            gifWidth: dimensionsRef.current?.width,
            gifHeight: dimensionsRef.current?.height,
            progressCallback: (captureProgress: number) => {
              // Convert progress (0 to 1) to percentage (0 to 100)
              setProgress(Math.round(captureProgress * 100));
            },
          },
          (obj: GifshotResponse) => {
            if (!obj.error) {
              // Trigger a download of the GIF.
              const link = document.createElement('a');
              link.href = obj.image;
              link.download = 'codevideo-export.gif';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              setProgress(100);
            }
          }
        );
      } else {
        setProgress(100);
      }
    }
    // Cleanup the interval on unmount or when dependencies change.
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording, elementId, captureInterval]);

  return { progress };
}
