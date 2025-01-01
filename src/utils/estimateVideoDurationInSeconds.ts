import { IAction } from "@fullstackcraftllc/codevideo-types";

export const estimateVideoDurationInSeconds = (actions: IAction[]): number => {
    // Base durations in seconds
    const DURATIONS: any = {
        'speak-before': (text: string) => {
            // Average speaking rate is about 150 words per minute
            // or 2.5 words per second
            const wordCount = text.split(/\s+/).length;
            return wordCount / 2.5;
        },
        'type-editor': (text: string) => {
            // Assume average typing speed of 30 characters per second
            return text.length / 30;
        },
        'enter': () => 0.3,  // 300ms for enter key
        'backspace': (amount: string) => {
            // Assume backspace is slightly faster than typing
            // About 40 characters per second
            return parseInt(amount) / 40;
        },
        'arrow-up': () => 0.2,   // 200ms for arrow key
        'arrow-down': () => 0.2,
        'arrow-left': () => 0.2,
        'arrow-right': () => 0.2,
        'command-left': () => 0.2,
        'command-right': () => 0.2,
        'type-terminal': (text: string) => text.length / 30, // Same as editor typing
    };

    let totalDuration = 0;
    let pauseAfterSpeak = 0.5;  // Half second pause after speaking
    let pauseAfterTyping = 0.2; // 200ms pause after typing

    for (const action of actions) {
        const actionName = action.name as any;
        if (actionName in DURATIONS) {
            const duration = DURATIONS[actionName](action.value);
            totalDuration += duration;

            // Add pauses after certain actions
            if (actionName === 'speak-before') {
                totalDuration += pauseAfterSpeak;
            } else if (actionName === 'type-editor' || actionName === 'type-terminal') {
                totalDuration += pauseAfterTyping;
            }
        }
    }

    return totalDuration;
}