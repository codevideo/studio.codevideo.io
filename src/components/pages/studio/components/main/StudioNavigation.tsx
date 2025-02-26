import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { setCurrentActionIndex } from '../../../../../store/editorSlice';
import { setIsRecording, turnOffRecording } from '../../../../../store/recordingSlice';
import { useRecordActions } from '../../../../../hooks/useRecordActions';

export function StudioNavigation() {
    const { currentActions, currentActionIndex } = useAppSelector(state => state.editor);
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

    const handleRecord = () => {
        // if we are turning off recording, insert the collected actions into the current actions at the current index
        if (isRecording) {
            const newActions = [...currentActions];
            newActions.splice(currentActionIndex + 1, 0, ...collectedRecordedActions);
            
            dispatch(setCurrentActionIndex(currentActionIndex + collectedRecordedActions.length));

            // clean up recording state
            dispatch(turnOffRecording());
        } else {
            dispatch(setIsRecording(true));
        }
    }

    const recordButtonText = isRecording ? `Stop Recording and Insert from Steps from ${currentActionIndex + 1}` : `Start Recording from Step ${currentActionIndex + 1}`;

    return (
        <div className="border-b border-slate-700 p-4 flex items-center justify-between bg-slate-800">
            <div className="flex gap-2">
                <button
                    onClick={handleFirst}
                    disabled={currentActionIndex === 0}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {'<<<'} First
                </button>
                <button
                    onClick={handleJumpBackward}
                    disabled={currentActionIndex === 0}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    -10 {'<<'}
                </button>
                <button
                    onClick={handlePrevious}
                    disabled={currentActionIndex === 0}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {'<'} Previous
                </button>
                <button
                    onClick={handleNext}
                    disabled={currentActionIndex === currentActions.length - 1}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next {'>'}
                </button>
                <button
                    onClick={handleJumpForward}
                    disabled={currentActionIndex === currentActions.length - 1}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    +10 {'>>'}
                </button>
                <button
                    onClick={handleLast}
                    disabled={currentActionIndex === currentActions.length - 1}
                    className="px-3 py-2 rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Last {'>>>'}
                </button>
            </div>
            <button
            disabled={true}
                onClick={handleRecord}
                className="px-3 py-2 rounded-lg bg-red-700 ml-auto mr-2 text-slate-200 hover"
            >
                {recordButtonText} (coming soon)
            </button>
            <span className="text-sm text-slate-400">
                Step {currentActionIndex + 1} of {Math.max(1, currentActions.length)}
            </span>
        </div>
    );
}
