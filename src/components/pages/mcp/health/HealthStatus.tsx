import * as React from 'react';
import { useEffect, useState } from 'react';
import { Box, Card, Flex, Text, Badge, Button } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, ReloadIcon } from '@radix-ui/react-icons';
import { MCPApiService } from '../services/MCPApiService';

export interface IHealthStatusProps {}

interface HealthData {
  status: string;
  timestamp: string;
  mcpServerReady: boolean;
}

export function HealthStatus(props: IHealthStatusProps) {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const healthData = await MCPApiService.getHealth();
      setHealth(healthData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check health');
      setHealth(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  const getStatusColor = () => {
    if (error) return 'red';
    if (!health) return 'gray';
    return health.status === 'healthy' && health.mcpServerReady ? 'mint' : 'amber';
  };

  const getStatusIcon = () => {
    if (error || !health) return <CrossCircledIcon />;
    return health.status === 'healthy' && health.mcpServerReady ? 
      <CheckCircledIcon /> : <CrossCircledIcon />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (!health) return 'Unknown';
    if (health.status === 'healthy' && health.mcpServerReady) return 'Healthy & Ready';
    if (health.status === 'healthy') return 'Server Healthy (MCP Not Ready)';
    return 'Server Issues';
  };

  return (
    <Card variant="surface" size="1">
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <Text size="2" weight="bold">
            Server Status
          </Text>
          <Button
            size="1"
            variant="ghost"
            onClick={checkHealth}
            disabled={isLoading}
          >
            <ReloadIcon />
          </Button>
        </Flex>

        <Flex align="center" gap="2">
          <Badge color={getStatusColor()} variant="soft">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </Flex>

        {error && (
          <Text size="1" color="red">
            {error}
          </Text>
        )}

        {health && (
          <Box>
            <Text size="1" color="gray">
              Last checked: {new Date(health.timestamp).toLocaleTimeString()}
            </Text>
          </Box>
        )}
      </Flex>
    </Card>
  );
}
