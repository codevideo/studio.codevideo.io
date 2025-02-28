import * as React from 'react';
import { useEffect, useState } from 'react';
import { IconButton, Box } from '@radix-ui/themes';
import { SpeakerLoudIcon, SpeakerOffIcon } from '@radix-ui/react-icons';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { speakText, stopSpeaking } from '../../../../../utils/speakText';

export function SoundToggleButton() {
    const { currentActions, currentActionIndex } = useAppSelector(state => state.editor);
    const [isSoundOn, setIsSoundOn] = useState(false);

    const playSoundForCurrentActionIfPossible = async () => {
        const currentAction = currentActions[currentActionIndex];
        if (isSoundOn && currentAction?.name.startsWith("author-")) {
            await speakText(currentAction.value);
        }
    }

    // every time the action index changes, we need to check if the current action is an author (speak) action
    // if it is, we need to play the sound if the sound is on
    useEffect(() => {
        playSoundForCurrentActionIfPossible();
    }, [currentActionIndex]);

    useEffect(() => {
        // any time the sound is toggled to mute, we need to stop speaking
        if (!isSoundOn) {
            stopSpeaking();
            return;
        }
        // if the sound is toggled back on, we need to play the sound for the current action
        playSoundForCurrentActionIfPossible();
    }, [isSoundOn]);

    return (
        <Box>
            <IconButton
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