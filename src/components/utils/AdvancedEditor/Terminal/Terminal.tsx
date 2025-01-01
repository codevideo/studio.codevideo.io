import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import 'xterm/css/xterm.css';
import { useAppSelector } from '../../../../hooks/useAppSelector';

interface TerminalProps {
    className?: string;
}

const defaultPrompt = '[codevideo.studio] /> ';

// TODO: API should simply be virtualIDE.getFrames() - gives you everything you need at every action index
// for now we do a bit of manual work with the actions and such

export function Terminal(props: TerminalProps) {
    const { className } = props;
    const { codeIndex, actions } = useAppSelector(state => state.editor)

    const getCurrentTerminalCommand = () => {
        const currentAction = actions[codeIndex]
        console.log(currentAction)
        if (!currentAction) {
            return ""
        }
        if (currentAction.name === 'type-terminal') {
            return currentAction.value
        }
        return ""
    }

    const currentTerminalCommand = getCurrentTerminalCommand();
    console.log('currentTemrinalcommand is:', currentTerminalCommand)
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
        if (currentTerminalCommand) {
            term.write(currentTerminalCommand);
            currentLineRef.current = currentTerminalCommand;
        }

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
    }, [currentTerminalCommand]);

    return (
        <div
            ref={terminalRef}
            className={`min-h-[200px] bg-[#1e1e1e] ${className}`}
            style={{ padding: '8px' }}
        />
    );
};