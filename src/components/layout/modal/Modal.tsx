import * as React from 'react';
import {
    Dialog,
    Box,
    Flex,
    Button,
    Card,
    Heading
} from '@radix-ui/themes';
import { AlertModal } from './AlertModal';
import { closeModal } from '../../../store/modalSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { LessonMetadataForm } from '../sidebar/LessonMetadataForm';
import { CourseMetadataForm } from '../sidebar/CourseMetadataForm';

export const Modal = () => {
    const { isOpen, modalType, title, content } = useAppSelector(state => state.modal);
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const onClickClose = () => {
        dispatch(closeModal())
    }

    const onClickCancel = () => {
        dispatch(closeModal());
    }

    const renderModalContent = () => {
        switch (modalType) {
            case 'course':
                return <CourseMetadataForm forEdit={false} />;
            case 'add-lesson':
                return <LessonMetadataForm forCourse={false} forNewLesson={true} forEdit={false} />;
            case 'alert':
                return <AlertModal content={content} />;
            case 'standard':
            case 'confirm':
                return (
                    <Flex direction="column" gap="4" align="center" justify="center">
                        <Box style={{ color: 'var(--mint-9)' }}>
                            {content}
                        </Box>
                    </Flex>
                )
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
                <Dialog.Title>{title}</Dialog.Title>
                <Box style={{ color: 'var(--mint-9)' }}>
                    {renderModalContent()}
                </Box>
                <Flex justify="end" mt="4">
                    <Dialog.Close>
                        <>
                        {modalType === 'confirm' && (
                            <Button
                                onClick={onClickCancel}
                                variant="soft"
                                color="red"
                                mr="2"
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            onClick={onClickClose}
                            variant="soft"
                            color="mint"
                        >
                            {modalType === 'confirm' ? 'OK' : 'Close'}
                        </Button>
                        </>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};