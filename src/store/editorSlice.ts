
import { IAction, ICourse, ILesson, isValidActions, isCourse, isLesson, Project, ProjectType } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";
import { pythonPrintExample } from "../components/pages/studio/examples/how-to-print-stuff/pythonPrintExample";
import { persistProjectsToLocalStorage } from "../utils/persistence/persistProjectsToLocalStorage";
import { fallbackProjects } from "../utils/persistence/loadProjectsFromLocalStorage";

export interface UserProject {
    projectType: ProjectType
    project: Project
    created: string
    modified: string
}

export interface EditorState {
    locationInStudio: 'select' | 'course' | 'lesson' | 'studio';
    projects: Array<UserProject>;
    currentProjectIndex: number;
    currentProject: UserProject | undefined;
    currentLessonIndex: number;
    currentActions: Array<IAction>;
    draftActionsString: string;
    actionsString: string;
    currentActionIndex: number;
    jumpFlag: boolean;
    mousePosition: { x: number; y: number };
    mouseVisible: boolean;
    isSidebarOpen: boolean;
    isFullScreen: boolean;
    isPlaying: boolean;
    isSoundOn: boolean;
    allowFocusInEditor: boolean;
}

const now = new Date().toISOString();

export const editorInitialState: EditorState = {
    locationInStudio: 'studio',
    projects: [],
    currentProjectIndex: 0,
    currentProject: undefined,
    currentLessonIndex: 0,
    currentActions: pythonPrintExample?.lessons[0]?.actions || [],
    draftActionsString: JSON.stringify([], null, 2),
    actionsString: JSON.stringify(pythonPrintExample?.lessons[0]?.actions, null, 2),
    currentActionIndex: 0,
    jumpFlag: false,
    mousePosition: { x: 20, y: 20 },
    mouseVisible: true,
    isSidebarOpen: false,
    isFullScreen: false,
    isPlaying: false,
    isSoundOn: false,
    allowFocusInEditor: true,
};

// helper to set the currentActions based on the current project type
const setCurrentActions = (state: EditorState, currentProject: UserProject) => {
    if (isCourse(currentProject.project)) {
        const currentLesson = currentProject.project.lessons[state.currentLessonIndex];
        if (currentLesson) {
            state.currentActions = currentLesson.actions;
        } else {
            state.currentLessonIndex = 0;
            const firstLesson = currentProject.project.lessons[state.currentLessonIndex];
            if (firstLesson) {
                state.currentActions = firstLesson.actions;
            }
        }
    }
    if (isLesson(currentProject.project)) {
        state.currentActions = currentProject.project.actions;
    }
    if (isValidActions(currentProject.project)) {
        state.currentActions = currentProject.project;
    }

    // also update the action index to start at the beginning
    state.currentActionIndex = 0;

    // and update the actions string to reflect the current actions
    state.actionsString = JSON.stringify(state.currentActions, null, 2);
}

