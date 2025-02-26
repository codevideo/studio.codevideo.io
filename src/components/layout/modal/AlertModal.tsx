import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { closeModal } from '../../../store/modalSlice';

export interface AlertModalProps {
    message: string;
}

export const AlertModal = (props: AlertModalProps) => {
    const { message } = props;
    const dispatch = useAppDispatch();
    
    return (
        <div className="modal-content">
            <p>{message}</p>
            {/* <button onClick={() => dispatch(closeModal())}>OK</button> */}
        </div>
    );
};
