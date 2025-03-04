import * as React from 'react';
import { Text } from '@radix-ui/themes';
import { useAppSelector } from '../../hooks/useAppSelector';

export function ActionCounter() {
    const { currentActionIndex, currentActions } = useAppSelector((state) => state.editor);
    const displayCurrentActionIndex = currentActions.length === 0 ? 0 : currentActionIndex + 1;

    return (
        <Text
            color="gray"
        >
            Action <Text color="mint" weight="bold">{displayCurrentActionIndex}</Text> of <Text color="mint" weight="bold">{currentActions.length}</Text>
        </Text>
    );
}
