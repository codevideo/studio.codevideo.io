import React, { JSX } from 'react';
import { IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { getFileIcon } from './FileIcons/FileIcons';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { setIsFileExplorerFocused } from '../../../store/recordingSlice';

export interface IFileExplorerProps {
    currentFileName?: string
    fileStructure: IFileStructure
}

export function FileExplorer(props: IFileExplorerProps) {
    const { currentFileName, fileStructure } = props;
    const dispatch = useAppDispatch();

    const renderFileTree = (structure: IFileStructure, path: string = ''): JSX.Element[] => {
        return Object.entries(structure).map(([name, item]) => {
            const fullPath = path ? `${path}/${name}` : name;
            const isDirectory = item.type === 'directory';

            return (
                <div key={fullPath} className="ml-4">
                    <div
                        data-codevideo-id={`file-explorer-${fullPath}`}
                        className={`flex items-center gap-2 p-1 rounded hover:bg-slate-700 cursor-pointer ${currentFileName === fullPath ? 'bg-slate-700' : ''
                            }`}
                    >
                        <span className="text-slate-400">
                            {isDirectory ? '📁' : getFileIcon(name)}
                        </span>
                        <span className="text-slate-200">{name}</span>
                    </div>
                    {isDirectory && item.children && renderFileTree(item.children, fullPath)}
                </div>
            );
        });
    };

    return (
        <div onClick={() => dispatch(setIsFileExplorerFocused(true))}>
            <div className="h-full border-r border-slate-600">
                <div className="p-2">{renderFileTree(fileStructure)}</div>
            </div>
        </div>
    );
}
