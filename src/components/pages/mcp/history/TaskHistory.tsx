import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, Flex, Text, Button, Badge, ScrollArea, Code } from '@radix-ui/themes';
import { ClockIcon, ReloadIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { MCPTask } from '../types';
import { MCPApiService } from '../services/MCPApiService';

export interface ITaskHistoryProps {
  onSelectTask?: (task: MCPTask) => void;
}

export function TaskHistory(props: ITaskHistoryProps) {
  const { onSelectTask } = props;
  const [tasks, setTasks] = useState<MCPTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const loadTasks = async (pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await MCPApiService.listTasks(pageNum, 10);
      
      if (append) {
        setTasks(prev => [...prev, ...response.tasks]);
      } else {
        setTasks(response.tasks);
      }
      
      setHasMore(response.tasks.length === 10);
      setPage(pageNum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'amber';
      case 'running': return 'blue';
      case 'completed': return 'mint';
      case 'failed': return 'red';
      case 'cancelled': return 'gray';
      default: return 'gray';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTaskPreview = (task: MCPTask) => {
    if (task.prompt) {
      return task.prompt.substring(0, 100) + (task.prompt.length > 100 ? '...' : '');
    }
    if (task.tool) {
      return `Tool: ${task.tool}`;
    }
    return 'Unknown task';
  };

  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="3" weight="bold">
            Task History
          </Text>
          <Button
            size="1"
            variant="ghost"
            onClick={() => loadTasks(1)}
            disabled={isLoading}
          >
            <ReloadIcon />
            Refresh
          </Button>
        </Flex>

        {error && (
          <Card variant="surface" style={{ backgroundColor: 'var(--red-2)' }}>
            <Text size="2" color="red">
              {error}
            </Text>
          </Card>
        )}

        <ScrollArea style={{ height: '400px' }}>
          <Flex direction="column" gap="2">
            {tasks.map((task) => (
              <Card 
                key={task.taskId}
                variant="surface"
                style={{ cursor: onSelectTask ? 'pointer' : 'default' }}
                onClick={() => onSelectTask?.(task)}
              >
                <Flex direction="column" gap="2">
                  <Flex justify="between" align="center">
                    <Badge color={getStatusColor(task.status)} variant="soft" size="1">
                      {task.status}
                    </Badge>
                    <Text size="1" color="gray">
                      <ClockIcon />
                      {formatTime(task.createdAt)}
                    </Text>
                  </Flex>

                  <Text size="2" style={{ lineHeight: '1.4' }}>
                    {getTaskPreview(task)}
                  </Text>

                  <Code size="1" color="gray">
                    {task.taskId.substring(0, 8)}...
                  </Code>

                  {task.progress && (
                    <Text size="1" color="gray">
                      Progress: {task.progress.percentage}% - {task.progress.currentStep}
                    </Text>
                  )}
                </Flex>
              </Card>
            ))}

            {tasks.length === 0 && !isLoading && (
              <Text size="2" color="gray" style={{ textAlign: 'center', padding: '20px' }}>
                No tasks found
              </Text>
            )}

            {hasMore && (
              <Button
                variant="soft"
                onClick={() => loadTasks(page + 1, true)}
                disabled={isLoading}
                style={{ marginTop: '8px' }}
              >
                Load More
              </Button>
            )}
          </Flex>
        </ScrollArea>
      </Flex>
    </Card>
  );
}
