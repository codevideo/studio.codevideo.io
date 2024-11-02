import * as React from 'react';
import { useState } from 'react';
import { ActionEditor } from './ActionEditor/ActionEditor';
import { SimpleEditor } from './SimpleEditor';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setActions, setActionsString } from '../../store/editorSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

export interface IToggleEditorProps {
    tokenizerCode: string;
}

export function ToggleEditor(props: IToggleEditorProps) {
    const { tokenizerCode } = props;
    const { actionsString } = useAppSelector((state) => state.editor);
    const dispatch = useAppDispatch();
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
                    value={actionsString}
                    language="json"
                    tokenizerCode={tokenizerCode}
                    onChangeCode={(code) => {
                        if (code) {
                            dispatch(setActionsString(code));
                            try {
                                const parsedActions = JSON.parse(code);
                                if (Array.isArray(parsedActions)) {
                                    dispatch(setActions(parsedActions));
                                }
                            } catch (e) {
                                // try to fix the error
                                const fixedJson = code.replace(/\\/g, "\\\\");
                                dispatch(setActionsString(fixedJson));
                                dispatch(setActions(fixedJson));
                            }
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