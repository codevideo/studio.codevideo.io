import * as React from 'react';
import {
    Dialog,
    Box,
    Flex,
    Button,
    Card
} from '@radix-ui/themes';
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
        <Dialog.Root open={isOpen} onOpenChange={() => dispatch(closeModal())}>
            <Dialog.Content
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    maxWidth: '42rem',
                    zIndex: 51
                }}
            >

                <Box style={{ color: 'var(--mint-9)' }}>
                    {renderModalContent()}
                </Box>
                <Flex justify="end" mt="4">
                    <Dialog.Close>
                        <Button
                            onClick={() => dispatch(closeModal())}
                            variant="soft"
                            color="mint"
                        >
                            Close
                        </Button>
                    </Dialog.Close>
                </Flex>

            </Dialog.Content>
        </Dialog.Root>
    );
};