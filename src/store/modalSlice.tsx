import React from 'react';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JSX } from 'react';

export interface ModalState {
    isOpen: boolean;
    modalType: 'course' | 'add-lesson' | 'alert-fields' | 'standard' | 'confirm' | 'confirm-video' | 'video-queued' | 'alert-error-creating-codevideo' | 'confirm-codevideo-generation'
    title: string;
    callbackId: string;
}

const initialState: ModalState = {
    isOpen: false,
    modalType: 'standard',
    title: '',
    callbackId: ''
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{ modalType: 'course' | 'add-lesson' | 'alert-fields' | 'standard' | 'confirm' | 'video-queued' | 'alert-error-creating-codevideo' | 'confirm-codevideo-generation', title: string}>) => {
            state.isOpen = true;
            state.modalType = action.payload.modalType;
            state.title = action.payload.title;
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
        },
        setCallbackId: (state, action: PayloadAction<string>) => {
            state.callbackId = action.payload;
        }
    }
});

export const { openModal, openCourseModal, openLessonModal, closeModal, setCallbackId } = modalSlice.actions;
export default modalSlice.reducer;
