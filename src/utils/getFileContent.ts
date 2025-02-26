import { IFileStructure } from "@fullstackcraftllc/codevideo-types";

export const getFileContent = (
    filePath?: string | null,
    fileStructure?: IFileStructure,
): string | null => {
    if (!fileStructure || !filePath) {
        return null;
    }
    // Split the path into parts
    const pathParts = filePath.split('/');

    // Start with the root structure
    let current = fileStructure;

    // For each part of the path except the last (which is the file)
    for (let i = 0; i < pathParts.length - 1; i++) {
        const part: any = pathParts[i];
        const node = current[part];

        // If we hit a non-existent path or a file when we expect a directory, return null
        if (!node || node.type !== 'directory' || !node.children) {
            return null;
        }

        // Move to the next level
        current = node.children;
    }

    // Get the file from the final directory
    const fileName: any = pathParts[pathParts.length - 1];
    const file = current[fileName];

    // Check if it's a file and return its content
    if (file && file.type === 'file') {
        return file.content;
    }

    return null;
}