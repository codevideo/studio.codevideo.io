import { UserProject } from "../../store/editorSlice";
import { CODEVIDEO_PROJECTS } from "./PersistenceConstants";

export const persistProjectsToLocalStorage = (projects: Array<UserProject>) => {
    localStorage.setItem(CODEVIDEO_PROJECTS, JSON.stringify(projects));
    console.log('persisted projects to local storage:', projects);
}