import * as React from 'react';
import { useState } from 'react';
import { Box, Flex, Card, Tabs, Text } from '@radix-ui/themes';
import { MCPChatInterface } from './MCPChatInterface';
import { ExamplePrompts } from './examples/ExamplePrompts';
import { TaskHistory } from './history/TaskHistory';
import { MCPTask } from './types';

export interface IMCPPageProps {
}

export function MCPPage (props: IMCPPageProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedTask, setSelectedTask] = useState<MCPTask | null>(null);

  const handleSelectPrompt = (prompt: string) => {
    setSelectedPrompt(prompt);
    setActiveTab('chat');
  };

  const handleSelectTask = (task: MCPTask) => {
    setSelectedTask(task);
    // Could switch to a task detail view or load the task context
  };

  return (
    <Box p="4">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="chat">Chat Interface</Tabs.Trigger>
          <Tabs.Trigger value="examples">Examples & Help</Tabs.Trigger>
          <Tabs.Trigger value="history">Task History</Tabs.Trigger>
        </Tabs.List>

        <Box pt="4">
          <Tabs.Content value="chat">
            <MCPChatInterface initialPrompt={selectedPrompt} />
          </Tabs.Content>
          
          <Tabs.Content value="examples">
            <Card>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="2">
                  <Text size="4" weight="bold" color="mint">
                    Get Started with CodeVideo MCP
                  </Text>
                  <Text size="2" color="gray">
                    Click on any example below to automatically start a chat with that prompt, or use them as inspiration for your own requests.
                  </Text>
                </Flex>
                <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
              </Flex>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="history">
            <Card>
              <Flex direction="column" gap="4">
                <Flex direction="column" gap="2">
                  <Text size="4" weight="bold" color="mint">
                    Task History
                  </Text>
                  <Text size="2" color="gray">
                    View and manage your previous MCP tasks. Click on a task to see its details.
                  </Text>
                </Flex>
                <TaskHistory onSelectTask={handleSelectTask} />
                
                {selectedTask && (
                  <Card variant="surface">
                    <Flex direction="column" gap="2">
                      <Text size="3" weight="bold">
                        Selected Task Details
                      </Text>
                      <Text size="2">
                        <strong>ID:</strong> {selectedTask.taskId}
                      </Text>
                      <Text size="2">
                        <strong>Status:</strong> {selectedTask.status}
                      </Text>
                      <Text size="2">
                        <strong>Created:</strong> {new Date(selectedTask.createdAt).toLocaleString()}
                      </Text>
                      {selectedTask.prompt && (
                        <Text size="2">
                          <strong>Prompt:</strong> {selectedTask.prompt}
                        </Text>
                      )}
                      {selectedTask.tool && (
                        <Text size="2">
                          <strong>Tool:</strong> {selectedTask.tool}
                        </Text>
                      )}
                    </Flex>
                  </Card>
                )}
              </Flex>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
