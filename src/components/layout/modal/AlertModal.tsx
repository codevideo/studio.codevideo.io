import * as React from 'react';
import { Box, Text } from '@radix-ui/themes';
import { JSX } from 'react';

export interface AlertModalProps {
    content: JSX.Element;
}

export const AlertModal = (props: AlertModalProps) => {
    const { content } = props;
    
    return (
        <Box className="modal-content">
            <Text>{content}</Text>
        </Box>
    );
};
