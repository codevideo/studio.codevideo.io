import * as React from 'react';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setActions, setCurrentActionIndex, setDraftActionsString } from '../../../../store/editorSlice';
import { Flex, Button, Box } from '@radix-ui/themes';
import { useAppSelector } from '../../../../hooks/useAppSelector';

export function InsertStepButton() {
    const { currentActions, currentActionIndex } = useAppSelector(state => state.editor);
    const dispatch = useAppDispatch();

    const handleInsertStep = () => {
        const currentAction = currentActions[currentActionIndex];
        const newIndex = currentActions.length === 0 ? 0 : currentActionIndex + 1;
        const newActions = currentActions
            .slice(0, newIndex)
            .concat([
                { name: currentAction?.name || 'author-speak-before', value: currentAction?.value || 'My new speak action' },
                ...currentActions.slice(newIndex),
            ]);
        dispatch(setActions(newActions));
        dispatch(setCurrentActionIndex(newIndex));
        // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
        dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
    };

    return (
        <>
            {currentActions.length === 0 && (
                <Flex justify="center" align="center">
                    Add your first action!
                </Flex>
            )}
            <Flex
                justify="center"
                align="center"
                gap="1"
            >
                <Box my="1">
                    <Button
                        variant="soft"
                        color="mint"
                        onClick={handleInsertStep}
                    >
                        + Add Action
                    </Button>
                </Box>
            </Flex>
        </>
    );
}