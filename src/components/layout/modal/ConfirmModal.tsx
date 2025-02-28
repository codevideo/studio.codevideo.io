import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { closeModal } from '../../../store/modalSlice';
import { Box, Button, Text } from '@radix-ui/themes';

export interface IConfirmModalProps {
    onConfirm: () => void;
    message: string;
}

export const ConfirmModal = (props: IConfirmModalProps) => {
    const { onConfirm, message } = props;
    const dispatch = useAppDispatch();
    
    return (
        <Box className="modal-content">
            <Text>{message}</Text>
            <Box className="modal-actions">
                <Button onClick={onConfirm}>Confirm</Button>
                <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
            </Box>
        </Box>
    );
};
