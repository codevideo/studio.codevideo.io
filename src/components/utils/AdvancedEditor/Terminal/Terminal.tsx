import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import 'xterm/css/xterm.css';

interface TerminalProps {
    className?: string;
    onCommand?: (command: string) => void;
    initialCommand?: string;
}

const defaultPrompt = '[codevideo.studio] /> ';

export function Terminal(props: TerminalProps) {
    const { className, onCommand, initialCommand } = props;
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<XTerm | null>(null);
    const currentLineRef = useRef<string>('');

    useEffect(() => {
        if (!terminalRef.current) return;

        // Initialize xterm.js
        const term = new XTerm({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Fira Code, monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#d4d4d4',
                cursor: '#d4d4d4',
                black: '#1e1e1e',
                red: '#f44747',
                green: '#6a9955',
                yellow: '#d7ba7d',
                blue: '#569cd6',
                magenta: '#c586c0',
                cyan: '#4dc9b0',
                white: '#d4d4d4',
            },
            allowTransparency: true,
        });

        // Store refs
        xtermRef.current = term;

        // Open terminal in the container
        term.open(terminalRef.current);

        // Write initial prompt
        term.write(`\r\n${defaultPrompt}`);

        // Handle initial command if provided
        if (initialCommand) {
            term.write(initialCommand);
            currentLineRef.current = initialCommand;
        }

        // Handle input
        term.onKey(({ key, domEvent }) => {
            const ev = domEvent;
            const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

            if (ev.keyCode === 13) { // Enter
                // Process command
                const command = currentLineRef.current;
                onCommand?.(command);

                // Reset current line and show new prompt
                currentLineRef.current = '';
                term.write(`\r\n${defaultPrompt}`);
            } else if (ev.keyCode === 8) { // Backspace
                if (currentLineRef.current.length > 0) {
                    currentLineRef.current = currentLineRef.current.slice(0, -1);
                    term.write('\b \b');
                }
            } else if (printable) {
                currentLineRef.current += key;
                term.write(key);
            }
        });

        // Handle window resize
        const handleResize = () => {
            // TODO: Resize xterm.js
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            term.dispose();
        };
    }, [initialCommand, onCommand]);

    return (
        <div
            ref={terminalRef}
            className={`min-h-[200px] bg-[#1e1e1e] ${className}`}
            style={{ padding: '8px' }}
        />
    );
};