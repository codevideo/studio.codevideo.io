import { IAction, isAuthorAction, isEditorAction } from "@fullstackcraftllc/codevideo-types";

// returns estimated video duration, estimated longest action, and the action index of the longest action
export const estimateVideoDurationInSeconds = (actions: IAction[]): {
    totalDuration: number,
    longestSpeakActionDuration: number,
    longestSpeakActionIndex: number,
    longestCodeActionDuration: number,
    longestCodeActionIndex: number,
} => {
    // Base durations in seconds
    const DURATIONS: Record<string, (...args: any) => number> = {
        'author-speak-before': (text: string) => {
            // Average speaking rate is about 150 words per minute
            // or 2.5 words per second
            const wordCount = text.split(/\s+/).length;
            return wordCount / 2.5;
        },
        'editor-type': (text: string) => {
            // Assume average typing speed of 30 characters per second
            return text.length / 30;
        },
        'editor-enter': () => 0.3,  // 300ms for enter key
        'editor-backspace': (amount: string) => {
            // Assume backspace is slightly faster than typing
            // About 40 characters per second
            return parseInt(amount) / 40;
        },
        'terminal-type': (text: string) => {
            // Assume average typing speed of 30 characters per second
            return text.length / 30;
        },
        'terminal-enter': () => 0.3,  // 300ms for enter key
        'terminal-backspace': (amount: string) => {
            // Assume backspace is slightly faster than typing
            // About 40 characters per second
            return parseInt(amount) / 40;
        },
        'editor-arrow-up': () => 0.2,   // 200ms for arrow key
        'editor-arrow-down': () => 0.2,
        'editor-arrow-left': () => 0.2,
        'editor-arrow-right': () => 0.2,
        'editor-command-left': () => 0.2,
        'editor-command-right': () => 0.2,
    };

    let totalDuration = 0;
    let pauseAfterSpeak = 0.5;  // Half second pause after speaking
    let pauseAfterTyping = 0.2; // 200ms pause after typing
    let longestSpeakActionDuration = 0;
    let longestSpeakActionIndex = 0;
    let longestCodeActionDuration = 0;
    let longestCodeActionIndex = 0;

    for (const action of actions) {
        const actionName = action.name as any;
        if (actionName in DURATIONS) {
            const duration = (DURATIONS as any)[actionName](action.value);
            totalDuration += duration;

            // Add pauses after certain actions
            if (actionName === 'author-speak-before') {
                totalDuration += pauseAfterSpeak;
            } else if (actionName === 'editor-type' || actionName === 'terminal-type') {
                totalDuration += pauseAfterTyping;
            }

            // Keep track of the longest action
            if (duration > longestSpeakActionDuration && isAuthorAction(action)) {
                longestSpeakActionDuration = duration;
                longestSpeakActionIndex = actions.indexOf(action);
            }

            if (duration > longestCodeActionDuration && isEditorAction(action)) {
                longestCodeActionDuration = duration;
                longestCodeActionIndex = actions.indexOf(action);
            }

        }
    }

    return {
        totalDuration,
        longestSpeakActionDuration,
        longestSpeakActionIndex,
        longestCodeActionDuration,
        longestCodeActionIndex,
    };
}