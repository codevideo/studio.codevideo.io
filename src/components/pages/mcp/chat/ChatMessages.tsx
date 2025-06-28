import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Box, ScrollArea, Flex, Spinner, Text } from '@radix-ui/themes';
import { ChatMessage } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';

export interface IChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatMessages(props: IChatMessagesProps) {
  const { messages, isLoading = false } = props;
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-content]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <Box style={{ flex: 1, position: 'relative' }}>
      <ScrollArea ref={scrollAreaRef} style={{ height: '100%' }}>
        <Flex direction="column" gap="3" p="3">
          {messages.map((message) => (
            <ChatMessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <Flex align="center" gap="2" justify="start" mt="2">
              <Spinner size="2" />
              <Text size="2" color="gray">
                Processing your request...
              </Text>
            </Flex>
          )}
        </Flex>
      </ScrollArea>
    </Box>
  );
}
