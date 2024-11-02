import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setActions, setActionsString, setCodeIndex } from '../../../store/editorSlice';
import { AllActions, IAction } from '@fullstackcraftllc/codevideo-types';

export interface IInsertStepButtonProps {
    actions: IAction[];
    index: number;
}

export function InsertStepButton(props: IInsertStepButtonProps) {
    const { actions, index } = props;
    const dispatch = useAppDispatch();
    return (
        <div className="flex justify-center items-center gap-1 -mb-4 mt-1 relative z-10">
            <button
                className="w-6 h-6 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center text-lg leading-none"
                onClick={() => {
                    const newActions = actions
                    .slice(0, index + 1)
                    .concat([
                        { name: "speak-before" as AllActions, value: "My new speaking action" } as IAction,
                        ...actions.slice(index + 1),
                    ])
                    dispatch(setActions(
                        newActions
                    ))
                    dispatch(setActionsString(JSON.stringify(newActions, null, 2)));
                    dispatch(setCodeIndex(index + 1));
                }}
            >
                +
            </button>
            <span className="text-xs text-gray-500">Insert step</span>
        </div>
    );
}
