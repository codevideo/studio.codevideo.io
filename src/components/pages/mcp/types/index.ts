export interface MCPTask {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  cancelable: boolean;
  prompt?: string;
  tool?: string;
  args?: Record<string, any>;
  progress?: {
    percentage: number;
    currentStep: string;
    details?: Record<string, any>;
  };
  result?: any;
  error?: {
    message: string;
    timestamp: string;
  };
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  taskId?: string;
  isError?: boolean;
}

export interface MCPResponse {
  taskId: string;
  status: string;
  statusUrl: string;
  message: string;
}

export interface TaskResult {
  taskId: string;
  result: any;
  completedAt: string;
}
