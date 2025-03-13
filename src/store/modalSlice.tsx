import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSX } from 'react';

export interface ModalState {
    isOpen: boolean;
    modalType: 'course' | 'add-lesson' | 'alert' | 'standard' | 'confirm'
    title: string;
    content: JSX.Element;
    generateVideoOnConfirmSignal: boolean;
}

const initialState: ModalState = {
    isOpen: false,
    modalType: 'standard',
    title: '',
    content: <></>,
    generateVideoOnConfirmSignal: false
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{ modalType: 'course' | 'add-lesson' | 'alert' | 'standard' | 'confirm', title: string, content: JSX.Element, generateVideoOnConfirmSignal?: boolean }>) => {
            state.isOpen = true;
            state.modalType = action.payload.modalType;
            state.title = action.payload.title;
            state.content = action.payload.content;
            if (action.payload.generateVideoOnConfirmSignal !== undefined) {
             state.generateVideoOnConfirmSignal = action.payload.generateVideoOnConfirmSignal;
            }
        },
        openCourseModal: (state) => {
            state.isOpen = true;
            state.modalType = 'course';
        },
        openLessonModal: (state) => {
            state.isOpen = true;
            state.modalType = 'add-lesson';
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.modalType = 'standard';
            state.title = "";
            state.content = <></>;
        }
    }
});

export const { openModal, openCourseModal, openLessonModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
