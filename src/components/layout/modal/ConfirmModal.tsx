import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { closeModal } from '../../../store/modalSlice';

export interface IConfirmModalProps {
    onConfirm: () => void;
    message: string;
}

export const ConfirmModal = (props: IConfirmModalProps) => {
    const { onConfirm, message } = props;
    const dispatch = useAppDispatch();
    
    return (
        <div className="modal-content">
            <p>{message}</p>
            <div className="modal-actions">
                <button onClick={onConfirm}>Confirm</button>
                <button onClick={() => dispatch(closeModal())}>Cancel</button>
            </div>
        </div>
    );
};
