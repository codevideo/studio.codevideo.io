import * as React from 'react';
import { IEditor } from '@fullstackcraftllc/codevideo-types';

export interface IEditorTabsProps {
    currentFile?: IEditor;
    editors: Array<IEditor>;
}

export function EditorTabs(props: IEditorTabsProps) {
    const { currentFile, editors } = props;
    return (
        <div className="flex border-b border-slate-700 bg-slate-900">
            {editors.map(editor => (
                <div
                    key={editor.filename}
                    className={`flex items-center px-4 py-2 border-r border-slate-700 cursor-pointer ${currentFile?.filename === editor.filename ? 'bg-slate-800' : 'bg-slate-900'
                        }`}

                >
                    <span className="text-slate-300">{editor.filename.split('/').pop()}</span>
                    {editor.isSaved ? <button
                        className="ml-2 text-slate-500 hover:text-slate-300"

                    >
                        ×
                    </button> : <div className="ml-2 w-2 h-2 bg-gray-500 rounded-full"></div>

                    }
                </div>
            ))}
        </div>
    );
}
