import * as React from 'react';
import { isValidAction, filterAuthorActions, filterFileExplorerActions, filterEditorActions, filterTerminalActions, filterMouseActions, filterExternalActions, extractActionsFromProject, filterSlideActions, isCourse, isLesson, isValidActions } from '@fullstackcraftllc/codevideo-types';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { Flex, Text, Box, IconButton } from '@radix-ui/themes';
import { setActions, setCurrentActionIndex, setProject, setCourse, setLesson, setActionsProject } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { CheckCircledIcon, ExclamationTriangleIcon, UpdateIcon } from '@radix-ui/react-icons';

export interface IActionValidationStatsProps {
  editorMode: boolean;
}

export function ActionValidationStats(props: IActionValidationStatsProps) {
  const { editorMode } = props;
  // we monitor both currentProject (From the GUI editor) and draftProjectString (From the JSON editor)
  const { currentProject, currentActionIndex, currentLessonIndex, draftProjectString } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  // debounced validation effect
  useEffect(() => {
    if (draftProjectString === "" || draftProjectString === "[]") {
      setIsValidating(false);
      setValidationError(null);
      setIsValid(true);
      return;
    }

    setIsValidating(true);
    setIsValid(false);

    const timer = setTimeout(() => {
      try {
        const parsedProject = JSON.parse(draftProjectString);
        const actions = extractActionsFromProject(parsedProject, currentLessonIndex);

        // check each action and if it is valid with type guard
        for (let i = 0; i < actions.length; i++) {
          const action = actions[i];
          if (!isValidAction(action)) {
            setIsValid(false);
            setValidationError(`Invalid action at index ${i + 1}: ${JSON.stringify(action)}`);
            return;
          }
        }

        // at this point we know the actions are valid, we update local state and persist to redux
        setIsValid(true);
        setValidationError(null);
        
        // Dispatch the appropriate action based on the project type
        if (isCourse(parsedProject)) {
          dispatch(setCourse(parsedProject));
        } else if (isLesson(parsedProject)) {
          dispatch(setLesson(parsedProject));
        } else if (isValidActions(parsedProject)) {
          dispatch(setActionsProject(parsedProject));
        } else {
          // Fallback to generic project setter
          dispatch(setProject(parsedProject));
        }
        
        // Ensure currentActionIndex is within bounds for any project type
        if (currentActionIndex >= actions.length) {
          dispatch(setCurrentActionIndex(Math.max(0, actions.length - 1)));
        }

        // dispatch(setdraftProjectString(JSON.stringify(parsedActions, null, 2)));
      } catch (error) {
        setIsValid(false);
        setValidationError((error as Error).message);
      } finally {
        setIsValidating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [draftProjectString]);

  // filter actions by type
  const actions = extractActionsFromProject(currentProject?.project, currentLessonIndex) || [];
  const authorActionsCount = filterAuthorActions(actions).length;
  const fileExplorerActionsCount = filterFileExplorerActions(actions).length;
  const editorActionsCount = filterEditorActions(actions).length;
  const terminalActionsCount = filterTerminalActions(actions).length;
  const mouseActionsCount = filterMouseActions(actions).length;
  const slideActionsCount = filterSlideActions(actions).length;
  const externalActionsCount = filterExternalActions(actions).length;

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
              Project saved.{' '}{editorMode ? "Project is" : "Project JSON is"} valid; Project type is <Text weight="bold">{currentProject?.projectType}</Text>; parsed <Text weight="bold">{actions.length}</Text> actions{" "}
            </Text>
            <Text color="mint" size="1" as="span">
              ({authorActionsCount} author, {fileExplorerActionsCount} file explorer, {editorActionsCount} editor, {terminalActionsCount} terminal, {mouseActionsCount} mouse, {slideActionsCount} slide, {externalActionsCount} external)
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </Flex>
  );
}