
import { IAction, ICourse, ILesson, isValidActions, isCourse, isLesson, Project, ProjectType } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";
import { pythonPrintExample } from "../components/pages/studio/examples/how-to-print-stuff/pythonPrintExample";

export interface UserProject {
    projectType: ProjectType
    project: Project
    created: string
    modified: string
}

export interface EditorState {
    projects: Array<UserProject>;
    currentProjectIndex: number;
    currentProject: UserProject | null;
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
}

const now = new Date().toISOString();

export const editorInitialState: EditorState = {
    projects: [{
        projectType: 'course',
        project: pythonPrintExample,
        created: now,
        modified: now,
    }],
    currentProjectIndex: 0,
    currentProject: {
        projectType: 'course',
        project: pythonPrintExample,
        created: now,
        modified: now,
    },
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
};

// helper to set the currentActions based on the current project type
const setCurrentActions = (state: EditorState, currentProject: UserProject) => {
    if (isCourse(currentProject.project)) {
        const currentLesson = currentProject.project.lessons[state.currentLessonIndex];
        if (currentLesson) {
            state.currentActions = currentLesson.actions;
        }
    }
    if (isLesson(currentProject.project)) {
        state.currentActions = currentProject.project.actions;
    }
    if (isValidActions(currentProject.project)) {
        state.currentActions = currentProject.project;
    }

    // also update the action index
    state.currentActionIndex = 0;

    // and the actions string
    state.actionsString = JSON.stringify(state.currentActions, null, 2);
}

const editorSlice = createSlice({
    name: "editor",
    initialState: editorInitialState,
    reducers: {
        setActions(state, action) {
            const currentProject = state.projects[state.currentProjectIndex]
            state.currentActions = action.payload;
            state.actionsString = JSON.stringify(action.payload, null, 2);
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
                if (isValidActions(currentProject.project)) {
                    currentProject.project = action.payload;
                    state.currentProject = currentProject;
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
            state.currentProject = null;
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
        }
    }
});

export const {
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
    setIsSoundOn
} = editorSlice.actions;

export default editorSlice.reducer;
