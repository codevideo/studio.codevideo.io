import * as React from 'react';
import { Text } from '@radix-ui/themes';
import { useAppSelector } from '../../hooks/useAppSelector';

export function ActionCounter() {
    const { currentActionIndex, currentActions } = useAppSelector((state) => state.editor);
    return (
        <Text
            color="gray"
        >
            Action <Text color="mint" weight="bold">{currentActionIndex + 1}</Text> of <Text color="mint" weight="bold">{currentActions.length}</Text>
        </Text>
    );
}
