import React, { useEffect, useRef } from 'react';
import { Box } from '@radix-ui/themes';

export interface ITerminalProps {
    terminalBuffer: string;
}

export function Terminal(props: ITerminalProps) {
    const { terminalBuffer } = props;
    const terminalRef = useRef<HTMLDivElement>(null);

    // always update terminal buffer when current action index changes also auto-scroll to bottom whenever the terminal buffer changes
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalBuffer]);


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