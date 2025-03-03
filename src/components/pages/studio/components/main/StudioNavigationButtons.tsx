import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setActions, setCurrentActionIndex, setIsFullScreen, setIsPlaying } from '../../../../../store/editorSlice';
import { setIsRecording, turnOffRecording } from '../../../../../store/recordingSlice';
import { useRecordActions } from '../../../../../hooks/useRecordActions';
import { Flex, Button } from '@radix-ui/themes';
import { ActionCounter } from '../../../../utils/ActionCounter';
import { EnterFullScreenIcon } from '@radix-ui/react-icons';
import { addToast } from '../../../../../store/toastSlice';

export function StudioNavigationButtons() {
    const { currentActions, currentActionIndex, isFullScreen, isPlaying } = useAppSelector(state => state.editor);
    const { isRecording, collectedRecordedActions } = useAppSelector(state => state.recording);
    const dispatch = useAppDispatch();
    useRecordActions();

    const handleFirst = () => {
        dispatch(setCurrentActionIndex(0));
    }

    const handleJumpBackward = () => {
        dispatch(setCurrentActionIndex(Math.max(0, currentActionIndex - 10)));
    }

    const handlePrevious = () => {
        dispatch(setCurrentActionIndex(Math.max(0, currentActionIndex - 1)));
    };

    const handleNext = () => {
        dispatch(setCurrentActionIndex(Math.min(currentActions.length - 1, currentActionIndex + 1)));
    };

    const handleJumpForward = () => {
        dispatch(setCurrentActionIndex(Math.min(currentActions.length - 1, currentActionIndex + 10)));
    }

    const handleLast = () => {
        dispatch(setCurrentActionIndex(currentActions.length - 1));
    }

    const handlePlayback = () => {
        // if we are turning off playback, just need to stop
        if (isPlaying) {
            dispatch(setIsPlaying(false))
        } else {
            // if we are activating playback, we also need to ensure recording is off
            dispatch(addToast(`Playback starting...`));
            dispatch(setIsPlaying(true))
            dispatch(setIsRecording(false))
            // also always trigger the first action when starting playback
            dispatch(setCurrentActionIndex(0))
        }
    }

    const handleRecord = () => {
        // if we are turning off recording, insert the collected actions into the current actions at the current index
        if (isRecording) {

            // if collected actions is empty, just turn off recording, nothing more to do
            if (collectedRecordedActions.length === 0) {
                dispatch(addToast(`No actions recorded.`));
                dispatch(turnOffRecording());
                return;
            }

            const newActions = [...currentActions];
            newActions.splice(currentActionIndex + 1, 0, ...collectedRecordedActions);

            // set the new actions & update the current action index
            dispatch(setActions(newActions));
            dispatch(setCurrentActionIndex(currentActionIndex + collectedRecordedActions.length));

            dispatch(addToast(`Added ${collectedRecordedActions.length} new actions to the project.`));

            // clean up recording state
            dispatch(turnOffRecording());
        } else {
            dispatch(setIsPlaying(false));
            dispatch(setIsRecording(true));
        }
    }

    const playButtonText = isPlaying ? `Stop` : <>Playback<sup style={{ fontSize: '0.5rem', paddingBottom: '1rem' }}>Beta</sup></>;
    const recordButtonText = isRecording ? `Stop` : <>Record<sup style={{ fontSize: '0.5rem', paddingBottom: '1rem' }}>Beta</sup></>;

    return (
        <Flex
            justify="between"
            align="center"
            pb="3"
        >
            <Flex gap="2" align="center">
                <Button
                    onClick={handleFirst}
                    disabled={currentActionIndex === 0 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === 0 ? 0.5 : 1,
                        cursor: currentActionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {'<<<'} First
                </Button>
                <Button
                    onClick={handleJumpBackward}
                    disabled={currentActionIndex === 0 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === 0 ? 0.5 : 1,
                        cursor: currentActionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    -10 {'<<'}
                </Button>
                <Button
                    onClick={handlePrevious}
                    disabled={currentActionIndex === 0 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === 0 ? 0.5 : 1,
                        cursor: currentActionIndex === 0 ? 'not-allowed' : 'pointer'
                    }}
                >
                    {'<'} Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === currentActions.length - 1 ? 0.5 : 1,
                        cursor: currentActionIndex === currentActions.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Next {'>'}
                </Button>
                <Button
                    onClick={handleJumpForward}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === currentActions.length - 1 ? 0.5 : 1,
                        cursor: currentActionIndex === currentActions.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    +10 {'>>'}
                </Button>
                <Button
                    onClick={handleLast}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    style={{
                        opacity: currentActionIndex === currentActions.length - 1 ? 0.5 : 1,
                        cursor: currentActionIndex === currentActions.length - 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Last {'>>>'}
                </Button>
                <ActionCounter />
            </Flex>
            <Flex align="center" gap="2">
                <Button
                    title={isPlaying ? 'Stop playback' : 'Start playing actions (beta)'}
                    onClick={handlePlayback}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                >
                    {playButtonText}
                </Button>
                <Button
                    title={isRecording ? 'Stop recording' : 'Start recording actions (beta)'}
                    onClick={handleRecord}
                    color="red"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                >
                    {recordButtonText}
                </Button>
                <Button
                    title='Toggle Full Screen'
                    onClick={() => dispatch(setIsFullScreen(!isFullScreen))}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                >
                    <EnterFullScreenIcon />
                </Button>
            </Flex>
        </Flex>
    );
}