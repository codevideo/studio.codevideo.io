import { IPoint } from "@fullstackcraftllc/codevideo-types";
import { convertToContainerCoordinates } from "./convertToContainerCoordinates";

export const getCoordinatesOfEditor = (containerRef: React.RefObject<HTMLDivElement>): IPoint => {
    const editor = document.querySelector('[data-codevideo-id="editor"]');
    if (!editor) return { x: 0, y: 0 };
    console.log('editor', editor);
    const rect = editor.getBoundingClientRect();
    return convertToContainerCoordinates({
      x: rect.left + 50,  // Position inside editor
      y: rect.top + 50    // Position inside editor
    }, containerRef);
  };