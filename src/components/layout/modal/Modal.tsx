import * as React from 'react';
import {
    Dialog,
    Box,
    Flex,
    Button,
    Card,
    Text,
    Heading
} from '@radix-ui/themes';
import { closeModal, setCallbackId } from '../../../store/modalSlice';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { LessonMetadataForm } from '../sidebar/LessonMetadataForm';
import { CourseMetadataForm } from '../sidebar/CourseMetadataForm';
import { extractActionsFromProject } from '@fullstackcraftllc/codevideo-types';
import { estimateVideoDurationInSeconds } from '../../../utils/estimateVideoDurationInSeconds';
import { formatDuration } from '../../../utils/formatDuration';

export const Modal = () => {
    const { currentProject, currentLessonIndex } = useAppSelector(state => state.editor);
    const { isOpen, modalType, title } = useAppSelector(state => state.modal);
    const dispatch = useAppDispatch();

    if (!isOpen) return null;

    const onClickClose = () => {
        if (modalType === 'confirm-codevideo-generation') {
            // need to trigger video generation here   
            dispatch(setCallbackId('confirm-codevideo-generation'));
        }
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
            case 'alert-fields':
                return (
                    <Flex direction="column" gap="4" align="center" justify="center">
                        <Box style={{ color: 'var(--mint-9)' }}>
                            <Text>Please fill in all required fields</Text>
                        </Box>
                    </Flex>
                )
            case 'confirm-codevideo-generation':
                if (!currentProject) return <></>;
                const actions = extractActionsFromProject(currentProject.project, currentLessonIndex);
                const { totalDuration } = estimateVideoDurationInSeconds(actions);
                const estimatedLength = formatDuration(totalDuration)
                return (
                    <Flex direction="column" gap="4" align="center" justify="center">
                        <Box style={{ color: 'var(--mint-9)' }}>
                            <Text>
                                Ready to convert your project into a video? Please double check your actions to make sure everything is exactly how you want it!
                                <br />
                                <br />
                                Your CodeVideo will be generated in two steps:
                                <br />
                                <br />
                                1. We generate all the audio needed for the video - when this step completes, you'll get a confirmation here in the studio.
                                <br />2. We create the video with the audio inserted.
                                <br />
                                <br />
                                Your video has <b>{actions.length}</b> actions and has an estimated length of <b>{estimatedLength}</b>. Video generation will take a similar amount of time - we thank you for your patience!
                            </Text>
                        </Box>
                    </Flex>
                )
            case 'video-queued':
                return (
                    <Flex direction="column" gap="4" align="center" justify="center">
                        <Box style={{ color: 'var(--mint-9)' }}>
                            <Text>The audio generation step completed successfully and your CodeVideo is being generated! You'll receive an email with a link to download the mp4 as soon as it's uploaded.</Text>
                        </Box>
                    </Flex>
                )
            case 'alert-error-creating-codevideo':
                return (
                    <Flex direction="column" gap="4" align="center" justify="center">
                        <Box style={{ color: 'var(--mint-9)' }}>
                            <Text>There was an error creating your CodeVideo. Please try again.</Text>
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
                            {modalType === 'confirm-codevideo-generation' && (
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
                                {modalType === 'confirm-codevideo-generation' ? 'OK' : 'Close'}
                            </Button>
                        </>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};