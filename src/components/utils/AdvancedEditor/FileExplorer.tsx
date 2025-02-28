import React, { JSX } from 'react';
import { IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { getFileIcon } from './FileIcons/FileIcons';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsFileExplorerFocused } from '../../../store/recordingSlice';
import { Box, Flex, Text } from '@radix-ui/themes';

export interface IFileExplorerProps {
    currentFileName?: string
    fileStructure: IFileStructure
}

export function FileExplorer(props: IFileExplorerProps) {
    const { currentFileName, fileStructure } = props;
    const dispatch = useAppDispatch();

    const renderFileTree = (structure: IFileStructure, path: string = '', level: number): JSX.Element[] => {
        return Object.entries(structure).map(([name, item]) => {
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
                        p="1"
                        style={{
                            borderRadius: 'var(--radius-2)',
                            backgroundColor: currentFileName === fullPath ? 'var(--mint-8)' : 'transparent',
                            cursor: 'pointer',
                        }}
                    >
                        <Text style={{ fontFamily: 'Fira Code, monospace', color: '#CCCECC' }}>
                            {isDirectory ? '📁' : getFileIcon(name)}
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