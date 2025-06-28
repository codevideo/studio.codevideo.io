import * as React from 'react';
import { useState } from 'react';
import { Box, Flex, Card, Heading, Separator, Button, Tabs } from '@radix-ui/themes';
import { LightningBoltIcon, EyeOpenIcon, EyeClosedIcon, GearIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import { ChatInput } from './chat/ChatInput';
import { ChatMessages } from './chat/ChatMessages';
import { TaskStatusPanel } from './task/TaskStatusPanel';
import { ExamplePrompts } from './examples/ExamplePrompts';
import { HealthStatus } from './health/HealthStatus';
import { ToolCallForm } from './tools/ToolCallForm';
import { useMCPChat } from './hooks/useMCPChat';

export interface IMCPChatInterfaceProps {
  initialPrompt?: string;
}

export function MCPChatInterface(props: IMCPChatInterfaceProps) {
  const { initialPrompt } = props;
  const [showExamples, setShowExamples] = useState(false);
  
  const {
    messages,
    currentTask,
    isLoading,
    sendMessage,
    sendToolCall,
    cancelTask,
    pollTaskStatus
  } = useMCPChat();

  const handleSelectPrompt = (prompt: string) => {
    sendMessage(prompt);
    setShowExamples(false);
  };

  // Send initial prompt if provided
  React.useEffect(() => {
    if (initialPrompt && messages.length <= 1) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, sendMessage, messages.length]);

  return (
    <Box p="4">
      <Card size="4">
        <Flex direction="column" gap="4" style={{ height: '85vh' }}>
          {/* Header */}
          <Flex direction="column" gap="2">
            <Flex justify="between" align="center">
              <Heading size="6" color="mint">
                CodeVideo MCP Chat
              </Heading>
              <Flex gap="2">
                <HealthStatus />
                <Button
                  size="2"
                  variant="soft"
                  color="mint"
                  onClick={() => setShowExamples(!showExamples)}
                >
                  <LightningBoltIcon />
                  {showExamples ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  {showExamples ? 'Hide' : 'Show'} Examples
                </Button>
              </Flex>
            </Flex>
            <Separator size="4" />
          </Flex>

          {/* Examples Panel (collapsible) */}
          {showExamples && (
            <Card variant="surface">
              <ExamplePrompts onSelectPrompt={handleSelectPrompt} />
            </Card>
          )}

          {/* Main Content */}
          <Flex gap="4" style={{ flex: 1, overflow: 'hidden' }}>
            {/* Chat Area */}
            <Box style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
              <Tabs.Root defaultValue="chat">
                <Tabs.List>
                  <Tabs.Trigger value="chat">
                    <ChatBubbleIcon />
                    {' '}Chat
                  </Tabs.Trigger>
                  <Tabs.Trigger value="tools">
                    <GearIcon />
                    {' '}Tool Calls
                  </Tabs.Trigger>
                </Tabs.List>

                <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <Tabs.Content value="chat" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <ChatMessages 
                      messages={messages} 
                      isLoading={isLoading}
                    />
                    <ChatInput 
                      onSend={sendMessage}
                      disabled={isLoading}
                    />
                  </Tabs.Content>
                  
                  <Tabs.Content value="tools" style={{ overflow: 'auto' }}>
                    <Box p="3">
                      <ToolCallForm 
                        onSubmit={sendToolCall}
                        disabled={isLoading}
                      />
                    </Box>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            </Box>

            {/* Task Status Panel */}
            <Box style={{ flex: 1 }}>
              <TaskStatusPanel 
                task={currentTask}
                onCancel={cancelTask}
                onRefresh={pollTaskStatus}
              />
            </Box>
          </Flex>
        </Flex>
      </Card>
    </Box>
  );
}
