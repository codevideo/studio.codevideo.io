import { IPoint } from "@fullstackcraftllc/codevideo-types";
import { convertToContainerCoordinates } from "./convertToContainerCoordinates";

export const getCoordinatesOfTerminalInput = (containerRef: React.RefObject<HTMLDivElement>): IPoint => {
    const terminal = document.querySelector('[data-codevideo-id="terminal"]');
    if (!terminal) return { x: 0, y: 0 };
    // console.log('terminal element', terminal);
    const rect = terminal.getBoundingClientRect();
    return convertToContainerCoordinates({
      x: rect.left + 20, // Add padding for prompt
      y: rect.top + 20   // Position near top of terminal
    }, containerRef);
  };