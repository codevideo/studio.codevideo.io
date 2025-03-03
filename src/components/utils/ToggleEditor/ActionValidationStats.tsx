import * as React from 'react';
import { IAction, isValidAction, filterAuthorActions, filterFileExplorerActions, filterEditorActions, filterTerminalActions, filterMouseActions, filterExternalActions } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Flex, Text, Box } from '@radix-ui/themes';
import { setActions, setDraftActionsString } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

export interface IActionValidationStatsProps {
  editorMode: boolean;
}

export function ActionValidationStats(props: IActionValidationStatsProps) {
  const { editorMode } = props;
  // we monitor both actions (From the GUI editor) and draftActionsString (From the JSON editor)
  const { currentActions, draftActionsString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);
  const [parsedActions, setParsedActions] = useState<IAction[]>([]);

  // debounced validation effect
  useEffect(() => {
    if (draftActionsString === "") {
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
        // dispatch(setActions(parsedActions));
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
        <Flex align="center" style={{ color: 'var(--mint-9)' }}>
          <svg className="animate-spin h-4 w-4 mr-2" style={{ marginLeft: '-4px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <Text size="2">Validating{editorMode ? "..." : " JSON..."}</Text>
        </Flex>
      ) : validationError ? (
        <Flex align="center" style={{ color: 'var(--red-9)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px', marginRight: '4px' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <Text size="2">{validationError}</Text>
        </Flex>
      ) : isValid ? (
        <Flex align="center" style={{ color: 'var(--mint-9)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: '20px', width: '20px', marginRight: '4px' }} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <Flex direction="column">
            <Text size="2">
              {editorMode ? "Actions are" : "Actions JSON is" } valid; parsed <Text weight="bold">{actionsToUseForStats.length}</Text> actions{" "}
              
            </Text>
            <Text size="1" as="span">
                ({authorActionsCount} author, {fileExplorerActionsCount} file explorer, {editorActionsCount} editor, {terminalActionsCount} terminal, {mouseActionsCount} mouse, {externalActionsCount} external)
              </Text>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
}