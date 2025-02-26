import * as React from 'react';
import { IAction } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setActions, setCurrentActionIndex, setDraftActionsString } from '../../../../store/editorSlice';

export interface IInsertStepButtonProps {
    actions: IAction[];
    index: number;
}

export function InsertStepButton(props: IInsertStepButtonProps) {
    const { actions, index } = props;
    const dispatch = useAppDispatch();

    const handleInsertStep = () => {
        const newActions = actions
            .slice(0, index + 1)
            .concat([
                { name: "author-speak-before", value: "My new speaking action" },
                ...actions.slice(index + 1),
            ]);
        dispatch(setActions(newActions));
        dispatch(setCurrentActionIndex(index));
        // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
        dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
    };

    return (
        <>
            {actions.length === 0 && <div className="flex justify-center items-center">Add your first step!</div>}
            <div className="flex justify-center items-center gap-1 -mb-2 -mt-2 relative z-10">
                <button
                    title="Insert step"
                    className="w-6 h-6 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors flex items-center justify-center text-lg leading-none"
                    onClick={handleInsertStep}
                >
                    +
                </button>
            </div>
        </>
    );
}
