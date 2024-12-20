
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";
import { IEditorProject } from "../interfaces/IEditorProject";
import { javaScriptExampleSteps } from "../components/pages/studio/examples/stepsExamples";
import { defaultExampleProject, projectExamples } from "../components/pages/studio/examples/projectExamples";

export interface EditorState {
    actions: Array<IAction>;
    actionsString: string;
    codeIndex: number;
    currentProject: IEditorProject | null;
    allProjects: IEditorProject[];
    jumpFlag: boolean;
    mousePosition: { x: number; y: number };
    mouseVisible: boolean;
}

export const editorInitialState: EditorState = {
    actions: javaScriptExampleSteps,
    actionsString: JSON.stringify(javaScriptExampleSteps, null, 2),
    codeIndex: 0,
    currentProject: defaultExampleProject,
    allProjects: projectExamples,
    jumpFlag: false,
    mousePosition: { x: 0, y: 0 },
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
