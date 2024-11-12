import { IAction } from "@fullstackcraftllc/codevideo-types";
import { IFileStructure } from "./IFileStructure";

// TODO: move to codevideo-types package
// represents a full editor project, with one or more files, etc etc
export interface IEditorProject {
    id: string;
    name: string;
    description: string;
    language: string;
    steps: Array<IAction>;
    fileStructure: IFileStructure;
    selectedFile: string;
    openFiles: string[];
}