import React, { JSX } from 'react';
import { IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { Box, Flex, Text } from '@radix-ui/themes';
import { FileIcon } from './FileIcons/FileIcon';
import { Folder } from '@react-symbols/icons';

export interface IFileExplorerProps {
    theme: 'light' | 'dark'
    currentFileName?: string
    fileStructure?: IFileStructure
}

export function FileExplorer(props: IFileExplorerProps) {
    const { theme, currentFileName, fileStructure } = props;

    const renderFileTree = (structure: IFileStructure, path: string = '', level: number): JSX.Element[] => {
        // Sort entries alphabetically, with directories first, then files
        const sortedEntries = Object.entries(structure).sort((a, b) => {
            const aIsDir = a[1].type === 'directory';
            const bIsDir = b[1].type === 'directory';

            // If both are directories or both are files, sort alphabetically
            if (aIsDir === bIsDir) {
                return a[0].localeCompare(b[0]);
            }

            // Otherwise, directories come first
            return aIsDir ? -1 : 1;
        });

        return sortedEntries.map(([name, item]) => {
            const fullPath = path ? `${path}/${name}` : name;
            const isDirectory = item.type === 'directory';
            const leftMargin = level === 0 ? "0" : "4";
            const nextLevel = level + 1;
            return (
                <Box key={fullPath} ml={leftMargin}>
                    <Flex
                        data-codevideo-id={`file-explorer-${fullPath}`}
                        align="center"
                        gap="2"
                        style={{
                            borderRadius: 'var(--radius-2)',
                            backgroundColor: currentFileName === fullPath ? 'var(--mint-8)' : 'transparent',
                        }}
                    >
                        {isDirectory ? <Folder height="20"/> : <FileIcon filename={name} />}
                        <Text style={{ fontFamily: 'Fira Code, monospace', color: '#CCCECC', fontSize: '0.9em' }}>{name}</Text>
                    </Flex>
                    {isDirectory && item.children && renderFileTree(item.children, fullPath, nextLevel)}
                </Box>
            );
        });
    };

    if (!fileStructure) {
        return <></>;
    }

    return (
        <Box
            p="1"
            style={{
                height: '100%',
                minWidth: '250px',
                borderRight: '1px solid var(--gray-7)',
                backgroundColor: theme === 'light' ? 'var(--gray-5)' : 'var(--gray-4)',
                pointerEvents: 'none',
                userSelect: 'none',
            }}>
            <Box p="2">{renderFileTree(fileStructure, '', 0)}</Box>
        </Box>
    );
}