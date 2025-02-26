import * as React from 'react';
import { ConfirmModal } from './ConfirmModal';
import { AlertModal } from './AlertModal';
import { closeModal } from '../../../store/modalSlice';
import { ModalTypes } from '../../../types/modal';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

export const Modal = () => {
    const { isOpen, modalType, modalProps } = useAppSelector(state => state.modal);
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const renderModalContent = () => {
        switch (modalType) {
            case ModalTypes.CONFIRM:
                return <ConfirmModal onConfirm={modalProps?.onConfirm} message={modalProps?.message} />;
            case ModalTypes.ALERT:
                return <AlertModal message={modalProps?.message} />;
            case ModalTypes.CUSTOM:
                return modalProps?.component;
            default:
                return null;
        }
    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
                    <div className="text-center text-slate-600 dark:text-slate-300">
                        {renderModalContent()}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => dispatch(closeModal())}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div> 
            </div>
        </div>
    );
};
