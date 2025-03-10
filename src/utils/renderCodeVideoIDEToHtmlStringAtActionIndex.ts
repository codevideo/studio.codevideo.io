import { CODEVIDEO_IDE_ID } from '@fullstackcraftllc/codevideo-ide-react';
import html2canvas from 'html2canvas';

// TODO: move to codevideo-exporters
export const exportCodeVideoIDEToDataURL = async (): Promise<string | undefined> => {
  const element = document.getElementById(CODEVIDEO_IDE_ID);
  if (!element) {
    console.log('Could not find element with id:', CODEVIDEO_IDE_ID);
    return;
  }
  const canvas = await html2canvas(element, {
    scrollY: -window.scrollY,
    useCORS: true,
  })

  // Return the data URL of the rendered canvas.
  return canvas.toDataURL('image/png', 1.0);
};