import * as React from 'react';
import Joyride from 'react-joyride';
import { useAppSelector } from '../../../../../hooks/useAppSelector';

// the class names themselves do not need '.' in react, but in the steps below they do :)
export const TutorialCSSClassConstants = {
    PROJECT_INFO_BOX: 'PROJECT_INFO_BOX',
    PROJECT_INFO_PROJECT_TYPE: 'PROJECT_INFO_PROJECT_TYPE',
    ACTION_GUI_EDITOR: 'ACTION_GUI_EDITOR',
    ACTION_GUI_NEXT_BUTTON: 'ACTION_GUI_NEXT_BUTTON',
    STUDIO_NAVIGATION_PLUS_TEN_BUTTON: 'STUDIO_NAVIGATION_PLUS_TEN_BUTTON',
    ACTION_GUI_CLONE_TO_NEXT: 'ACTION_GUI_CLONE_TO_NEXT',
    EXPORT_BOX: 'EXPORT_BOX',
    EDITOR_SELECTOR: 'EDITOR_SELECTOR',
    FULL_SCREEN_BUTTON: 'FULL_SCREEN_BUTTON',
    SOUND_TOGGLE_BUTTON: 'SOUND_TOGGLE_BUTTON',
    RECORD_BUTTON: 'RECORD_BUTTON',
    RECORDING_LOGS_BUTTON: 'RECORDING_LOGS_BUTTON',
    VIDEO_TIME_ESTIMATION_BUTTON: 'VIDEO_TIME_ESTIMATION_BUTTON',
    VIRTUAL_LAYER_LOGS_BUTTON: 'VIRTUAL_LAYER_LOGS_BUTTON',
    PLAYBACK_BUTTON: 'PLAYBACK_BUTTON',
}

export function StudioTutorial() {
    const { isTutorialRunning } = useAppSelector(state => state.tutorial);

    const steps = [
        {
            target: `.${TutorialCSSClassConstants.PROJECT_INFO_BOX}`,
            content: 'This is the project info box. Here you can see the name of the project you are working on, as well as the type of project.',
            disableBeacon: true,
            style: { fontFamily: 'var(--default-font-family)' }
        },
        {
            target: `.${TutorialCSSClassConstants.PROJECT_INFO_PROJECT_TYPE}`,
            content: 'This is the project type. It determines the export format of the project. Currently, we support three project types: courses, lessons, and actions. Courses are made up of one or more lessons, and lessons in turn are made up of one or more actions. All project types are completely interchangeable and convertible at any time in the sidebar.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.ACTION_GUI_EDITOR}`,
            content: 'This is the action editor. Here you can create and edit actions for your project. All actions have a name and value.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.ACTION_GUI_NEXT_BUTTON}`,
            content: 'Click here to move to the next action in the list. The preview to the right will update to show the action you are currently editing.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.STUDIO_NAVIGATION_PLUS_TEN_BUTTON}`,
            content: 'Click here to skip ahead 10 actions in the list. You can likewise jump back 10 actions or jump to the beginning or end of the actions list',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.ACTION_GUI_CLONE_TO_NEXT}`,
            content: 'Click here to clone the current action and insert it after the current action.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.EXPORT_BOX}`,
            content: 'Here, you can export your project to a variety of formats including MP4, GIF, MARKDOWN, HTML, PDF, and more.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.EDITOR_SELECTOR}`,
            content: 'Here, you can switch between the action editor and the JSON editor. The JSON editor is a more low-level tool for editing actions.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.FULL_SCREEN_BUTTON}`,
            content: 'Click here to toggle full screen mode.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.SOUND_TOGGLE_BUTTON}`,
            content: 'Click here to toggle sound on and off. Within the browser, we use the SpeechSynthesis API to read out the actions you have created.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.RECORD_BUTTON}`,
            content: 'Click here to start recording actions. Recording is still in beta, we recommend using the standard action editor for now.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.RECORDING_LOGS_BUTTON}`,
            content: 'Click here to view the logs of your recording.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.VIDEO_TIME_ESTIMATION_BUTTON}`,
            content: 'Click here to get an estimate of the various times it can take to generate a video from your project on various systems.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.VIRTUAL_LAYER_LOGS_BUTTON}`,
            content: 'For a very low level of any info, warning, or error logs issued by the virtual layer of CodeVideo, you can click here to view those logs.',
            disableBeacon: true,
        },
        {
            target: `.${TutorialCSSClassConstants.PLAYBACK_BUTTON}`,
            content: 'We also have a playback feature, still in beta. Clicking this will start the actions at the start and play them back, resulting in an animation similar to the video you can expect to generate from your project.',
            disableBeacon: true,
        },
    ]

    return (
        <Joyride
            run={isTutorialRunning}
            steps={steps}
            continuous={true}
            disableScrolling={true}
            disableOverlayClose={true}
            // tooltipComponent={TooltipComponent}
            styles={{
                tooltipContent: {
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
                },
                buttonBack: {
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
                },
                buttonNext: {
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto, 'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'",
                },
                options: {
                  arrowColor: 'var(--mint-3)',
                  backgroundColor: 'var(--mint-3)',
                  overlayColor: 'var(--mint-a12)',
                  primaryColor: 'var(--mint-8)',
                  textColor: 'var(--mint-12)',
                  width: 350,
                  zIndex: 10000000,
                },
              }}
        />
    );
}
