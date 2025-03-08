import React, { useState } from 'react';
import { Badge, Flex, Text } from '@radix-ui/themes';
import { useAppSelector } from '../../../../hooks/useAppSelector';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { setActions, setCurrentActionIndex, setDraftActionsString } from '../../../../store/editorSlice';
import { IAction } from '@fullstackcraftllc/codevideo-types';
import { useIsDesktop } from '../../../../hooks/useIsDesktop';

// Define keyboard layout for US keyboard with integrated arrow keys and numpad
const keyboardLayout = [
    // Row 1: Numbers/symbols
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'delete'],
    // Row 2: QWERTY
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    // Row 3: ASDF
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'return'],
    // Row 4: ZXCV
    ['shift-left', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift-right'],
    // Row 5: Space bar and arrow keys
    ['ctrl-left', 'alt-left', ' ', 'alt-right', 'ctrl-right', '←', '↑', '↓', '→'],
];

// Optional numpad layout
const numpadLayout = [
    ['Num', '/', '*', '-'],
    ['7', '8', '9', '+'],
    ['4', '5', '6'],
    ['1', '2', '3', 'Enter'],
    ['0', '.']
];

// Shift key variants
const shiftKeyVariants = {
    '`': '~', '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
    '6': '^', '7': '&', '8': '*', '9': '(', '0': ')', '-': '_',
    '=': '+', '[': '{', ']': '}', '\\': '|', ';': ':', "'": '"',
    ',': '<', '.': '>', '/': '?'
};

// Arrow key to command mapping
const arrowKeyCommands = {
    '←': 'editor-arrow-left',
    '↑': 'editor-arrow-up',
    '↓': 'editor-arrow-down',
    '→': 'editor-arrow-right'
};

interface ActionKeyboardProps {
    showNumpad?: boolean;
    prependSpaces: number;
}

