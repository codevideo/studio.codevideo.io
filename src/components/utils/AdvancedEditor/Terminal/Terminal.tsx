import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@radix-ui/themes';
import { GUIMode, IAction } from '@fullstackcraftllc/codevideo-types';
import { sleep } from '../../../../utils/sleep';

export interface ITerminalProps {
    mode: GUIMode
    actions: Array<IAction>;
    currentActionIndex: number;
    virtualTerminal: any;
    actionFinishedCallback: () => void;
}

export function Terminal(props: ITerminalProps) {
    const { mode, actions, currentActionIndex, virtualTerminal, actionFinishedCallback } = props;
    const [terminalBuffer, setTerminalBuffer] = useState<string>(virtualTerminal.getBuffer().join('\n'));
    const terminalRef = useRef<HTMLDivElement>(null);

    if (!virtualTerminal) {
        return null;
    }

    // always update terminal buffer when current action index changes also auto-scroll to bottom whenever the terminal buffer changes
    useEffect(() => {
        const terminalBuffer = virtualTerminal.getBuffer().join('\n');
        setTerminalBuffer(terminalBuffer);
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [currentActionIndex]);

    const typeLatestCommand = async () => {
        const currentAction = actions[currentActionIndex];
        if (currentAction && currentAction.name === 'terminal-type') {
            const terminalOutput = currentAction.value;
            const terminalLines = terminalOutput.split('\n');
            const latestLine = terminalLines[terminalLines.length - 1];
            if (latestLine) {
                // loop at character level to simulate typing
                for (let i = 0; i < latestLine.length; i++) {
                    setTerminalBuffer((prev) => prev + latestLine[i]);
                    await sleep(100)
                }
            }
        }
        // actionFinishedCallback();
    }

    // special effects for playback - if current action index changes and we are in playback mode, we need to animate the newest line
    useEffect(() => {
        const currentAction = actions[currentActionIndex];
        if (mode === 'replay' && currentAction && currentAction.name === 'terminal-type') {
            typeLatestCommand();
        }
    }, [mode, currentActionIndex]);

    return (
        <Box
            data-codevideo-id="terminal"
            ref={terminalRef}
            style={{
                borderTop: '1px solid var(--gray-7)',
                height: '150px',
                backgroundColor: '#272822',
                fontFamily: 'Fira Code, monospace',
                padding: '8px',
                position: 'relative',
                overflow: 'auto', // Changed from 'hidden' to 'auto' to enable scrolling
                scrollBehavior: 'smooth', // Add smooth scrolling effect
            }}
        >
            <Box style={{
                whiteSpace: 'pre-wrap',  // This enables text wrapping
                wordBreak: 'break-word', // This ensures words break properly
                fontWeight: 'bold',
                width: '100%',           // Ensure the content takes full width of container
            }}>
                {terminalBuffer}
                <Box
                    style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '19px',
                        marginBottom: '-4px',
                        backgroundColor: 'var(--gray-12)',
                        animation: 'blink 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                />
            </Box>
        </Box>
    );
}