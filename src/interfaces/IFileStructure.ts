export interface IFileStructure {
    [key: string]: FileItem;
  }
  
  interface BaseFileItem {
    content: string;
    type: 'file' | 'directory';
  }
  
  interface FileLeaf extends BaseFileItem {
    type: 'file';
    language: string;
  }
  
  interface DirectoryNode extends BaseFileItem {
    type: 'directory';
    children?: IFileStructure;
  }
  
  export type FileItem = FileLeaf | DirectoryNode;
  
  // Type guard to check if an item is a file
  export function isFile(item: FileItem): item is FileLeaf {
    return item.type === 'file';
  }
  
  // Type guard to check if an item is a directory
  export function isDirectory(item: FileItem): item is DirectoryNode {
    return item.type === 'directory';
  }