import { IPoint } from "@fullstackcraftllc/codevideo-types";
import { convertToContainerCoordinates } from "./convertToContainerCoordinates";

export const getCoordinatesOfFileOrFolder = (fileOrFolderPath: string, containerRef: React.RefObject<HTMLDivElement>): IPoint => {
    console.log('fileOrFolderPath', fileOrFolderPath);
    const fileElement = document.querySelector(`[data-codevideo-id="file-explorer-${fileOrFolderPath}"]`);

    // TODO: happens quite a lot, need to rearrange when the file tree is ready to be found.
    if (!fileElement) {
        // console.log('fileElement not found');
        return { x: 0, y: 0 };
    }
    // console.log('fileElement', fileElement);
    const rect = fileElement.getBoundingClientRect();
    return convertToContainerCoordinates({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    }, containerRef);
};