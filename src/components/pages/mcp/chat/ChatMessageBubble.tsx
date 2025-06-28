import * as React from 'react';
import { Box, Card, Text, Code, Badge, Flex } from '@radix-ui/themes';
import { PersonIcon, GearIcon, ExclamationTriangleIcon, AvatarIcon } from '@radix-ui/react-icons';
import { ChatMessage } from '../types';

export interface IChatMessageBubbleProps {
  message: ChatMessage;
}

export function ChatMessageBubble(props: IChatMessageBubbleProps) {
  const { message } = props;

  const getMessageIcon = () => {
    switch (message.type) {
      case 'user':
        return <PersonIcon />;
      case 'assistant':
        return <AvatarIcon />;
      case 'system':
        return <GearIcon />;
      default:
        return null;
    }
  };

  const getMessageColor = () => {
    if (message.isError) return 'red';
    switch (message.type) {
      case 'user':
        return 'mint';
      case 'assistant':
        return 'blue';
      case 'system':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const isUserMessage = message.type === 'user';
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Flex 
      justify={isUserMessage ? 'end' : 'start'} 
      gap="2"
      style={{ maxWidth: '100%' }}
    >
      {!isUserMessage && (
        <Box style={{ marginTop: '4px' }}>
          <Badge color={getMessageColor()} variant="soft" size="1">
            {getMessageIcon()}
          </Badge>
        </Box>
      )}
      
      <Box style={{ maxWidth: '85%' }}>
        <Card 
          variant={isUserMessage ? 'classic' : 'surface'}
          style={{
            backgroundColor: isUserMessage 
              ? 'var(--mint-3)' 
              : message.isError 
                ? 'var(--red-2)' 
                : undefined
          }}
        >
          <Flex direction="column" gap="2">
            {message.isError && (
              <Flex align="center" gap="1">
                <ExclamationTriangleIcon color="var(--red-9)" />
                <Text size="1" color="red" weight="bold">
                  Error
                </Text>
              </Flex>
            )}
            
            <Text size="2" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {message.content}
            </Text>
            
            {message.taskId && (
              <Code size="1" color="gray">
                Task: {message.taskId}
              </Code>
            )}
            
            <Text size="1" color="gray" style={{ alignSelf: isUserMessage ? 'flex-end' : 'flex-start' }}>
              {formatTime(message.timestamp)}
            </Text>
          </Flex>
        </Card>
      </Box>
      
      {isUserMessage && (
        <Box style={{ marginTop: '4px' }}>
          <Badge color={getMessageColor()} variant="soft" size="1">
            {getMessageIcon()}
          </Badge>
        </Box>
      )}
    </Flex>
  );
}
