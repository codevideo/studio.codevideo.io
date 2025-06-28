import * as React from 'react';
import { Box, Card, Flex, Text, Button, Badge, Progress, Separator, Code } from '@radix-ui/themes';
import { ReloadIcon, Cross2Icon, PlayIcon, StopIcon } from '@radix-ui/react-icons';
import { MCPTask } from '../types';

export interface ITaskStatusPanelProps {
  task: MCPTask | null;
  onCancel: () => void;
  onRefresh: () => void;
}

export function TaskStatusPanel(props: ITaskStatusPanelProps) {
  const { task, onCancel, onRefresh } = props;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'amber';
      case 'running':
        return 'blue';
      case 'completed':
        return 'mint';
      case 'failed':
        return 'red';
      case 'cancelled':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <PlayIcon />;
      case 'completed':
      case 'failed':
      case 'cancelled':
        return <StopIcon />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!task) {
    return (
      <Card>
        <Flex direction="column" gap="3">
          <Text size="3" weight="bold">
            Task Status
          </Text>
          <Text size="2" color="gray">
            No active task
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="3">
        {/* Header */}
        <Flex justify="between" align="center">
          <Text size="3" weight="bold">
            Task Status
          </Text>
          <Button
            size="1"
            variant="ghost"
            onClick={onRefresh}
          >
            <ReloadIcon />
          </Button>
        </Flex>

        <Separator size="4" />

        {/* Task ID */}
        <Box>
          <Text size="1" color="gray" weight="bold">
            Task ID
          </Text>
          <Code size="1" color="mint">
            {task.taskId}
          </Code>
        </Box>

        {/* Status */}
        <Box>
          <Text size="1" color="gray" weight="bold">
            Status
          </Text>
          <Flex align="center" gap="2" mt="1">
            <Badge color={getStatusColor(task.status)} variant="soft">
              {getStatusIcon(task.status)}
              {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
            </Badge>
          </Flex>
        </Box>

        {/* Progress */}
        {task.progress && (
          <Box>
            <Text size="1" color="gray" weight="bold">
              Progress
            </Text>
            <Box mt="2">
              <Progress value={task.progress.percentage} size="2" />
              <Text size="1" color="gray" mt="1">
                {task.progress.percentage}% - {task.progress.currentStep}
              </Text>
            </Box>
          </Box>
        )}

        {/* Timing */}
        <Box>
          <Text size="1" color="gray" weight="bold">
            Created
          </Text>
          <Text size="1">
            {formatDate(task.createdAt)}
          </Text>
        </Box>

        <Box>
          <Text size="1" color="gray" weight="bold">
            Updated
          </Text>
          <Text size="1">
            {formatDate(task.updatedAt)}
          </Text>
        </Box>

        {/* Error */}
        {task.error && (
          <Box>
            <Text size="1" color="red" weight="bold">
              Error
            </Text>
            <Card variant="surface" style={{ backgroundColor: 'var(--red-2)' }}>
              <Text size="1" color="red">
                {task.error.message}
              </Text>
            </Card>
          </Box>
        )}

        {/* Actions */}
        {task.cancelable && task.status !== 'completed' && task.status !== 'failed' && task.status !== 'cancelled' && (
          <Box>
            <Button
              size="2"
              variant="soft"
              color="red"
              onClick={onCancel}
              style={{ width: '100%' }}
            >
              <Cross2Icon />
              Cancel Task
            </Button>
          </Box>
        )}
      </Flex>
    </Card>
  );
}
