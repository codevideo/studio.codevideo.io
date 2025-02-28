import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeState {
    theme: 'light' | 'dark';
}

const initialState: ThemeState = {
    theme: 'dark'
};

const themeSlice = createSlice({
    name: 'Theme',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
            state.theme = action.payload;
        }
    }
});

export const { 
    setTheme 
} = themeSlice.actions;
export default themeSlice.reducer;
