
import { IAction } from "@fullstackcraftllc/codevideo-types";
import { createSlice } from "@reduxjs/toolkit";

export interface RecordingState {
    isRecording: boolean;
    isFileExplorerFocused: boolean;
    isEditorFocused: boolean;
    isTerminalFocused: boolean;
    atomicRecordedActions: IAction[];
    collectedRecordedActions: IAction[];
}

export const recordingInitialState: RecordingState = {
    isRecording: false,
    isFileExplorerFocused: false,
    isEditorFocused: false,
    isTerminalFocused: false,
    atomicRecordedActions: [],
    collectedRecordedActions: [],
};

const recordingSlice = createSlice({
    name: "recording",
    initialState: recordingInitialState,
    reducers: {
        setIsRecording(state, action) {
            state.isRecording = action.payload;
        },
        setIsFileExplorerFocused(state, action) {
            state.isFileExplorerFocused = action.payload;
            state.isEditorFocused = false;
            state.isTerminalFocused = false;
        },
        setIsEditorFocused(state, action) {
            state.isEditorFocused = action.payload;
            state.isFileExplorerFocused = false;
            state.isTerminalFocused = false;
        },
        setIsTerminalFocused(state, action) {
            state.isTerminalFocused = action.payload;
            state.isFileExplorerFocused = false;
            state.isEditorFocused = false;
        },
        setAtomicRecordedActions(state, action) {
            state.atomicRecordedActions = action.payload;
        },
        setCollectedRecordedActions(state, action) {
            state.collectedRecordedActions = action.payload
        },
        turnOffRecording(state) {
            state.isRecording = false;
            state.atomicRecordedActions = [];
            state.collectedRecordedActions = [];
            state.isFileExplorerFocused = false;
            state.isEditorFocused = false;
            state.isTerminalFocused = false;
        }
    }
});

export const { 
    setIsRecording,
    setIsFileExplorerFocused,
    setIsEditorFocused,
    setIsTerminalFocused,
    setAtomicRecordedActions,
    setCollectedRecordedActions,
    turnOffRecording
} = recordingSlice.actions;

export default recordingSlice.reducer;
