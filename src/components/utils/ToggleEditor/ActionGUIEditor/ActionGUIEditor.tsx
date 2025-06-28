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
  advancedCommandValueSeparator,
  AllActions,
  AllActionStrings,
  extractActionsFromProject,
  IAction,
  isAdvancedValueAction,
  isAuthorAction,
  isRepeatableAction,
} from "@fullstackcraftllc/codevideo-types";
import { InsertStepButton } from "./InsertStepButton";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { setActions, setAllowFocusInEditor, setCurrentActionIndex, setDraftProjectString } from "../../../../store/editorSlice";
import { ActionCounter } from "../../ActionCounter";
import { useState, useEffect, useRef } from "react";
import ActionKeyboard from "./ActionKeyboard";
import mixpanel from "mixpanel-browser";
import { TutorialCSSClassConstants } from "../../../layout/sidebar/StudioTutorial";
import { NewActionBadge } from "./components/NewActionBadge";
import { ActionBadge } from '@fullstackcraftllc/codevideo-react-components'

export function ActionGUIEditor() {
  const { currentProject, currentActionIndex, currentLessonIndex, isPlaying } = useAppSelector((state) => state.editor);
  const { isRecording } = useAppSelector((state) => state.recording);
  const dispatch = useAppDispatch();
  const [showValueHint, setShowValueHint] = useState<{ open: boolean, content: string }>({ open: false, content: '' });
  const [prependSpaces, setPrependSpaces] = useState<number>(0);
  const [showNewActions, setShowNewActions] = useState<boolean>(false);
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const advancedValueOneTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const advancedValueTwoTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const currentActions = extractActionsFromProject(currentProject?.project || [], currentLessonIndex);
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
    const value = event.target.value;
    mixpanel.track('Action Value Changed Studio', { value });
    const currentAction = currentActions[index];

    // if advanced value action, combine the two text areas with the advancedCommandValueSeparator
    if (index >= 0 && currentAction && isAdvancedValueAction(currentAction)) {
      const valueOne = advancedValueOneTextAreaRef.current?.value || '';
      const valueTwo = advancedValueTwoTextAreaRef.current?.value || '';
      const newValue = `${valueOne}${advancedCommandValueSeparator}${valueTwo}`;
      const newActions = currentActions.map((action, i) => {
        if (i === index) {
          return { ...action, value: newValue };
        }
        return action;
      });
      dispatch(setActions(newActions));
      // even though we don't deal directly with the draftProjectString in this component, we still need to update it so it triggers the stats component
      dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
      return;
    }

    // sanitize event -> if repeatable action, only allow numbers and less than or equal to 100

    if (currentAction && isRepeatableAction(currentAction)) {
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
    // even though we don't deal directly with the draftProjectString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
  };

  const handleTextAreaChange = (
    index: number,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    mixpanel.track('Action Value Changed Studio', { value });
    // sanitize event -> any non-repeatable action, only allow up to 1000 characters
    if (value.length > 1000) {
      setShowValueHint({ open: true, content: 'Action values can only be up to 1000 characters long!' });
      return;
    }
    setShowValueHint({ open: false, content: '' });

    // Use the same handler as handleInputChange
    handleInputChange(index, event);
  }

  // TODO: could be added to config "show suggested action values?" or something
  const getSuggestValueBasedOnActionName = (actionName: string) => {
    switch (actionName) {
      // speak suggestions
      case 'author-speak-before':
      case 'author-speak-during':
      case 'author-speak-after':
        return 'My new speak action.'
      // file explorer suggestions - simple
      case 'file-explorer-create-file':
        return 'myfile.txt';
      case 'file-explorer-create-folder':
        return 'myfolder';
      case 'file-explorer-delete-file':
        return 'myfile.txt';
      case 'file-explorer-delete-folder':
        return 'myfolder';
      case 'file-explorer-open-file':
        return 'myfile.txt';
      case 'file-explorer-open-folder':
        return 'myfolder';
      case 'file-explorer-rename-file':
        return 'myfile.txt';
      case 'file-explorer-rename-folder':
        return 'myfolder';
      // file explorer suggestions - complex - need to use the separator
      case 'file-explorer-move-file':
        return `myfile.txt${advancedCommandValueSeparator}myfolder/myfile.txt`;
      case 'file-explorer-move-folder':
        return `myfolder${advancedCommandValueSeparator}myfolder2`;
      case 'file-explorer-copy-file':
        return `myfile.txt${advancedCommandValueSeparator}myfolder`;
      case 'file-explorer-copy-folder':
        return `myfolder${advancedCommandValueSeparator}myfolder2`;
      case 'file-explorer-rename-file':
        return `myfile.txt${advancedCommandValueSeparator}mynewfile.txt`;
      case 'file-explorer-rename-folder':
        return `myfolder${advancedCommandValueSeparator}mynewfolder`;
      case 'file-explorer-set-file-contents':
        return `myfile.txt${advancedCommandValueSeparator}Hello, world!`;
      // editor suggestions
      case 'editor-type':
        return `${' '.repeat(prependSpaces)}code`;
      // terminal suggestions
      case 'terminal-type':
        return 'mycommand myargs';
      // slide display
      case 'slide-display':
        return `# My Cool Slide

## With a Subtitle

and some source code:

\`\`\`ts
export const wowMyFunction = (someParam: string) => {
    console.log(someParam);
    // slides are important for software courses too!
}
\`\`\``;
      default:
        return "something"
    }
  }

  const handleSelectChange = (
    index: number,
    value: string
  ) => {
    const newValue = value;
    mixpanel.track('Action Name Changed Studio', { value: newValue });
    // get first part of action - everything before the first '-'
    const firstPartNewAction = newValue.split('-')[0];

    const newActions = currentActions.map((action, i) => {
      const firstPartOfAction = action.name.split('-')[0];

      // if the first part of the action remains the same, we can reuse the value
      let suggestedValue = action.value;
      if (firstPartNewAction !== firstPartOfAction) {
        // switch types, use the suggested value
        suggestedValue = getSuggestValueBasedOnActionName(newValue);
      } else {
        // Same category, but check if we're switching between advanced and non-advanced actions
        const newActionObj = { name: newValue as AllActions, value: action.value };
        const oldActionObj = { name: action.name, value: action.value };
        
        // If switching from non-advanced to advanced action, use suggested value
        if (isAdvancedValueAction(newActionObj) && !isAdvancedValueAction(oldActionObj)) {
          suggestedValue = getSuggestValueBasedOnActionName(newValue);
        }
        // If switching from advanced to non-advanced action, use first part of current value
        else if (!isAdvancedValueAction(newActionObj) && isAdvancedValueAction(oldActionObj)) {
          const valueParts = action.value.split(advancedCommandValueSeparator);
          suggestedValue = valueParts[0] || getSuggestValueBasedOnActionName(newValue);
        }
      }
      
      if (i === index) {
        return {
          ...action,
          name: newValue as AllActions,
          value: isRepeatableAction({
            name: newValue as AllActions,
            value: suggestedValue,
          }) ? "1" : suggestedValue,
        };
      }
      return action;
    });
    dispatch(setActions(newActions));
    dispatch(setCurrentActionIndex(index));
    // even though we don't deal directly with the draftProjectString in this component, we still need to update it so it triggers the stats component
    dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
  };

  const quickActions: Array<{
    action: IAction,
    label: string,
    color: string
  }> = [
      {
        action: {
          name: 'author-speak-before',
          value: 'My speak action'
        },
        label: 'speak',
        color: 'blue'
      },
      {
        action: {
          name: 'editor-type',
          value: 'code'
        },
        label: 'type',
        color: 'purple'
      },
      {
        action: {
          name: 'editor-enter',
          value: "1"
        },
        label: 'enter',
        color: 'purple'
      },
      {
        action: {
          name: 'terminal-type',
          value: 'code'
        },
        label: 'type',
        color: 'gray'
      },
      {
        action: {
          name: 'terminal-enter',
          value: "1"
        },
        label: 'enter',
        color: 'gray'
      },
      {
        action: {
          name: 'file-explorer-create-file',
          value: 'myfile.txt'
        },
        label: 'create-file',
        color: 'green'
      },
      {
        action: {
          name: 'file-explorer-open-file',
          value: 'myfile.txt'
        },
        label: 'open-file',
        color: 'green'
      },
      {
        action: {
          name: 'file-explorer-close-file',
          value: 'myfile.txt'
        },
        label: 'close-file',
        color: 'green'
      },
      {
        action: {
          name: 'file-explorer-create-folder',
          value: 'myfolder'
        },
        label: 'create-folder',
        color: 'green'
      }
    ]

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
          onClick={() => {
            dispatch(setAllowFocusInEditor(true));
            // Small delay to ensure focus management doesn't interfere with editor caret positioning
            setTimeout(() => {
              dispatch(setCurrentActionIndex(currentActionIndex - 1));
            }, 10);
          }}
          disabled={currentActionIndex === 0 || isPlaying || isRecording}
          size="1"
        >
          {'<'} Previous
        </Button>
        <ActionCounter />
        <Tooltip open={currentActionIndex === 0} content="Click me to get started with the lesson!">
          <Button
            className={TutorialCSSClassConstants.ACTION_GUI_NEXT_BUTTON}
            color="mint"
            variant="soft"
            onClick={() => {
              dispatch(setAllowFocusInEditor(true));
              // Small delay to ensure focus management doesn't interfere with editor caret positioning
              setTimeout(() => {
                dispatch(setCurrentActionIndex(currentActionIndex + 1));
              }, 10);
            }}
            disabled={currentActionIndex === currentActions.length - 1 || isPlaying || isRecording}
            size="1"
          >
            Next {'>'}
          </Button>
        </Tooltip>
      </Flex>

      {currentAction && <>
        <Flex direction="column" gap="2">
          <Flex direction="row" align="center" justify="between" gap="2">
            <Select.Root
              defaultValue="Select action..."
              value={currentAction.name}
              onValueChange={(value) => handleSelectChange(currentActionIndex, value)}
            >
              <Select.Trigger color="gray">
                <ActionBadge actionName={currentAction.name} />
              </Select.Trigger>
              <Select.Content color="gray">
                <Flex direction="row" gap="2">
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Author:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('author-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                    <Text size="1" color="gray">External:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('external-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                    <Text size="1" color="gray">Slide:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('slide-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">File explorer:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('file-explorer-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Editor:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('editor-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Terminal:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('terminal-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text size="1" color="gray">Mouse:</Text>
                    <Select.Group>
                      {AllActionStrings.filter(a => a.startsWith('mouse-')).map((actionType: any) => (
                        <Select.Item key={actionType} value={actionType}>
                          <ActionBadge actionName={actionType} />
                        </Select.Item>
                      ))}
                    </Select.Group>
                  </Flex>
                </Flex>
              </Select.Content>
            </Select.Root>
            <Flex direction="row" gap="2">
              <Badge
                style={{ cursor: 'pointer' }}
                size="1"
                color="mint"
                variant="soft"
                onClick={() => {
                  // add the current action to the previous index
                  const newActions = currentActions
                    .slice(0, currentActionIndex)
                    .concat([currentAction, ...currentActions.slice(currentActionIndex)]);
                  dispatch(setActions(newActions));
                  dispatch(setCurrentActionIndex(currentActionIndex));
                  dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
                }}
              >
                Clone to Previous
              </Badge>
              <Badge
                style={{ cursor: 'pointer' }}
                size="1"
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
                  dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
                }}
              >
                Clone to Next
              </Badge>
              <Badge
                style={{ cursor: 'pointer' }}
                size="1"
                color="red"
                variant="soft"
                onClick={() => {
                  const newActions = currentActions.filter((_, i) => i !== currentActionIndex);
                  dispatch(setActions(newActions));
                  dispatch(setCurrentActionIndex(Math.min(currentActionIndex, newActions.length - 1)));
                  dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
                }}
              >
                Delete
              </Badge>

            </Flex>
          </Flex>

          <Tooltip align="start" side="top" content={showValueHint.content} open={showValueHint.open}>
            {isAdvancedValueAction(currentAction) ? (
              // advanced value actions have a left and right value, and when submitted, they are combined with the advancedCommandValueSeparator
              <Flex gap="2">
                <TextArea
                  ref={advancedValueOneTextAreaRef}
                  value={currentAction.value.split(advancedCommandValueSeparator)[0]}
                  onChange={(e) => handleInputChange(currentActionIndex, e as any)}
                  // fixes the annoying blocking that monaco editor was triggering with our auto caret highlighting
                  onFocus={() => dispatch(setAllowFocusInEditor(false))}
                  onBlur={() => dispatch(setAllowFocusInEditor(true))}
                  style={{
                    flex: 1,
                    fontFamily: 'Fira Code, monospace',
                    minHeight: '100px',
                    overflow: 'hidden',
                    resize: 'none'
                  }}
                />
                <TextArea
                  ref={advancedValueTwoTextAreaRef}
                  value={currentAction.value.split(advancedCommandValueSeparator)[1]}
                  onChange={(e) => handleInputChange(currentActionIndex, e as any)}
                  // fixes the annoying blocking that monaco editor was triggering with our auto caret highlighting
                  onFocus={() => dispatch(setAllowFocusInEditor(false))}
                  onBlur={() => dispatch(setAllowFocusInEditor(true))}
                  style={{
                    flex: 1,
                    fontFamily: 'Fira Code, monospace',
                    minHeight: '100px',
                    overflow: 'hidden',
                    resize: 'none'
                  }}
                />
              </Flex>
            ) : (
              <TextArea
                ref={textAreaRef}
                value={currentAction.value}
                onChange={(e) => isAuthorAction(currentAction) ?
                  handleTextAreaChange(currentActionIndex, e) :
                  handleInputChange(currentActionIndex, e as any)
                }
                // fixes the annoying blocking that monaco editor was triggering with our auto caret highlighting
                onFocus={() => dispatch(setAllowFocusInEditor(false))}
                onBlur={() => dispatch(setAllowFocusInEditor(true))}
                style={{
                  flex: 1,
                  fontFamily: isAuthorAction(currentAction) ? 'sans-serif' : 'Fira Code, monospace',
                  minHeight: '100px',
                  overflow: 'hidden',
                  resize: 'none'
                }}
              />)}
          </Tooltip>
        </Flex>
        <Flex ml="1" gap="2">
          <Flex direction="column" gap="1">
            {showNewActions ? (
              <Flex wrap="wrap" gap="1">
                <NewActionBadge label="New Author Action" color="blue" name="author-speak-before" value="My new speak action..." />
                <NewActionBadge label="New File Explorer Action" color="green" name="file-explorer-create-file" value="mynewfile.txt" />
                <NewActionBadge label="New Editor Action" color="purple" name="editor-type" value="console.log('hello, world!');" />
                <NewActionBadge label="New Mouse Action" color="orange" name="mouse-move-editor" value="1" />
                <NewActionBadge label="New Terminal Action" color="gray" name="terminal-open" value="1" />
                <Text
                  style={{ cursor: 'pointer' }}
                  size="1"
                  color="mint"
                  onClick={() => setShowNewActions(false)}
                >
                  <u>Show less</u>
                </Text>
              </Flex>
            ) : (
              <Text
                style={{ cursor: 'pointer' }}
                size="1"
                color="mint"
                onClick={() => setShowNewActions(true)}
              >
                <u>Show add actions...</u>
              </Text>
            )}
            {/* series of clickable small badges which add their example action at the current index */}
            {showQuickActions ?
              (
                <Flex wrap="wrap" gap="1">
                  {quickActions.map(({ action, label, color }, index) => (
                    <Badge
                      style={{ cursor: 'pointer' }}
                      size="1"
                      key={`${label}-${index}`}
                      color={color as any}
                      variant="soft"
                      onClick={() => {
                        // insert this quick action at currentIndex+1
                        const newActions = currentActions
                          .slice(0, currentActionIndex + 1)
                          .concat([action, ...currentActions.slice(currentActionIndex + 1)]);

                        dispatch(setActions(newActions));
                        dispatch(setCurrentActionIndex(currentActionIndex + 1));
                        dispatch(setDraftProjectString(JSON.stringify(newActions, null, 2)));
                      }}
                    >
                      {label}
                    </Badge>
                  ))}
                  <Text
                    style={{ cursor: 'pointer' }}
                    size="1"
                    color="mint"
                    onClick={() => setShowQuickActions(false)}
                  >
                    <u>Show less</u>
                  </Text>
                </Flex>
              ) : (
                <Text
                  style={{ cursor: 'pointer' }}
                  size="1"
                  color="mint"
                  onClick={() => setShowQuickActions(true)}
                >
                  <u>Show quick actions...</u>
                </Text>
              )
            }
            {showMore ? (
              <>
                <Text
                  style={{ cursor: 'pointer' }}
                  size="1"
                  color="mint"
                  onClick={() => setShowMore(false)}
                >
                  <u>Show less</u>
                </Text>
                <Flex align="center" gap="1">
                  {/* Dropdown of 0 to 10 spaces to prepend to any editor-type command */}
                  <Text size="1" color="gray">Prepend space to each <Badge size="1" color="purple">editor-type</Badge>?</Text>
                  <Select.Root
                    value={prependSpaces.toString()}
                    onValueChange={(value) => setPrependSpaces(parseInt(value))}
                  >
                    <Select.Trigger>
                      <Text>{prependSpaces}</Text>
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Group>
                        {[...Array(11).keys()].map((i) => (
                          <Select.Item key={i} value={i.toString()}>
                            <Badge size="1" color="gray">{i}</Badge>
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </Select.Content>
                  </Select.Root>
                </Flex>
                <ActionKeyboard showNumpad={false} prependSpaces={prependSpaces} />
              </>
            ) : (
              <Text
                style={{ cursor: 'pointer' }}
                size="1"
                color="mint"
                onClick={() => setShowMore(true)}
              >
                <u>Show advanced controls...</u>
              </Text>
            )}
          </Flex>
        </Flex>
      </>}
    </Flex>
  );
}

export default ActionGUIEditor;