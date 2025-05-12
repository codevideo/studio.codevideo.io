import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../../hooks/useAppDispatch';
import { Badge } from '@radix-ui/themes';
import { setActions, setCurrentActionIndex, setDraftActionsString } from '../../../../../store/editorSlice';
import { AllActions } from '@fullstackcraftllc/codevideo-types';

export interface INewActionBadgeProps {
    label: string;
    color: any;
    name: AllActions;
    value: string;
}

export function NewActionBadge(props: INewActionBadgeProps) {
    const { label, color, name, value } = props;
    const { currentActions, currentActionIndex } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();
    return (
        <Badge
            style={{ cursor: 'pointer' }}
            size="1"
            color={color}
            variant="soft"
            onClick={() => {
                // add an author-speak-before action at the current index + 1
                const newActions = currentActions
                    .slice(0, currentActionIndex + 1)
                    .concat([{ name, value }, ...currentActions.slice(currentActionIndex + 1)]);
                dispatch(setActions(newActions));
                dispatch(setCurrentActionIndex(currentActionIndex + 1));
                dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
            }}
        >
            {label}
        </Badge>
    );
}
