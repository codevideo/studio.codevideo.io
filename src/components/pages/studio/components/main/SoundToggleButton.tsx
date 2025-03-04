import * as React from 'react';
import { IconButton, Box } from '@radix-ui/themes';
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';
import { TutorialCSSClassConstants } from '../sidebar/StudioTutorial';

export interface ISoundToggleProps {
    isSoundOn: boolean;
    setIsSoundOn: (isSoundOn: boolean) => void;
}

/**
 * This is a pure UI component that toggles the sound on and off
 * @returns 
 */
export function SoundToggleButton(props: ISoundToggleProps) {
    const { isSoundOn, setIsSoundOn } = props;
    return (
        <Box>
            <IconButton
                className={TutorialCSSClassConstants.SOUND_TOGGLE_BUTTON}
                onClick={() => setIsSoundOn(!isSoundOn)}
                size="2"
                variant="solid"
                color="mint"
                radius="full"
            >
                {isSoundOn ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
            </IconButton>
        </Box>
    );
}