import * as React from 'react';
import { useState } from 'react';
import { ActionJsonEditor } from './ActionJsonEditor/ActionJsonEditor';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { setJumpFlag } from '../../../store/editorSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import ActionGUIEditor from './ActionGUIEditor/ActionGUIEditor';
import { ActionValidationStats } from './ActionValidationStats';

export function ToggleEditor() {
    const { currentActions, jumpFlag } = useAppSelector((state) => state.editor);
    const dispatch = useAppDispatch();
    const [editorMode, setEditorMode] = useState(true);

    const onClickJumpToCurrent = () => {
        dispatch(setJumpFlag(!jumpFlag));
    }

    return (
        <div>
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
                <button
                    onClick={onClickJumpToCurrent}
                    disabled={currentActions.length === 0}
                    className="px-3 py-2 rounded-lg bg-green-700 text-green-50 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Jump to Current Action
                </button>
            </div>
            {editorMode ? (
                <ActionGUIEditor />
            ) : (
                <ActionJsonEditor />
            )}
            <ActionValidationStats editorMode={editorMode} />
        </div>
    );
}

export default ToggleEditor;