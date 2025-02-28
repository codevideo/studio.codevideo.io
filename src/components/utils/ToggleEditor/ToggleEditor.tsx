import * as React from 'react';
import { useState } from 'react';
import { 
  Box, 
  Flex, 
  Button, 
  Text,
  Select
} from '@radix-ui/themes';
import { ActionJsonEditor } from './ActionJsonEditor/ActionJsonEditor';
import ActionGUIEditor from './ActionGUIEditor/ActionGUIEditor';
import { ActionValidationStats } from './ActionValidationStats';

export function ToggleEditor() {
    const [editorMode, setEditorMode] = useState("editor");

    return (
        <Box>
            <Flex gap="2" mb="2" align="center" justify="center">
                <Select.Root 
                    value={editorMode} 
                    onValueChange={(value) => setEditorMode(value)}
                >
                    <Select.Trigger />
                    <Select.Content>
                        <Select.Item value="editor">GUI Editor</Select.Item>
                        <Select.Item value="json">JSON Editor</Select.Item>
                    </Select.Content>
                </Select.Root>
            </Flex>
            
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