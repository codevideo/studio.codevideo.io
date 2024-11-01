
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";
import { IEditorProject } from "../interfaces/IEditorProject";
import { javaScriptExampleSteps } from "../components/pages/studio/examples/stepsExamples";
import { defaultExampleProject, projectExamples } from "../components/pages/studio/examples/projectExamples";

export interface EditorState {
    actions: Array<IAction>;
    codeIndex: number;
    currentProject: IEditorProject | null;
    allProjects: IEditorProject[];
}

export const editorInitialState: EditorState = {
    actions: javaScriptExampleSteps,
    codeIndex: 0,
    currentProject: defaultExampleProject,
    allProjects: projectExamples,
};

const editorSlice = createSlice({
    name: "editor",
    initialState: editorInitialState,
    reducers: {
        setActions(state, action) {
            state.actions = action.payload;
        },
        setCodeIndex(state, action) {
            state.codeIndex = action.payload;
        },
        setCurrentProject(state, action) {
            state.currentProject = action.payload;
        },
        setAllProjects(state, action) {
            state.allProjects = action.payload;
        }
    }
});

export const { setActions, setCodeIndex, setCurrentProject, setAllProjects } = editorSlice.actions;

export default editorSlice.reducer;