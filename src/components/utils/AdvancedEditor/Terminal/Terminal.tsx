import React, { useEffect, useState } from 'react';
import { IAction } from '@fullstackcraftllc/codevideo-types';
import { Box } from '@radix-ui/themes';

interface TerminalProps {
    actions: Array<IAction>;
    actionIndex?: number;
    className?: string;
}

const defaultPrompt = '[codevideo.studio] /> ';

export function Terminal(props: TerminalProps) {
    const { actions, actionIndex = 0, className = '' } = props;
    const [displayText, setDisplayText] = useState(defaultPrompt);

    const getCurrentTerminalCommand = () => {
        if (!actionIndex) {
            return "";
        }
        const currentAction = actions[actionIndex];
        if (!currentAction) {
            return "";
        }
        if (currentAction.name === 'terminal-type') {
            return currentAction.value;
        }
        return "";
    };

    useEffect(() => {
        const currentCommand = getCurrentTerminalCommand();
        if (currentCommand) {
            setDisplayText(defaultPrompt + currentCommand);
        } else {
            setDisplayText(defaultPrompt);
        }
    }, [actionIndex, actions]);

    return (
        <Box
            data-codevideo-id="terminal"
            className={className}
            style={{
                borderTop: '1px solid var(--gray-7)',
                minHeight: '150px',
                backgroundColor: '#272822',
                fontFamily: 'Fira Code, monospace',
                padding: '8px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Box style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 'bold' }}>
                {displayText}
                <Box
                    style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '16px',
                        backgroundColor: 'var(--gray-5)',
                        marginLeft: '4px',
                        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                />
            </Box>
        </Box>
    );
}