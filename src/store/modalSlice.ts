import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalState, ModalTypes } from '../types/modal';


const initialState: ModalState = {
    isOpen: false,
    modalType: null,
    modalProps: {}
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action: PayloadAction<{ type: ModalTypes; props?: Record<string, any> }>) => {
            state.isOpen = true;
            state.modalType = action.payload.type;
            state.modalProps = action.payload.props || {};
        },
        closeModal: (state) => {
            state.isOpen = false;
            state.modalType = null;
            state.modalProps = {};
        }
    }
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;
