import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setActions, setAllowFocusInEditor, setCurrentActionIndex, setIsFullScreen, setIsPlaying, setIsSoundOn, setShowDevBox } from '../../../../../store/editorSlice';
import { setIsRecording, turnOffRecording } from '../../../../../store/recordingSlice';
import { useRecordActions } from '../../../../../hooks/useRecordActions';
import { Flex, Button } from '@radix-ui/themes';
import { ActionCounter } from '../../../../utils/ActionCounter';
import { EnterFullScreenIcon, SpeakerLoudIcon, SpeakerOffIcon, CodeIcon } from '@radix-ui/react-icons';
import { addToast } from '../../../../../store/toastSlice';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';
import { extractActionsFromProject } from '@fullstackcraftllc/codevideo-types';

export function StudioNavigationButtons() {
    const { currentProject, currentActionIndex, currentLessonIndex, isFullScreen, isPlaying, isSoundOn, showDevBox } = useAppSelector(state => state.editor);
    const { isRecording, collectedRecordedActions } = useAppSelector(state => state.recording);
    const dispatch = useAppDispatch();
    useRecordActions();
    const currentActions = extractActionsFromProject(currentProject?.project || [], currentLessonIndex);

    const handleFirst = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(0));
        }, 10);
    }

    const handleJumpBackward = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(Math.max(0, currentActionIndex - 10)));
        }, 10);
    }

    const handlePrevious = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(Math.max(0, currentActionIndex - 1)));
        }, 10);
    };

    const handleNext = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(Math.min(currentActions.length - 1, currentActionIndex + 1)));
        }, 10);
    };

    const handleJumpForward = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(Math.min(currentActions.length - 1, currentActionIndex + 10)));
        }, 10);
    }

    const handleLast = () => {
        dispatch(setAllowFocusInEditor(true));
        // Small delay to ensure focus management doesn't interfere with editor caret positioning
        setTimeout(() => {
            dispatch(setCurrentActionIndex(currentActions.length - 1));
        }, 10);
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
            dispatch(addToast(`Action recording in progress.`));
            dispatch(setIsPlaying(false));
            dispatch(setIsRecording(true));
        }
    }

    const playButtonText = isPlaying ? `Stop` : <>Playback Actions<sup style={{ fontSize: '0.5rem', paddingBottom: '1rem' }}>Beta</sup></>;
    const recordButtonText = isRecording ? `Stop` : <>Record Actions<sup style={{ fontSize: '0.5rem', paddingBottom: '1rem' }}>Beta</sup></>;

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
                    size="1"
                >
                    {'<<<'} First
                </Button>
                <Button
                    onClick={handleJumpBackward}
                    disabled={currentActionIndex === 0 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    size="1"
                >
                    -10 {'<<'}
                </Button>
                <Button
                    onClick={handlePrevious}
                    disabled={currentActionIndex === 0 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    size="1"
                >
                    {'<'} Previous
                </Button>
                <Button
                    onClick={handleNext}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    size="1"
                >
                    Next {'>'}
                </Button>
                <Button
                    className={TutorialCSSClassConstants.STUDIO_NAVIGATION_PLUS_TEN_BUTTON}
                    onClick={handleJumpForward}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    size="1"
                >
                    +10 {'>>'}
                </Button>
                <Button
                    onClick={handleLast}
                    disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
                    color="mint"
                    variant="soft"
                    size="1"
                >
                    Last {'>>>'}
                </Button>
                <ActionCounter />
            </Flex>
            <Flex align="center" gap="2">
                <Button
                    className={TutorialCSSClassConstants.PLAYBACK_BUTTON}
                    title={isPlaying ? 'Stop playback' : 'Start playing actions (beta)'}
                    onClick={handlePlayback}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                    disabled={isRecording}
                    size="1"
                >
                    {playButtonText}
                </Button>
                <Button
                    className={TutorialCSSClassConstants.RECORD_BUTTON}
                    title={isRecording ? 'Stop recording' : 'Start recording actions (beta)'}
                    onClick={handleRecord}
                    color="red"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                    disabled={isPlaying}
                    size="1"
                >
                    {recordButtonText}
                </Button>
                <Button
                    className={TutorialCSSClassConstants.CODE_TOGGLE_BUTTON}
                    title={showDevBox ? 'Hide CodeVideo IDE dev tools' : 'Show CodeVideo IDE dev tools'}
                    onClick={() => dispatch(setShowDevBox(!showDevBox))}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                    disabled={isPlaying || isRecording}
                    size="1"
                >
                    <CodeIcon />
                </Button>
                <Button
                    className={TutorialCSSClassConstants.SOUND_TOGGLE_BUTTON}
                    title={isSoundOn ? 'Turn sound off' : 'Turn sound on'}
                    onClick={() => dispatch(setIsSoundOn(!isSoundOn))}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                    disabled={isPlaying || isRecording}
                    size="1"
                >
                    {isSoundOn ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
                </Button>

                <Button
                    className={TutorialCSSClassConstants.FULL_SCREEN_BUTTON}
                    title='Toggle Full Screen'
                    onClick={() => dispatch(setIsFullScreen(!isFullScreen))}
                    color="mint"
                    variant="soft"
                    style={{ cursor: 'pointer' }}
                    disabled={isPlaying || isRecording}
                    size="1"
                >
                    <EnterFullScreenIcon />
                </Button>
            </Flex>
        </Flex>
    );
}