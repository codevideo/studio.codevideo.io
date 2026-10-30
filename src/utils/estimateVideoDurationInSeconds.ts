import { IAction, estimateActionDurationsMs, isAuthorAction, isEditorAction } from "@fullstackcraftllc/codevideo-types";

// Videos render on the API's worker through codevideo-cli's /v3 page, which
// sets these pauses instead of the IDE component's defaults (50ms and 1000ms).
const RENDER_PAUSES = { keyboardTypingPauseMs: 40, standardPauseMs: 200 };

// returns estimated video duration, estimated longest action, and the action index of the longest action
export const estimateVideoDurationInSeconds = (actions: IAction[]): {
    totalDuration: number,
    longestSpeakActionDuration: number,
    longestSpeakActionIndex: number,
    longestCodeActionDuration: number,
    longestCodeActionIndex: number,
} => {
    // The same estimate codevideo-cli uses for its progress bar.
    const durations = estimateActionDurationsMs(actions, RENDER_PAUSES).map(ms => ms / 1000);

    let longestSpeakActionDuration = 0;
    let longestSpeakActionIndex = 0;
    let longestCodeActionDuration = 0;
    let longestCodeActionIndex = 0;
    actions.forEach((action, index) => {
        const duration = durations[index] ?? 0;
        if (isAuthorAction(action) && duration > longestSpeakActionDuration) {
            longestSpeakActionDuration = duration;
            longestSpeakActionIndex = index;
        }
        if (isEditorAction(action) && duration > longestCodeActionDuration) {
            longestCodeActionDuration = duration;
            longestCodeActionIndex = index;
        }
    });

    return {
        totalDuration: durations.reduce((total, duration) => total + duration, 0),
        longestSpeakActionDuration,
        longestSpeakActionIndex,
        longestCodeActionDuration,
        longestCodeActionIndex,
    };
}
