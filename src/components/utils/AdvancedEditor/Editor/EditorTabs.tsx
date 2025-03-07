import * as React from 'react';
import { IEditor } from '@fullstackcraftllc/codevideo-types';
import { Flex, Text, Button, Box } from '@radix-ui/themes';

export interface IEditorTabsProps {
    editors: Array<IEditor>;
    theme: 'light' | 'dark';
}

export function EditorTabs(props: IEditorTabsProps) {
    const { editors, theme } = props;

    // if editors are empty, render fixed height to prevent layout shift
    if (editors.length === 0) {
        return <Box style={{
            backgroundColor: theme === 'light' ? 'var(--gray-5)' : 'var(--gray-4)',
            height: '30px',
            borderBottom: '1px solid var(--gray-7)',
        }} />;
    }

    return (
        <Flex
            style={{
                backgroundColor: theme === 'light' ? 'var(--gray-5)' : 'var(--gray-4)',
                height: '30px',
                borderBottom: '1px solid var(--gray-7)',
                pointerEvents: 'none',
                userSelect: 'none',
            }}
        >
            {editors.map(editor => (
                <Flex
                    key={editor.filename}
                    align="center"
                    style={{ borderRight: '1px solid var(--gray-7)', padding: '0 10px' }}
                >
                    <Text style={{ fontFamily: 'Fira Code, monospace', color: '#CCCECC' }}>
                        {editor.filename.split('/').pop()}
                    </Text>

                    {editor.isSaved ? (
                        <Box
                            ml="2"
                            style={{
                                color: 'var(--gray-8)',
                                padding: 0,
                                lineHeight: 1,
                                minWidth: 'auto',
                            }}
                        >
                            ×
                        </Box>
                    ) : (
                        <Box
                            ml="2"
                            style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: theme === 'light' ? 'var(--gray-5)' : 'var(--gray-4)',
                                borderRadius: '9999px'
                            }}
                        />
                    )}
                </Flex>
            ))}
        </Flex>
    );
}