import { pythonPrintExample } from "../../components/pages/studio/examples/how-to-print-stuff/pythonPrintExample";
import { UserProject } from "../../store/editorSlice";
import { CODEVIDEO_PROJECTS } from "./PersistenceConstants";

export const fallbackProjects: Array<UserProject> = [{
    projectType: 'course',
    project: pythonPrintExample,
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
}];

export const loadProjectsFromLocalStorage = (): Array<UserProject> => {
    try {
        const parsedProjects = JSON.parse(localStorage.getItem(CODEVIDEO_PROJECTS) || '[]');
        if (!Array.isArray(parsedProjects)) {
            throw new Error('Invalid projects in local storage');
        }

        if (parsedProjects.length === 0) {
            console.log('No projects found in local storage, using fallback projects');
            return fallbackProjects;
        }

        return parsedProjects;
    }
    catch (e) {
        console.error('Error reading projects from local storage:', e);
        return fallbackProjects;
    }
}