import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TutorialState {
    isTutorialRunning: boolean;
}

const initialState: TutorialState = {
    isTutorialRunning: false,
};

const tutorialSlice = createSlice({
    name: 'tutorial',
    initialState,
    reducers: {
        startTutorial: (state) => {
            state.isTutorialRunning = true;
        },
        endTutorial: (state) => {
            state.isTutorialRunning = false;
        }
    }
});

export const { startTutorial, endTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;