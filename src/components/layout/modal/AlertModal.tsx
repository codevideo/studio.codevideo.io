import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { closeModal } from '../../../store/modalSlice';
import { Box, Text } from '@radix-ui/themes';

export interface AlertModalProps {
    message: string;
}

export const AlertModal = (props: AlertModalProps) => {
    const { message } = props;
    
    return (
        <Box className="modal-content">
            <Text>{message}</Text>
        </Box>
    );
};
