import React, { useEffect, useState } from 'react';
import { IAction } from '@fullstackcraftllc/codevideo-types';

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
        <div
            data-codevideo-id="terminal"
            className={`min-h-[200px] bg-zinc-900 text-zinc-300 font-mono p-2 
                       relative overflow-hidden rounded ${className}`}
        >
            <div className="whitespace-pre-wrap break-words">
                {displayText}
                <span className="animate-pulse inline-block w-2 h-4 bg-zinc-300 ml-1">
                </span>
            </div>
        </div>
    );
}