const ActionKeyboard: React.FC<ActionKeyboardProps> = (props: ActionKeyboardProps) => {
    const { showNumpad = false, prependSpaces } = props;
    const { currentActions, currentActionIndex } = useAppSelector((state: any) => state.editor);
    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();
    const [shiftActive, setShiftActive] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    const handleKeyClick = (key: string) => {
        // Handle modifier keys like shift-left, shift-right
        if (key === 'shift-left' || key === 'shift-right') {
            setShiftActive(!shiftActive);
            return;
        }

        // Handle arrow keys
        if (Object.keys(arrowKeyCommands).includes(key)) {
            const action: IAction = { name: (arrowKeyCommands as any)[key], value: '1' };
            insertAction(action);
            return;
        }

        // Handle Caps Lock
        if (key === 'caps') {
            setCapsLockActive(!capsLockActive);
            return;
        }

        // Skip action insert for other non-character keys like Tab, etc.
        if (key.length > 1 && 
            ![' ', 'delete', 'return'].includes(key) && 
            !key.startsWith('ctrl-') && 
            !key.startsWith('alt-')) {
            return;
        }

        // Create editor-type action for the character
        let char = key;

        // Handle special keys
        if (key === ' ') {
            const action: IAction = { name: 'editor-space', value: '1' };
            insertAction(action);
            return;
        } else if (key === 'delete') {
            const action: IAction = { name: 'editor-backspace', value: '1' };
            insertAction(action);
            return;
        } else if (key === 'return') {
            const action: IAction = { name: 'editor-enter', value: '1' };
            insertAction(action);
            return;
        } else if (key.startsWith('ctrl-') || key.startsWith('alt-')) {
            // Skip these modifier keys
            return;
        }

        // Apply shift if active or use caps lock for letters
        if (key.length === 1) {
            if (shiftActive && (shiftKeyVariants as any)[key]) {
                char = (shiftKeyVariants as any)[key];
            } else if ((shiftActive || capsLockActive) && key.match(/[a-z]/i)) {
                char = key.toUpperCase();
            }
        }

        const action: IAction = { name: 'editor-type', value: char };
        insertAction(action);
    };

    const insertAction = (action: IAction) => {
        // modify the value of the action to prepend space
        if (prependSpaces > 0) {
            action.value = ' '.repeat(prependSpaces) + action.value;
        }

        // Insert this action at currentIndex+1
        const newActions = currentActions
            .slice(0, currentActionIndex + 1)
            .concat([action, ...currentActions.slice(currentActionIndex + 1)]);

        dispatch(setActions(newActions));
        dispatch(setCurrentActionIndex(currentActionIndex + 1));
        dispatch(setDraftActionsString(JSON.stringify(newActions, null, 2)));
    };

    // Set keys sizes for better keyboard appearance
    const getKeySize = (key: string) => {
        switch (key) {
            case 'delete': return '60px';
            case 'tab': return '50px';
            case 'caps': return '60px';
            case 'return': return '60px';
            case 'shift-left': case 'shift-right': return '70px';
            case 'ctrl-left': case 'ctrl-right': case 'alt-left': case 'alt-right': return '50px';
            case ' ': return '160px';
            case '←': case '↑': case '↓': case '→': return '30px';
            case '+': return '40px';
            default: return '25px';
        }
    };

    // Get key color based on state
    const getKeyColor = (key: string) => {
        if (key === 'caps' && capsLockActive) return 'blue';
        if ((key === 'shift-left' || key === 'shift-right') && shiftActive) return 'blue';
        return 'gray';
    };

    // Get display text for key
    const getDisplayText = (key: string) => {
        // Convert special keys to their display names
        if (key === 'shift-left' || key === 'shift-right') return 'shift';
        if (key === 'ctrl-left' || key === 'ctrl-right') return 'ctrl';
        if (key === 'alt-left' || key === 'alt-right') return 'alt';
        
        // For normal characters, apply shift/caps as needed
        let displayKey = key;
        if (key.length === 1) {
            if (shiftActive && (shiftKeyVariants as any)[key]) {
                displayKey = (shiftKeyVariants as any)[key];
            } else if ((shiftActive || capsLockActive) && key.match(/[a-z]/i)) {
                displayKey = key.toUpperCase();
            }
        }
        return displayKey;
    };

    // don't show keyboard on mobile
    if (!isDesktop) {
        return <></>
    }

    return (
        <Flex direction="column" gap="2">
            <Text size="1" color="gray">
                Single keystroke action for <Badge size="1" color="purple">editor-type</Badge>:
            </Text>
            <Flex gap="4">
                {/* Main keyboard */}
                <Flex direction="column" gap="2">
                    {keyboardLayout.map((row, rowIndex) => (
                        <Flex key={`row-${rowIndex}`} gap="1" justify="start" wrap="nowrap">
                            {row.map((key, index) => (
                                <Badge
                                    style={{
                                        cursor: 'pointer',
                                        width: getKeySize(key),
                                        height: key === ' ' ? '21px' : undefined,
                                        textAlign: 'center',
                                        justifyContent: 'center',
                                        userSelect: 'none'
                                    }}
                                    size="1"
                                    key={`${rowIndex}-${key}-${index}`}
                                    color={getKeyColor(key)}
                                    variant="soft"
                                    onClick={() => handleKeyClick(key)}
                                >
                                    {getDisplayText(key)}
                                </Badge>
                            ))}
                        </Flex>
                    ))}
                </Flex>
                
                {/* Numpad section */}
                {showNumpad && (
                    <Flex direction="column" gap="2">
                        {numpadLayout.map((row, rowIndex) => (
                            <Flex key={`numpad-row-${rowIndex}`} gap="1" justify="start" wrap="nowrap">
                                {row.map((key, index) => (
                                    <Badge
                                        style={{
                                            cursor: 'pointer',
                                            width: getKeySize(key),
                                            textAlign: 'center',
                                            justifyContent: 'center',
                                            userSelect: 'none'
                                        }}
                                        size="1"
                                        key={`numpad-${rowIndex}-${key}-${index}`}
                                        color="gray"
                                        variant="soft"
                                        onClick={() => handleKeyClick(key)}
                                    >
                                        {key}
                                    </Badge>
                                ))}
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default ActionKeyboard;