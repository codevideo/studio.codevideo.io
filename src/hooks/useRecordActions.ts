import React, { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "./useAppSelector";
import { useAppDispatch } from "./useAppDispatch";
import { AllActions, IAction } from "@fullstackcraftllc/codevideo-types";
import { setAtomicRecordedActions, setCollectedRecordedActions, setIsEditorFocused, setIsFileExplorerFocused, setIsTerminalFocused } from "../store/recordingSlice";

const convertKeyNameToCodeVideoName = (prefix: string, key: string) => {
    switch (key) {
        case "Enter":
            return `${prefix}-enter`;
        case "Backspace":
            return `${prefix}-backspace`;
        case "Delete":
            return `${prefix}-delete`;
        case "ArrowUp":
        case "38": // Up arrow keycode
            return `${prefix}-arrow-up`;
        case "ArrowDown":
        case "40": // Down arrow keycode
            return `${prefix}-arrow-down`;
        case "ArrowLeft":
        case "37": // Left arrow keycode
            return `${prefix}-arrow-left`;
        case "ArrowRight":
        case "39": // Right arrow keycode
            return `${prefix}-arrow-right`;
        case "Tab":
            return `${prefix}-tab`;
        case "Space":
            return `${prefix}-space`;
        default:
            return `${prefix}-type`;
    }
};

// Helper to convert keyCode to string representation
const keyCodeToString = (keyCode: number): string => {
    switch (keyCode) {
        case 8: return "Backspace";
        case 9: return "Tab";
        case 13: return "Enter";
        case 27: return "Escape";
        case 32: return "Space";
        case 37: return "ArrowLeft";
        case 38: return "ArrowUp";
        case 39: return "ArrowRight";
        case 40: return "ArrowDown";
        case 46: return "Delete";
        default: return String(keyCode);
    }
};

export const useRecordActions = () => {
    const { isRecording, atomicRecordedActions, collectedRecordedActions, isFileExplorerFocused, isEditorFocused, isTerminalFocused } = useAppSelector(state => state.recording);
    const dispatch = useAppDispatch();
    // record keystrokes and put into file-explorer-type, editor-type or terminal-type actions, depending on what the current focused element is
    const [actions, setActions] = useState<Array<IAction>>([]);
    const [speechRecognition, setSpeechRecognition] = useState<any | null>(null);

    // KeyLogger for recording keystrokes (standard keys)
    const keyLoggerCallback = useCallback((event: KeyboardEvent) => {
        if (!isRecording) return;
        
        let key = event.key;
        console.log(`Key pressed (keydown): ${key}, keyCode: ${event.keyCode}`);

        // "Shift" we can ignore
        if (key === "Shift") {
            return;
        }
        
        // Handle Enter key to produce a new line rather than the string "Enter"
        if (key === "Enter") {
            key = "\n";
        }
        
        // Handle arrow keys and special keys
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            // This is an arrow key - use keyCode
            const arrowKey = keyCodeToString(event.keyCode);
            recordKeyboardAction(arrowKey);
            // Prevent default browser behavior for arrow keys
            event.preventDefault();
        } else if (event.key === 'Backspace' || event.keyCode === 8) {
            // Explicitly handle Backspace key (keyCode 8)
            console.log("Backspace detected");
            recordKeyboardAction('Backspace');
            // We don't prevent default for Backspace as we typically want the character deletion to happen
        } else {
            // Handle regular keys
            recordKeyboardAction(key);
        }
    }, [isRecording, isFileExplorerFocused, isEditorFocused, isTerminalFocused]);

    // Set up key event listeners
    useEffect(() => {
        if (isRecording) {
            // We specifically use keydown to catch arrow keys
            window.addEventListener("keydown", keyLoggerCallback);
        }
        
        return () => {
            window.removeEventListener("keydown", keyLoggerCallback);
        };
    }, [isRecording, keyLoggerCallback]);

    // Setup focus detection
    useEffect(() => {
        const handleFocus = (event: FocusEvent) => {
            const target = event.target as HTMLElement;
            const isFileExplorer = target.closest('.file-explorer') !== null;
            const isEditor = target.closest('.editor') !== null;
            const isTerminal = target.closest('.terminal') !== null;
            
            dispatch(setIsFileExplorerFocused(isFileExplorer));
            dispatch(setIsEditorFocused(isEditor));
            dispatch(setIsTerminalFocused(isTerminal));
        };

        document.addEventListener('focusin', handleFocus);
        
        return () => {
            document.removeEventListener('focusin', handleFocus);
        };
    }, []);

    const recordKeyboardAction = (key: string) => {
        if (isFileExplorerFocused) {
            // TODO: add file-explorer-edit-filename action
            // setActions(prev => [...prev, { name: 'file-explorer-edit-filename', value: key }]);
        } else if (isEditorFocused) {
            const codeVideoName = convertKeyNameToCodeVideoName('editor', key) as AllActions;
            
            console.log(`Recording action: ${codeVideoName}, key: ${key}`);
            
            if (key.startsWith('Arrow') || key === '37' || key === '38' || key === '39' || key === '40' || 
                key === 'Backspace' || key === 'Delete' || key === 'Tab') {
                // For arrow keys and other special keys, we record with a value of "1"
                setActions(prev => [...prev, { name: codeVideoName, value: "1" }]);
            } else if (codeVideoName === 'editor-type') {
                // For regular typing
                setActions(prev => [...prev, { name: codeVideoName, value: key }]);
            } else {
                // For other special keys
                setActions(prev => [...prev, { name: codeVideoName, value: "1" }]);
            }
        } else if (isTerminalFocused) {
            // Handle terminal typing, including special keys
            if (key.startsWith('Arrow') || key === '37' || key === '38' || key === '39' || key === '40') {
                const terminalAction = `terminal-${key.toLowerCase().replace('arrow', 'arrow-')}` as AllActions;
                setActions(prev => [...prev, { name: terminalAction, value: "1" }]);
            } else {
                setActions(prev => [...prev, { name: 'terminal-type', value: key }]);
            }
        }
    };

    // TODO: add mouse recording hook here from codevideo-virtual-mouse (needs to be refactored there first, consumption of produced actions have to be at intervals)
    const recordMouseAction = () => {
        // TODO
    };

    // Speech recognition implementation
    const setupSpeechRecognition = useCallback(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported in this browser');
            return;
        }
        
        // Create speech recognition instance
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    transcript += event.results[i][0].transcript;
                }
            }
            
            if (transcript.trim()) {
                recordAuthorSpeakAction(transcript);
            }
        };
        
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
        };
        
        setSpeechRecognition(recognition);
        
        return recognition;
    }, []);

    // Start/stop speech recognition based on recording state
    useEffect(() => {
        if (isRecording) {
            const recognition = speechRecognition || setupSpeechRecognition();
            if (recognition) {
                try {
                    recognition.start();
                } catch (error) {
                    // Handle case where recognition might already be running
                    console.log('Speech recognition already started or error:', error);
                }
            }
        } else if (speechRecognition) {
            speechRecognition.stop();
        }
        
        return () => {
            speechRecognition?.stop();
        };
    }, [isRecording, speechRecognition, setupSpeechRecognition]);

    const recordAuthorSpeakAction = (speech: string) => {
        setActions(prev => [...prev, { name: "author-speak-before", value: speech }]);
    };

    // Optimized: When actions change, set atomic actions and only process newly added actions for collection
    useEffect(() => {
        dispatch(setAtomicRecordedActions(actions));

        if (actions.length < 1) {
            return;
        }

        // Get the existing collected actions from Redux state
        const existingCollected = collectedRecordedActions || [];
        
        // Only process new actions that haven't been collected yet
        const startIndex = actions.length - (actions.length - atomicRecordedActions.length);
        
        // If no new actions or if we're starting fresh
        if (startIndex >= actions.length || startIndex < 0) {
            // Reprocess everything if we can't determine where to start
            processAllActions();
            return;
        }
        
        // Process only the new actions and merge with existing collected
        processIncrementalActions(startIndex);
        
        function processAllActions() {
            const newCollectedActions: Array<IAction> = [];
            let currentCollectedAction: IAction | null = null;
            
            for (let i = 0; i < actions.length; i++) {
                const action = actions[i];

                if (!action) {
                    continue;
                }
                
                if (!currentCollectedAction) {
                    currentCollectedAction = { ...action };
                    continue;
                }
                
                if (action.name === currentCollectedAction.name) {
                    if (action.name.includes('type')) {
                        currentCollectedAction.value += action.value;
                    }
                } else {
                    newCollectedActions.push(currentCollectedAction);
                    currentCollectedAction = { ...action };
                }
            }
            
            if (currentCollectedAction) {
                newCollectedActions.push(currentCollectedAction);
            }
            
            dispatch(setCollectedRecordedActions(newCollectedActions));
        }
        
        function processIncrementalActions(startIdx: number) {
            // If we have existing collected actions
            if (existingCollected.length > 0) {
                let newCollectedActions = [...existingCollected];
                let lastCollectedAction = {...newCollectedActions[newCollectedActions.length - 1]};
                
                // Process each new action
                for (let i = startIdx; i < actions.length; i++) {
                    const action = actions[i];

                    if (!action) {
                        continue;
                    }
                    
                    // If new action matches the type of the last collected action
                    if (action.name === lastCollectedAction.name) {
                        if (action.name.includes('type')) {
                            lastCollectedAction.value += action.value;
                        }
                    } else {
                        if (!lastCollectedAction.name) {
                            continue;
                        }
                        if (!lastCollectedAction.value) {
                            continue;
                        }

                        // Add the completed last action and start a new one
                        //@ts-ignore
                        newCollectedActions[newCollectedActions.length - 1] = lastCollectedAction;
                        lastCollectedAction = { ...action };
                        //@ts-ignore
                        newCollectedActions.push(lastCollectedAction);
                    }
                }
                
                // Update the last action in our collection
                if (newCollectedActions.length > 0) {
                    //@ts-ignore
                    newCollectedActions[newCollectedActions.length - 1] = lastCollectedAction;
                }
                
                dispatch(setCollectedRecordedActions(newCollectedActions));
            } else {
                // If we don't have existing collected actions, process all
                processAllActions();
            }
        }
    }, [actions, dispatch]);

    // No need to return anything since we're using Redux
};