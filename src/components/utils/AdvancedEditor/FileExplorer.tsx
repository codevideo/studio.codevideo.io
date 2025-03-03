import React, { JSX } from 'react';
import { IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsFileExplorerFocused } from '../../../store/recordingSlice';
import { Box, Flex, Text } from '@radix-ui/themes';
import { FileIcon } from './FileIcons/FileIcon';
import { Folder } from '@react-symbols/icons';

export interface IFileExplorerProps {
    currentFileName?: string
    fileStructure: IFileStructure
}

export function FileExplorer(props: IFileExplorerProps) {
    const { currentFileName, fileStructure } = props;
    const dispatch = useAppDispatch();

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
                        <Text style={{ fontFamily: 'Fira Code, monospace', color: '#CCCECC' }}>
                            {isDirectory ? <Folder height="20"/> : <FileIcon filename={name} />}
                        </Text>
                        <Text style={{ fontFamily: 'Fira Code, monospace', color: '#CCCECC' }}>{name}</Text>
                    </Flex>
                    {isDirectory && item.children && renderFileTree(item.children, fullPath, nextLevel)}
                </Box>
            );
        });
    };

    return (
        <Box
        p="1"
            onClick={() => dispatch(setIsFileExplorerFocused(true))}
            style={{
                height: '100%',
                minWidth: '200px',
                borderRight: '1px solid var(--gray-7)',
                backgroundColor: '#272822',
                pointerEvents: 'none',
                userSelect: 'none',
            }}>
            <Box p="2">{renderFileTree(fileStructure, '', 0)}</Box>
        </Box>
    );
}