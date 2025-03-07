import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { estimateVideoDurationInSeconds } from '../../../../../utils/estimateVideoDurationInSeconds';
import { formatDuration } from '../../../../../utils/formatDuration';
import { Box, Button, Flex, Grid, Text } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';

export function VideoTimeEstimationsAndStats() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { currentActions } = useAppSelector(state => state.editor);
    const {
        totalDuration,
        longestSpeakActionDuration,
        longestSpeakActionIndex,
        longestCodeActionDuration,
        longestCodeActionIndex
    } = useMemo(() =>
        estimateVideoDurationInSeconds(currentActions),
        [currentActions]
    );

    // num clips is equivalent to the number of actions
    const numClips = currentActions.length;
    const avgClipDuration = Math.ceil(totalDuration / numClips);
    const generationTimeM4 = Math.ceil(numClips / 18);
    const generationTimeDigitalOcean = Math.ceil(numClips / 4);

    return (
        <Box>
            <Button
                className={TutorialCSSClassConstants.VIDEO_TIME_ESTIMATION_BUTTON}
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                color="mint"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
                <svg
                    style={{
                        width: '16px',
                        height: '16px',
                        transform: isExpanded ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.2s'
                    }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Video Time Estimations & Stats
            </Button>

            {isExpanded && (
                <Box style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <Text size="2">Total Actions: <Text size="2" weight="medium">{currentActions.length}</Text></Text>
                    <Text size="2">Estimated Video Length: <Text size="2" weight="medium">{formatDuration(totalDuration)} ({numClips} clips at {formatDuration(avgClipDuration)} / ea.)</Text></Text>
                    <Text size="2">Estimated Generation Times:</Text>
                    <Flex direction="column" pl="2">
                        <Text size="1">In Production:</Text>
                        <Text size="1">- 4 GB Intel, CodeVide API v1.0.0: <Text size="1" weight="medium">{formatDuration(totalDuration)}</Text></Text>
                        <Text size="1">In development:</Text>
                        <Text size="1">- Parallel cloud arch: <Text size="1" weight="medium">{formatDuration(longestSpeakActionDuration)}</Text> (maximum length of longest action)</Text>
                        <Text size="1">- 512 GB Apple M3 Ultra, parallel: <Text size="1" weight="medium">{formatDuration(generationTimeM4/4)}</Text></Text>
                        <Text size="1">- 64 GB Apple M3, parallel: <Text size="1" weight="medium">{formatDuration(generationTimeM4)}</Text></Text>
                        <Text size="1">- 4 GB Intel, parallel: <Text size="1" weight="medium">{formatDuration(generationTimeDigitalOcean)}</Text></Text>
                    </Flex>
                    <Box>
                        <Text size="2" mb="1">Longest Estimated Speak Action: <Text size="2" weight="medium">{formatDuration(longestSpeakActionDuration)}</Text> (Step {longestSpeakActionIndex + 1})</Text>
                        <Box
                        >
                            <pre>
                                <Text size="1">{JSON.stringify(currentActions[longestSpeakActionIndex], null, 2)}</Text>
                            </pre>
                        </Box>
                    </Box>
                    <Box>
                        <Text size="2" mb="1">Longest Estimated Code Action: <Text size="2" weight="medium">{formatDuration(longestCodeActionDuration)}</Text> (Step {longestCodeActionIndex + 1})</Text>
                        <Box
                        >
                            <pre>
                                <Text size="1">{JSON.stringify(currentActions[longestCodeActionIndex], null, 2)}</Text>
                            </pre>
                        </Box>
                    </Box>
                </Box>

            )}
        </Box>
    );
}