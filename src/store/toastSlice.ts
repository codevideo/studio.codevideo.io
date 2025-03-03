import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastMessage {
    id: string;
    message: string;
}

export interface ToastState {
    toasts: ToastMessage[];
}

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        addToast: (state, action: PayloadAction<string>) => {
            state.toasts.push({
                id: Date.now().toString(), // Simple unique ID
                message: action.payload,
            });
        },
        removeToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
        }
    }
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;