const editorSlice = createSlice({
    name: "editor",
    initialState: editorInitialState,
    reducers: {
        setLocationInStudio(state, action) {
            state.locationInStudio = action.payload;
        },
        setProjects(state, action) {
            // sort by last changed
            action.payload.sort((a: UserProject, b: UserProject) => {
                return new Date(b.modified).getTime() - new Date(a.modified).getTime();
            });

            state.projects = action.payload;
            state.currentProject = action.payload[0];
            state.currentProjectIndex = 0;
            if (state.currentProject) {
                setCurrentActions(state, state.currentProject);
            }
        },
        setActions(state, action) {
            // set current actions and actions string immediately
            state.currentActions = action.payload;
            state.actionsString = JSON.stringify(action.payload, null, 2);
            const copyOfProjects = [...state.projects];
            console.log('state.projects', copyOfProjects)
            console.log('state.currentProjectIndex', state.currentProjectIndex)
            console.log('state.currentProjectIndex', copyOfProjects[state.currentProjectIndex])

            // update the actions on the current project
            const currentProject = state.projects[state.currentProjectIndex]
            if (currentProject) {
                if (isCourse(currentProject.project)) {
                    const currentLesson = currentProject.project.lessons[state.currentLessonIndex];
                    if (currentLesson) {
                        currentLesson.actions = action.payload;
                        currentProject.project.lessons[state.currentLessonIndex] = currentLesson;
                    }
                    state.currentProject = currentProject;
                }
                if (isLesson(currentProject.project)) {
                    currentProject.project.actions = action.payload;
                    state.currentProject = currentProject;
                }
                if (isValidActions(action.payload)) {
                    console.log('setting actions to actions project!')
                    currentProject.project = action.payload;
                    state.currentProject = currentProject;
                }
                // now make sure the projects array itself is updated and persisted
                if (copyOfProjects[state.currentProjectIndex]) {
                    (copyOfProjects[state.currentProjectIndex] as any) = state.currentProject
                    state.projects = copyOfProjects;
                    persistProjectsToLocalStorage(copyOfProjects);
                }
            }
            
        },
        setDraftActionsString(state, action) {
            state.draftActionsString = action.payload;
        },
        setCurrentActionIndex(state, action) {
            state.currentActionIndex = action.payload;
        },
        setCurrentProjectIndex(state, action) {
            state.currentProjectIndex = action.payload;
            const currentProject = state.projects[action.payload];
            if (currentProject) {
                state.currentProject = currentProject;
                setCurrentActions(state, currentProject);
            }
        },
        setJumpFlag(state, action) {
            state.jumpFlag = action.payload;
        },
        setMousePosition(state, action) {
            state.mousePosition = action.payload;
        },
        setMouseVisible(state, action) {
            state.mouseVisible = action.payload;
        },
        addNewCourseToProjects(state, action) {
            state.projects.push({
                projectType: 'course',
                project: action.payload as ICourse,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            })
            
            state.currentProjectIndex = state.projects.length - 1;
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                state.currentProject = currentProject;
                state.currentLessonIndex = 0;
                setCurrentActions(state, currentProject);
            }
        },
        addNewLessonToProjects(state, action) {
            console.log("ADDING NEW LESSON")
            state.projects.push({
                projectType: 'lesson',
                project: action.payload as ILesson,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            })

            state.currentProjectIndex = state.projects.length - 1;
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                state.currentProject = currentProject;
                state.currentLessonIndex = 0;
                setCurrentActions(state, currentProject);
            }
        },
        addNewActionsToProjects(state, action) {
            state.projects.push({
                projectType: 'actions',
                project: action.payload as Array<IAction>,
                created: new Date().toISOString(),
                modified: new Date().toISOString(),
            })

            state.currentProjectIndex = state.projects.length - 1;
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                state.currentProject = currentProject;
                state.currentLessonIndex = 0;
                setCurrentActions(state, currentProject);
            }
        },
        setCourseMetadata(state, action) {
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                const currentCourse = currentProject.project as ICourse;
                currentCourse.id = action.payload.id;
                currentCourse.name = action.payload.name;
                currentCourse.description = action.payload.description;
            }
        },
        addLessonToCourse(state, action) {
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                const currentCourse = currentProject.project as ICourse;
                currentCourse.lessons.push(action.payload);
            }
        },
        setLessonMetadata(state, action) {
            const currentProject = state.projects[state.currentProjectIndex];
            if (currentProject) {
                const currentCourse = currentProject.project as ICourse;
                const currentLesson = currentCourse.lessons[state.currentActionIndex] as ILesson;
                currentLesson.id = action.payload.id;
                currentLesson.name = action.payload.name;
                currentLesson.description = action.payload.description;
            }
        },
        createNewProject(state) {
            state.currentProjectIndex = -1;
            state.currentProject = undefined;
            state.currentLessonIndex = -1;
            state.currentActions = [];
            state.actionsString = JSON.stringify([], null, 2);
            state.currentActionIndex = -1;
            state.jumpFlag = false;
            state.mousePosition = { x: 20, y: 20 };
            state.mouseVisible = true;
        },
        toggleSidebar(state) {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setIsSidebarOpen(state, action) {
            state.isSidebarOpen = action.payload;
        },
        setIsFullScreen(state, action) {
            state.isFullScreen = action.payload;
        },
        setIsPlaying(state, action) {
            state.isPlaying = action.payload;
        },
        setIsSoundOn(state, action) {
            state.isSoundOn = action.payload;
        },
        setAllowFocusInEditor(state, action) {
            state.allowFocusInEditor = action.payload;
        }
    }
});

export const {
    setLocationInStudio,
    setProjects,
    addNewCourseToProjects,
    addNewLessonToProjects,
    addNewActionsToProjects,
    setActions,
    setDraftActionsString,
    setCurrentActionIndex,
    setCurrentProjectIndex,
    setJumpFlag,
    setMousePosition,
    setMouseVisible,
    setLessonMetadata,
    setCourseMetadata,
    addLessonToCourse,
    createNewProject,
    toggleSidebar,
    setIsSidebarOpen,
    setIsFullScreen,
    setIsPlaying,
    setIsSoundOn,
    setAllowFocusInEditor
} = editorSlice.actions;

export default editorSlice.reducer;
