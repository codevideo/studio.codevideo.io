import * as React from 'react';
import { useState } from 'react';
import { Flex, TextField, Button, TextArea } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';

export interface IChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput(props: IChatInputProps) {
  const { onSend, disabled = false } = props;
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="2" align="end" mt="3">
        <TextArea
          placeholder="Ask me to create a course, lesson, or video... (e.g., 'Create a Python course about data structures with 5 lessons')"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={3}
          style={{ flex: 1, resize: 'vertical', minHeight: '80px' }}
        />
        <Button
          type="submit"
          disabled={disabled || !message.trim()}
          variant="solid"
          color="mint"
          size="3"
        >
          <PaperPlaneIcon />
          Send
        </Button>
      </Flex>
    </form>
  );
}
