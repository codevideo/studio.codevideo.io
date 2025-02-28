import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { Box, Grid, Button, Card, Heading, Flex, Text } from '@radix-ui/themes';
import { useState } from 'react';

export function RecordingLogs() {
    const [isExpanded, setIsExpanded] = useState(false);
    const { isRecording, atomicRecordedActions, collectedRecordedActions } = useAppSelector(state => state.recording);

    return (
        <Box mt="4">
            <Button
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
                Recording Logs
            </Button>
            
            {isExpanded && (
                <Flex direction="column" mt="2">
                    <Text>{isRecording ? "Currently Recording" : "Not Currently Recording"}</Text>
                <Grid columns={{ initial: "1", lg: "2" }} gap="4" mt="2">
                    <Card
                    >
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
                    </Card>
                    
                    <Card
                    >
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
                    </Card>
                </Grid>
                </Flex>
            )}
        </Box>
    );
}