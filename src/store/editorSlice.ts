
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
}

export const editorInitialState: EditorState = {
    actions: javaScriptExampleSteps,
    actionsString: JSON.stringify(javaScriptExampleSteps, null, 2),
    codeIndex: 0,
    currentProject: defaultExampleProject,
    allProjects: projectExamples,
    jumpFlag: false
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
        }
    }
});

export const { setActions, setActionsString, setCodeIndex, setCurrentProject, setAllProjects, setJumpFlag } = editorSlice.actions;

export default editorSlice.reducer;