import * as React from "react";
import {
  Flex,
  Text,
  Button,
  Select,
  TextArea,
  Tooltip,
} from '@radix-ui/themes';
import {
  AllActions,
  AllActionStrings,
  isAuthorAction,
  isEditorAction,
  isRepeatableAction,
} from "@fullstackcraftllc/codevideo-types";
import { InsertStepButton } from "./InsertStepButton";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { setActions, setCurrentActionIndex, setDraftActionsString } from "../../../../store/editorSlice";
import { ActionCounter } from "../../ActionCounter";
import { useState } from "react";

export function ActionGUIEditor() {
  const { currentActions, currentActionIndex } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();
  const [showValueHint, setShowValueHint] = useState<{open: boolean, content: string}>({open: false, content: ''});

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    // sanitize event -> if repeatable action, only allow numbers and less than or equal to 100
    const currentAction = currentActions[index];
    if (currentAction && isRepeatableAction(currentAction)) {
      const value = event.target.value;
      if (isNaN(Number(value)) || Number(value) > 100) {
        setShowValueHint({open: true, content: 'Repeatable actions can only be repeated a maximum of 100 times in one action!'});
        return;
      }
    }

    setShowValueHint({open: false, content: ''});

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
      setShowValueHint({open: true, content: 'Action values can only be up to 1000 characters long!'});
      return;
    }
    setShowValueHint({open: false, content: ''});
    const newActions = currentActions.map((action, i) => {
      if (i === index) {
        return { ...action, value: event.target.value };
      }
      return action;
    });
    dispatch(setActions(newActions));
    // even though we don't deal directly with the draftActionsString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
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

  const currentAction = currentActions[currentActionIndex];

  if (!currentAction) {
    return <></>;
  }

  return (
    <Flex
      direction="column"
      gap="2"
      style={{
        height: '660px',
      }}
    >
      {currentActions.length === 0 && (
        <InsertStepButton buttonIndex={1} />
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
        <ActionCounter/>
        <Button
          color="mint"
          variant="soft"
          onClick={() => dispatch(setCurrentActionIndex(currentActionIndex + 1))}
          disabled={currentActionIndex === currentActions.length - 1}
        >
          Next {'>'}
        </Button>
      </Flex>
      <Flex ml="auto" gap="2">
        <Button
          color="mint"
          onClick={() => {
            const newActions = currentActions
              .slice(0, currentActionIndex + 1)
              .concat([currentAction, ...currentActions.slice(currentActionIndex + 1)]);
            dispatch(setActions(newActions));
            dispatch(setCurrentActionIndex(currentActionIndex + 1));
            dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
          }}
        >
          Clone
        </Button>
        <Button
          color="red"
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
      <Flex direction="column" gap="2">
        <Select.Root
          value={currentAction.name as string}
          onValueChange={(value) => handleSelectChange(currentActionIndex, value)}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Group>
              {AllActionStrings.map((actionType) => (
                <Select.Item key={actionType} value={actionType}>
                  {actionType}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Tooltip align="start" side="top" content={showValueHint.content} open={showValueHint.open}>
          {isAuthorAction(currentAction) ? (
            <TextArea
              value={currentAction.value}
              onChange={(e) => handleTextAreaChange(currentActionIndex, e)}
              style={{
                flex: 1,
                fontFamily: 'sans-serif',
                height: 'auto',
                resize: 'none'
              }}
            />
          ) : (
            <TextArea
              value={currentAction.value}
              onChange={(e: any) => handleInputChange(currentActionIndex, e)}
              style={{
                flex: 1,
                fontFamily: isEditorAction(currentAction) ? 'monospace' : 'sans-serif',
                height: 'auto',
                resize: 'none'
              }}
            />
          )}
        </Tooltip>
      </Flex>
      <InsertStepButton buttonIndex={currentActionIndex} />
    </Flex>
  );
}

export default ActionGUIEditor;