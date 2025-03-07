import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { Box, Grid, Button, Heading, Flex, Text } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';

export function RecordingLogs() {
    const { isRecording, atomicRecordedActions, collectedRecordedActions } = useAppSelector(state => state.recording);
    const [isExpanded, setIsExpanded] = useState(isRecording);

    useEffect(() => {
        setIsExpanded(isRecording);
    }, [isRecording]);

    return (
        <Box>
            <Button
                className={TutorialCSSClassConstants.RECORDING_LOGS_BUTTON}
                onClick={() => setIsExpanded(!isExpanded)}
                variant="ghost"
                color="mint"
                style={{ display: 'flex', alignItems: 'center', gap: '8px',  }}
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
                Recording Logs
            </Button>

            {isExpanded && (
                <Flex direction="column" mt="2">
                    <Text size="1">{isRecording ? "Currently Recording" : "Not Currently Recording"}</Text>
                    <Grid columns={{ initial: "1", lg: "2" }} gap="4" mt="2">
                        <Box>
                            <Heading size="2" mb="2">
                                Atomic Actions
                            </Heading>
                            <Box style={{
                                overflow: 'auto',
                                fontSize: 'var(--font-size-1)'
                            }}>
                                <pre>
                                    {JSON.stringify(atomicRecordedActions, null, 2)}
                                </pre>
                            </Box>
                        </Box>
                        <Box>
                            <Heading size="2" mb="2">
                                Collected Actions (Simplified)
                            </Heading>
                            <Box style={{
                                overflow: 'auto',
                                fontSize: 'var(--font-size-1)'
                            }}>
                                <pre>
                                    {JSON.stringify(collectedRecordedActions, null, 2)}
                                </pre>
                            </Box>
                        </Box>
                    </Grid>
                </Flex>
            )}
        </Box>
    );
}