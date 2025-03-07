import * as React from 'react';
import { useAppSelector } from '../../../../../hooks/useAppSelector';
import { Box, Grid, Button, Select, Flex, Text, Badge, Code } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';
import { IVirtualLayerLog, LogType, VirtualLayerLogSource } from '@fullstackcraftllc/codevideo-types';
import { TutorialCSSClassConstants } from '../../../../layout/sidebar/StudioTutorial';

export function VirtualLayerLogs() {
    const { currentActions, currentActionIndex } = useAppSelector(state => state.editor);
    // const [allLogsOverAllTime, setAllLogsOverAllTime] = useState<IVirtualLayerLog[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [minLevel, setMinLevel] = useState<'all' | LogType>('all');
    const [source, setSource] = useState<'all' | VirtualLayerLogSource>('all');
    const virtualIDE = new VirtualIDE(currentActions, currentActionIndex, true);
    const logs = virtualIDE.getLogs();


    // TODO: this quickly explodes in size.. would need a virtualized list or clever way of showing only relevant logs
    // every time logs change, update the allLogsOverAllTime - being sure not to include with identical timestamps
    // useEffect(() => {
    //     const newLogs = logs.filter(log => !allLogsOverAllTime.some(existingLog => existingLog.timestamp === log.timestamp));
    //     setAllLogsOverAllTime([...allLogsOverAllTime, ...newLogs]);
    // }, [logs]);


    // filter out logs based on minLevel and source
    const filteredLogs = logs.filter(log => {
        if (minLevel !== 'all' && log.type !== minLevel) return false;
        if (source !== 'all' && log.source !== source) return false;
        return true;
    }).sort((a, b) => a.timestamp - b.timestamp);

    const getColoredSourceBadge = (log: IVirtualLayerLog) => {
        switch (true) {
            case log.source === 'virtual-editor':
                return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="blue">{log.source}</Badge>
            case log.source === 'virtual-file-explorer':
                return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="green">{log.source}</Badge>
            case log.source === 'virtual-editor':
                return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="purple">{log.source}</Badge>
            case log.source === 'virtual-terminal':
                return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="gray">{log.source}</Badge>
            // TODO: creating a codevideo-virtual-mouse may be way easier than the complex logic in mouse? but mouse is tough...
            // case log.startsWith('VirtualMouse'):
            //   return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="pink">{log.source}</Badge>
            case log.source === 'virtual-ide':
                return <Badge style={{ fontFamily: 'Fira Code, monospace' }} size="1" color="yellow">{log.source}</Badge>
            default:
                return <Text style={{ fontFamily: 'Fira Code, monospace' }}>{log.source}</Text>
        }
    }

    // Get unique log sources for the select component
    const uniqueSources = ['all', ...new Set(logs.map(log => log.source))];

    // Log types for the select component
    const logTypes: Array<'all' | LogType> = ['all', 'info', 'warning', 'error'];

    return (
        <Box>
            <Button
                className={TutorialCSSClassConstants.VIRTUAL_LAYER_LOGS_BUTTON}
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
                Virtual Layer Logs
            </Button>

            {isExpanded && (
                <Flex direction="column" mt="2">
                    <Text>(Only shows logs of latest step)</Text>
                    <Flex gap="4" my="2">
                        {/* Log Level Select with label */}
                        <Flex align="center" gap="2">
                            <Text size="2" weight="medium">Level:</Text>
                            <Select.Root
                                value={minLevel}
                                onValueChange={(value) => setMinLevel(value as 'all' | LogType)}
                            >
                                <Select.Trigger placeholder="Select log level" />
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Log Level</Select.Label>
                                        {logTypes.map((type) => (
                                            <Select.Item key={type} value={type}>
                                                {type}
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Flex>

                        {/* Log Source Select with label */}
                        <Flex align="center" gap="2">
                            <Text size="2" weight="medium">Source:</Text>
                            <Select.Root
                                value={source}
                                onValueChange={(value) => setSource(value as 'all' | VirtualLayerLogSource)}
                            >
                                <Select.Trigger placeholder="Select log source" />
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Log Source</Select.Label>
                                        {uniqueSources.map((src) => (
                                            <Select.Item key={src} value={src}>
                                                {src}
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                    </Flex>

                    <Grid columns={{ initial: "1", lg: "1" }} gap="4" mt="2">
                        {filteredLogs.length === 0 ? (
                            <Box>
                                {source === 'all' && <Text size="2" weight="medium" style={{ color: 'var(--colors-slate11)' }}>
                                    No logs of type <Code>{minLevel}</Code> found.
                                </Text>}
                                {source !== 'all' && <Text size="2" weight="medium" style={{ color: 'var(--colors-slate11)' }}>
                                    No logs of type <Code>{minLevel}</Code>, source <Code>{source}</Code> found! Nice work!
                                </Text>}
                            </Box>
                        ) : (
                            <Box style={{
                                overflow: 'auto',
                                fontSize: 'var(--font-size-1)',

                            }}>
                                {filteredLogs.map((log, index) => (
                                    <pre key={index}
                                        style={{
                                            whiteSpace: 'pre-wrap',  // This enables text wrapping
                                            wordBreak: 'break-word', // This ensures words break properly
                                        }}
                                    >
                                        <Badge style={{ fontFamily: 'Fira Code, monospace' }} color="gray" size="1">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</Badge>
                                        {getColoredSourceBadge(log)}
                                        <Badge style={{ fontFamily: 'Fira Code, monospace' }} color="gray" size="1">{log.message}</Badge>
                                    </pre>
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Flex>
            )}
        </Box>
    );
}