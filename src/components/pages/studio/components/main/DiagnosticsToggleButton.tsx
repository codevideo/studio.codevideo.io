import * as React from 'react';
import { IconButton, Box, Tooltip } from '@radix-ui/themes';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

export interface IDiagnosticsToggleProps {
    isDiagnosticsVisible: boolean;
    setIsDiagnosticsVisible: (isDiagnosticsVisible: boolean) => void;
}

/**
 * This is a pure UI component that shows or hides TypeScript squiggles in the
 * IDE preview (the isDiagnosticsVisible IDE option)
 * @returns
 */
export function DiagnosticsToggleButton(props: IDiagnosticsToggleProps) {
    const { isDiagnosticsVisible, setIsDiagnosticsVisible } = props;
    const label = isDiagnosticsVisible ? "Hide TypeScript squiggles" : "Show TypeScript squiggles";
    return (
        <Box>
            <Tooltip content={label}>
                <IconButton
                    aria-label={label}
                    aria-pressed={isDiagnosticsVisible}
                    onClick={() => setIsDiagnosticsVisible(!isDiagnosticsVisible)}
                    size="2"
                    variant={isDiagnosticsVisible ? "solid" : "soft"}
                    color="mint"
                    radius="full"
                >
                    <ExclamationTriangleIcon />
                </IconButton>
            </Tooltip>
        </Box>
    );
}
