import * as React from "react";
import {
  Flex,
  Text,
  Button,
  Select,
  TextArea,
  Tooltip,
  Badge,
} from '@radix-ui/themes';
import {
  AllActions,
  AllActionStrings,
  isAuthorAction,
  isRepeatableAction,
} from "@fullstackcraftllc/codevideo-types";
import { InsertStepButton } from "./InsertStepButton";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { setActions, setCurrentActionIndex, setDraftActionsString } from "../../../../store/editorSlice";
import { ActionCounter } from "../../ActionCounter";
import { useState, useEffect, useRef } from "react";
import { TutorialCSSClassConstants } from "../../../pages/studio/components/sidebar/StudioTutorial";

export function ActionGUIEditor() {
  const { currentActions, currentActionIndex } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [showValueHint, setShowValueHint] = useState<{ open: boolean, content: string }>({ open: false, content: '' });
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const currentAction = currentActions[currentActionIndex];

  // Auto-resize text area when content changes
  useEffect(() => {
    const adjustHeight = () => {
      const textArea = textAreaRef.current;
      if (textArea) {
        // Reset height to auto to get the correct scrollHeight
        textArea.style.height = 'auto';
        // Set the height to match the content
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    };

    // Call adjustHeight whenever currentAction.value changes
    adjustHeight();
  }, [currentAction?.value]);

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // sanitize event -> if repeatable action, only allow numbers and less than or equal to 100
    const currentAction = currentActions[index];
    if (currentAction && isRepeatableAction(currentAction)) {
      const value = event.target.value;
      if (isNaN(Number(value)) || Number(value) > 100) {
        setShowValueHint({ open: true, content: 'Repeatable actions can only be repeated a maximum of 100 times in one action!' });
        return;
      }
    }

    setShowValueHint({ open: false, content: '' });

    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return { ...action, value: event.target.value };
      }
      return action;
    });
    dispatch(setActions(newActions));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
  };

  const handleTextAreaChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    // sanitize event -> any non-repeatable action, only allow up to 1000 characters
    if (event.target.value.length > 1000) {
      setShowValueHint({ open: true, content: 'Action values can only be up to 1000 characters long!' });
      return;
    }
    setShowValueHint({ open: false, content: '' });

    // Use the same handler as handleInputChange
    handleInputChange(index, event);
  }

  const handleSelectChange = (
    index: number,
    value: string
  ) => {
    const newValue = value;
    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return {
          ...action,
          name: newValue as AllActions,
          value: isRepeatableAction({
            name: newValue as AllActions,
            value: action.value,
          }) ? "1" : "",
        };
      }
      return action;
    });
    dispatch(setActions(newActions));
    dispatch(setCurrentActionIndex(index));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
  };


  const getActionBadge = (actionName: string) => {
    switch (true) {
      case actionName.startsWith('author'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="blue">{actionName}</Badge>
      case actionName.startsWith('file-explorer'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="green">{actionName}</Badge>
      case actionName.startsWith('editor'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="purple">{actionName}</Badge>
      case actionName.startsWith('terminal'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="gray">{actionName}</Badge>
      case actionName.startsWith('mouse'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="pink">{actionName}</Badge>
      case actionName.startsWith('external'):
        return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="orange">{actionName}</Badge>
      default:
        return <Text style={{ fontFamily: 'Fira Code, monospace' }}>{actionName}</Text>
    }
  }

  return (
    <Flex
      className={TutorialCSSClassConstants.ACTION_GUI_EDITOR}
      direction="column"
      gap="2"
      style={{
        height: '100%',
        overflow: 'auto'
      }}
    >
      {currentActions.length === 0 && (
        <InsertStepButton />
      )}
      <Flex direction="row" align="center" justify="between" gap="2">
        <Button
          color="mint"
          variant="soft"
          onClick={() => dispatch(setCurrentActionIndex(currentActionIndex - 1))}
          disabled={currentActionIndex === 0}
        >
          {'<'} Previous
        </Button>
        <ActionCounter />
        <Button
          className={TutorialCSSClassConstants.ACTION_GUI_NEXT_BUTTON}
          color="mint"
          variant="soft"
          onClick={() => dispatch(setCurrentActionIndex(currentActionIndex + 1))}
          disabled={currentActionIndex === 0 || currentActionIndex === currentActions.length - 1}
        >
          Next {'>'}
        </Button>
      </Flex>

      {currentAction && <>
        <Flex direction="column" gap="2">
          <Select.Root
            value={currentAction.name}
            onValueChange={(value) => handleSelectChange(currentActionIndex, value)}
          >
            <Select.Trigger>
              {getActionBadge(currentAction.name)}
            </Select.Trigger>
            <Select.Content>
              <Select.Group>
                {AllActionStrings.map((actionType) => (
                  <Select.Item key={actionType} value={actionType}>
                    {getActionBadge(actionType)}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
          <Tooltip align="start" side="top" content={showValueHint.content} open={showValueHint.open}>
            <TextArea
              ref={textAreaRef}
              value={currentAction.value}
              onChange={(e) => isAuthorAction(currentAction) ?
                handleTextAreaChange(currentActionIndex, e) :
                handleInputChange(currentActionIndex, e as any)
              }
              style={{
                flex: 1,
                fontFamily: isAuthorAction(currentAction) ? 'sans-serif' : 'Fira Code, monospace',
                minHeight: '100px',
                overflow: 'hidden',
                resize: 'none'
              }}
            />
          </Tooltip>
        </Flex>
        <Flex ml="auto" gap="2">
          <Button
            color="mint"
            variant="soft"
            onClick={() => {
              // add the current action to the previous index
              const newActions = currentActions
                .slice(0, currentActionIndex)
                .concat([currentAction, ...currentActions.slice(currentActionIndex)]);
              dispatch(setActions(newActions));
              dispatch(setCurrentActionIndex(currentActionIndex));
              dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
            }}
          >
            Clone to Previous
          </Button>
          <Button
            className={TutorialCSSClassConstants.ACTION_GUI_CLONE_TO_NEXT}
            color="mint"
            variant="soft"
            onClick={() => {
              // add the current action to the next index
              const newActions = currentActions
                .slice(0, currentActionIndex + 1)
                .concat([currentAction, ...currentActions.slice(currentActionIndex + 1)]);
              dispatch(setActions(newActions));
              dispatch(setCurrentActionIndex(currentActionIndex + 1));
              dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
            }}
          >
            Clone to Next
          </Button>
          <Button
            color="red"
            variant="soft"
            onClick={() => {
              const newActions = currentActions.filter((_, i) => i !== currentActionIndex);
              dispatch(setActions(newActions));
              dispatch(setCurrentActionIndex(Math.min(currentActionIndex, newActions.length - 1)));
              dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
            }}
          >
            Delete
          </Button>
        </Flex>
      </>}
    </Flex>
  );
}

export default ActionGUIEditor;