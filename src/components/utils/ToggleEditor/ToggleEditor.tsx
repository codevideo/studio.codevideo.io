import * as React from 'react';
import {
    Box
} from '@radix-ui/themes';
import { ActionJsonEditor } from './ActionJsonEditor/ActionJsonEditor';
import ActionGUIEditor from './ActionGUIEditor/ActionGUIEditor';
import { ActionValidationStats } from './ActionValidationStats';

export interface IToggleEditorProps {
    editorMode: string;
}

export function ToggleEditor(props: IToggleEditorProps) {
    const { editorMode } = props;

    return (
        <Box>
            {editorMode === "editor" ? (
                <ActionGUIEditor />
            ) : (
                <ActionJsonEditor />
            )}

            <ActionValidationStats editorMode={editorMode === "editor"} />
        </Box>
    );
}

export default ToggleEditor;