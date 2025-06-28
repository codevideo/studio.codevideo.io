import { useState, useCallback } from 'react';
import { ChatMessage, MCPTask } from '../types';
import { MCPApiService } from '../services/MCPApiService';
import { usePolling } from './usePolling';

export function useMCPChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to CodeVideo MCP Chat! You can create courses, lessons, and videos using natural language prompts or direct tool calls.',
      timestamp: new Date(),
    }
  ]);
  const [currentTask, setCurrentTask] = useState<MCPTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { startPolling, stopPolling } = usePolling();

  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const startTaskPolling = useCallback((taskId: string) => {
    startPolling(`task-${taskId}`, async () => {
      try {
        const task = await MCPApiService.getTaskStatus(taskId);
        setCurrentTask(task);

        if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
          stopPolling(`task-${taskId}`);

          if (task.status === 'completed') {
            try {
              const result = await MCPApiService.getTaskResult(taskId);
              addMessage({
                type: 'assistant',
                content: `Task completed successfully! Result: ${JSON.stringify(result.result, null, 2)}`,
                taskId,
              });
            } catch (error) {
              addMessage({
                type: 'assistant',
                content: 'Task completed, but failed to retrieve result.',
                taskId,
                isError: true,
              });
            }
          } else if (task.status === 'failed') {
            addMessage({
              type: 'assistant',
              content: `Task failed: ${task.error?.message || 'Unknown error'}`,
              taskId,
              isError: true,
            });
          } else if (task.status === 'cancelled') {
            addMessage({
              type: 'assistant',
              content: 'Task was cancelled.',
              taskId,
            });
          }
        }
      } catch (error) {
        console.error('Error polling task status:', error);
        stopPolling(`task-${taskId}`);
        addMessage({
          type: 'assistant',
          content: 'Error polling task status. Please check manually.',
          isError: true,
        });
      }
    }, 2000);
  }, [startPolling, stopPolling, addMessage]);

  const sendMessage = useCallback(async (content: string) => {
    if (isLoading) return;

    // Add user message
    addMessage({
      type: 'user',
      content,
    });

    setIsLoading(true);

    try {
      // Submit task to MCP API
      const response = await MCPApiService.submitTask({ prompt: content });
      
      // Add assistant acknowledgment
      addMessage({
        type: 'assistant',
        content: `Task submitted successfully! Task ID: ${response.taskId}. Status: ${response.status}`,
        taskId: response.taskId,
      });

      // Start polling for task status
      startTaskPolling(response.taskId);

    } catch (error) {
      addMessage({
        type: 'assistant',
        content: `Error submitting task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, startTaskPolling]);

  const sendToolCall = useCallback(async (tool: string, args: Record<string, any>) => {
    if (isLoading) return;

    // Add user message showing the tool call
    addMessage({
      type: 'user',
      content: `Tool call: ${tool}\nArguments: ${JSON.stringify(args, null, 2)}`,
    });

    setIsLoading(true);

    try {
      // Submit tool call to MCP API
      const response = await MCPApiService.submitTask({ tool, args });
      
      // Add assistant acknowledgment
      addMessage({
        type: 'assistant',
        content: `Tool call submitted successfully! Task ID: ${response.taskId}. Status: ${response.status}`,
        taskId: response.taskId,
      });

      // Start polling for task status
      startTaskPolling(response.taskId);

    } catch (error) {
      addMessage({
        type: 'assistant',
        content: `Error submitting tool call: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, addMessage, startTaskPolling]);

  const cancelTask = useCallback(async () => {
    if (!currentTask?.taskId || !currentTask.cancelable) return;

    try {
      await MCPApiService.cancelTask(currentTask.taskId);
      addMessage({
        type: 'assistant',
        content: 'Task cancellation requested.',
        taskId: currentTask.taskId,
      });
      stopPolling(`task-${currentTask.taskId}`);
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: `Error cancelling task: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isError: true,
      });
    }
  }, [currentTask, addMessage, stopPolling]);

  const pollTaskStatus = useCallback(async () => {
    if (!currentTask?.taskId) return;

    try {
      const task = await MCPApiService.getTaskStatus(currentTask.taskId);
      setCurrentTask(task);
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: `Error refreshing task status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isError: true,
      });
    }
  }, [currentTask, addMessage]);

  return {
    messages,
    currentTask,
    isLoading,
    sendMessage,
    sendToolCall,
    cancelTask,
    pollTaskStatus,
  };
}
