import { Button } from '@radix-ui/themes';
import * as React from 'react';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { startTutorial } from '../../../store/tutorialSlice';
import mixpanel from 'mixpanel-browser';

export interface ITutorialButtonProps {
    style?: React.CSSProperties;
}

export function TutorialButton(props: ITutorialButtonProps) {
    const { style } = props;
    const { isTutorialRunning } = useAppSelector(state => state.tutorial);
    const dispatch = useAppDispatch();

    const tutorialButtonText = isTutorialRunning ? 'Tutorial running...' : 'Tutorial';

    const handleOnClick = () => {
        mixpanel.track('Tutorial Button Clicked Studio');
        dispatch(startTutorial());
    };

    return (
        <Button
            style={{ cursor: 'pointer', ...style }}
            size="1"
            variant="solid"
            color="mint"
            onClick={handleOnClick}
            disabled={isTutorialRunning}
        >
            {tutorialButtonText}
        </Button>
    );
}
