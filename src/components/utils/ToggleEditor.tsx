import * as React from 'react';
import { useState } from 'react';
import { ActionEditor } from './ActionEditor';
import { SimpleEditor } from './SimpleEditor';
import { IAction } from '@fullstackcraftllc/codevideo-types';

export interface IToggleEditorProps {
    stepsJson: string;
    setStepsJson: (stepsJson: string) => void;
    tokenizerCode: string;
}

export function ToggleEditor(props: IToggleEditorProps) {
    const { stepsJson, setStepsJson, tokenizerCode } = props;
    const [editorMode, setEditorMode] = useState(true);

    return (
        <div className="rounded-lg bg-white shadow-sm p-6 border border-gray-200">
            <div className="flex gap-6 mb-4 flex-row justify-center items-center">
                <div className="flex items-center">
                    <input
                        id="editor-mode"
                        type="radio"
                        name="editor-mode"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        checked={editorMode}
                        onChange={() => setEditorMode(true)}
                    />
                    <label htmlFor="editor-mode" className="ml-2 text-gray-700 cursor-pointer">
                        Editor Mode
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="json-mode"
                        type="radio"
                        name="editor-mode"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        checked={!editorMode}
                        onChange={() => setEditorMode(false)}
                    />
                    <label htmlFor="json-mode" className="ml-2 text-gray-700 cursor-pointer">
                        JSON Mode
                    </label>
                </div>
            </div>
            {editorMode ? (
                <ActionEditor />
            ) : (
                <SimpleEditor
                    path="json/"
                    value={stepsJson}
                    actions={[]}
                    language="json"
                    tokenizerCode={tokenizerCode}
                    onChangeCode={(code) => {
                        if (code) {
                            setStepsJson(code);
                        }
                    }}
                    focus={false}
                    withCard={false}
                />
            )}
        </div>
    );
}

export default ToggleEditor;