import * as React from 'react';
import { useState } from 'react';
import { Box, Card, Flex, Text, TextField, TextArea, Button, Select, Code } from '@radix-ui/themes';
import { GearIcon, PaperPlaneIcon } from '@radix-ui/react-icons';

export interface IToolCallFormProps {
  onSubmit: (tool: string, args: Record<string, any>) => void;
  disabled?: boolean;
}

const COMMON_TOOLS = [
  'create_course_with_initial_metadata',
  'create_lesson_with_metadata', 
  'make_video_from_actions',
  'generate_lesson_content',
  'create_quiz_questions'
];

export function ToolCallForm(props: IToolCallFormProps) {
  const { onSubmit, disabled = false } = props;
  const [selectedTool, setSelectedTool] = useState('');
  const [customTool, setCustomTool] = useState('');
  const [argsJson, setArgsJson] = useState('{\n  \n}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const toolName = selectedTool === 'custom' ? customTool : selectedTool;
    if (!toolName.trim()) return;

    try {
      const args = JSON.parse(argsJson);
      onSubmit(toolName, args);
      setJsonError(null);
    } catch (error) {
      setJsonError('Invalid JSON format');
    }
  };

  const handleArgsChange = (value: string) => {
    setArgsJson(value);
    setJsonError(null);
  };

  const getToolExamples = () => {
    switch (selectedTool) {
      case 'create_course_with_initial_metadata':
        return `{
  "name": "Python Data Structures",
  "description": "Learn fundamental data structures in Python",
  "primaryLanguage": "python"
}`;
      case 'make_video_from_actions':
        return `{
  "actions": [],
  "outputPath": "/tmp/video.mp4"
}`;
      default:
        return '{\n  \n}';
    }
  };

  const loadExample = () => {
    if (selectedTool && selectedTool !== 'custom') {
      setArgsJson(getToolExamples());
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap="4">
          <Flex align="center" gap="2">
            <GearIcon color="var(--blue-9)" />
            <Text size="3" weight="bold" color="blue">
              Direct Tool Call
            </Text>
          </Flex>

          <Box>
            <Text size="2" weight="bold" mb="2">
              Tool Name
            </Text>
            <Select.Root value={selectedTool} onValueChange={setSelectedTool}>
              <Select.Trigger placeholder="Select a tool..." />
              <Select.Content>
                {COMMON_TOOLS.map(tool => (
                  <Select.Item key={tool} value={tool}>
                    {tool}
                  </Select.Item>
                ))}
                <Select.Item value="custom">Custom tool...</Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          {selectedTool === 'custom' && (
            <Box>
              <Text size="2" weight="bold" mb="2">
                Custom Tool Name
              </Text>
              <TextField.Root
                value={customTool}
                onChange={(e) => setCustomTool(e.target.value)}
                placeholder="enter_custom_tool_name"
              />
            </Box>
          )}

          <Box>
            <Flex justify="between" align="center" mb="2">
              <Text size="2" weight="bold">
                Arguments (JSON)
              </Text>
              {selectedTool && selectedTool !== 'custom' && (
                <Button
                  type="button"
                  size="1"
                  variant="soft"
                  onClick={loadExample}
                >
                  Load Example
                </Button>
              )}
            </Flex>
            <TextArea
              value={argsJson}
              onChange={(e) => handleArgsChange(e.target.value)}
              placeholder="Enter JSON arguments..."
              rows={8}
              style={{ fontFamily: 'monospace' }}
            />
            {jsonError && (
              <Text size="1" color="red" mt="1">
                {jsonError}
              </Text>
            )}
          </Box>

          <Button
            type="submit"
            disabled={disabled || !selectedTool || (selectedTool === 'custom' && !customTool.trim())}
            variant="solid"
            color="blue"
          >
            <PaperPlaneIcon />
            Execute Tool Call
          </Button>

          <Card variant="surface">
            <Text size="1" color="gray">
              <strong>Tip:</strong> Direct tool calls allow you to use specific MCP tools with precise parameters. 
              This is useful for advanced users who want more control over the exact operations performed.
            </Text>
          </Card>
        </Flex>
      </form>
    </Card>
  );
}
