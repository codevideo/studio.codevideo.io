import * as React from 'react';
import { IAction, isValidAction, filterAuthorActions, filterFileExplorerActions, filterEditorActions, filterTerminalActions, filterMouseActions, filterExternalActions } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Flex, Text, Box, IconButton } from '@radix-ui/themes';
import { setActions, setCurrentActionIndex } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { CheckCircledIcon, ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';

export interface IActionValidationStatsProps {
  editorMode: boolean;
}

export function ActionValidationStats(props: IActionValidationStatsProps) {
  const { editorMode } = props;
  // we monitor both actions (From the GUI editor) and draftActionsString (From the JSON editor)
  const { currentActions, currentActionIndex, draftActionsString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [parsedActions, setParsedActions] = useState<IAction[]>([]);

  // debounced validation effect
  useEffect(() => {
    if (draftActionsString === "" || draftActionsString === "[]") {
      setIsValidating(false);
      setValidationError(null);
      setIsValid(true);
      return;
    }

    setIsValidating(true);
    setIsValid(false);

    const timer = setTimeout(() => {
      try {
        const parsedActions = JSON.parse(draftActionsString);
        if (!Array.isArray(parsedActions)) {
          setIsValid(false);
          setValidationError("JSON must be an array");
          return;
        }

        // check each action and if it is valid with type guard
        for (let i = 0; i < parsedActions.length; i++) {
          const action = parsedActions[i];
          if (!isValidAction(action)) {
            setIsValid(false);
            setValidationError(`Invalid action at index ${i + 1}: ${JSON.stringify(action)}`);
            return;
          }
        }

        // at this point we know the actions are valid, we update local state and persist to redux
        setIsValid(true);
        setValidationError(null);
        setParsedActions(parsedActions);
        dispatch(setActions(parsedActions));

        // also ensure that the currentActionIndex is at MOST the length of the actions
        if (currentActionIndex >= parsedActions.length) {
          dispatch(setCurrentActionIndex(parsedActions.length - 1));
        }

        // dispatch(setDraftActionsString(JSON.stringify(parsedActions, null, 2)));
      } catch (error) {
        setIsValid(false);
        setValidationError((error as Error).message);
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [draftActionsString]);

  // filter actions by type
  const actionsToUseForStats = parsedActions.length === 0 ? currentActions : parsedActions;
  const authorActionsCount = filterAuthorActions(actionsToUseForStats).length;
  const fileExplorerActionsCount = filterFileExplorerActions(actionsToUseForStats).length;
  const editorActionsCount = filterEditorActions(actionsToUseForStats).length;
  const terminalActionsCount = filterTerminalActions(actionsToUseForStats).length;
  const mouseActionsCount = filterMouseActions(actionsToUseForStats).length;
  const externalActionsCount = filterExternalActions(actionsToUseForStats).length;

  return (
    <Flex align="center" mt="2">
      {isValidating ? (
        <Flex align="center" >
          <IconButton color="mint" size="1" mr="2" loading={true}>
            <CheckCircledIcon width="15" height="15" />
          </IconButton>
          <Text color="mint" size="2">Validating{editorMode ? "..." : " JSON..."}</Text>
        </Flex>
      ) : validationError ? (
        <Flex align="center" >
          <IconButton color='red' size="1" mr="2">
            <ExclamationTriangleIcon width="15" height="15" />
          </IconButton>
          <Text color="red" size="2">{validationError}</Text>
        </Flex>
      ) : isValid ? (
        <Flex align="center" justify="center" >
          <IconButton color="mint" size="1" mr="2">
            <CheckCircledIcon width="15" height="15" />
          </IconButton>
          <Flex direction="column">
            <Text color="mint" size="1">
              Project saved.{' '}{editorMode ? "Actions are" : "Actions JSON is"} valid; parsed <Text weight="bold">{actionsToUseForStats.length}</Text> actions{" "}
            </Text>
            <Text color="mint" size="1" as="span">
              ({authorActionsCount} author, {fileExplorerActionsCount} file explorer, {editorActionsCount} editor, {terminalActionsCount} terminal, {mouseActionsCount} mouse, {externalActionsCount} external)
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
}