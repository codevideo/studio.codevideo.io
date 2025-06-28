import * as React from 'react';
import { Text } from '@radix-ui/themes';
import { useAppSelector } from '../../hooks/useAppSelector';
import { extractActionsFromProject } from '@fullstackcraftllc/codevideo-types';

export function ActionCounter() {
    const { currentActionIndex, currentProject, currentLessonIndex } = useAppSelector((state) => state.editor);
    const currentActions = extractActionsFromProject(currentProject?.project || [], currentLessonIndex);
    const displayCurrentActionIndex = currentActions.length === 0 ? 0 : currentActionIndex + 1;

    return (
        <Text
            color="gray"
        >
            Action <Text color="mint" weight="bold">{displayCurrentActionIndex}</Text> of <Text color="mint" weight="bold">{currentActions.length}</Text>
        </Text>
    );
}
