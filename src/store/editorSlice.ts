
import { IAction, ICourse } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";
import { javaScriptExampleActions } from "../components/pages/studio/examples/actionsExamples";
import { allProjects } from "../components/pages/studio/examples/allProjects";
import { defaultExampleProject } from "../components/pages/studio/examples/defaultExampleProject";

export interface EditorState {
    actions: Array<IAction>;
    actionsString: string;
    codeIndex: number;
    currentProject: ICourse | null;
    allProjects: ICourse[];
    jumpFlag: boolean;
    mousePosition: { x: number; y: number };
    mouseVisible: boolean;
}

export const editorInitialState: EditorState = {
    actions: javaScriptExampleActions,
    actionsString: JSON.stringify(javaScriptExampleActions, null, 2),
    codeIndex: 0,
    currentProject: defaultExampleProject,
    allProjects,
    jumpFlag: false,
    mousePosition: { x: 20, y: 20 },
    mouseVisible: true
};

const editorSlice = createSlice({
    name: "editor",
    initialState: editorInitialState,
    reducers: {
        setActions(state, action) {
            state.actions = action.payload;
        },
        setActionsString(state, action) {
            state.actionsString = action.payload
        },
        setCodeIndex(state, action) {
            state.codeIndex = action.payload;
        },
        setCurrentProject(state, action) {
            state.currentProject = action.payload;
        },
        setAllProjects(state, action) {
            state.allProjects = action.payload;
        },
        setJumpFlag(state, action) {
            state.jumpFlag = action.payload;
        },
        setMousePosition(state, action) {
            state.mousePosition = action.payload;
        },
        setMouseVisible(state, action) {
            state.mouseVisible = action.payload;
        }
    }
});

export const { 
    setActions, 
    setActionsString, 
    setCodeIndex, 
    setCurrentProject, 
    setAllProjects, 
    setJumpFlag,
    setMousePosition,
    setMouseVisible
} = editorSlice.actions;

export default editorSlice.reducer;
