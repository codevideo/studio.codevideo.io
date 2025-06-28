import { MCPTask, MCPResponse, TaskResult } from '../types';

const API_BASE_URL = process.env.GATSBY_MCP_API_URL || 'http://localhost:3000';

export class MCPApiService {
  static async submitTask(payload: { prompt?: string; tool?: string; args?: Record<string, any> }): Promise<MCPResponse> {
    const response = await fetch(`${API_BASE_URL}/codevideo-mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getTaskStatus(taskId: string): Promise<MCPTask> {
    const response = await fetch(`${API_BASE_URL}/codevideo-mcp/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getTaskResult(taskId: string): Promise<TaskResult> {
    const response = await fetch(`${API_BASE_URL}/codevideo-mcp/tasks/${taskId}/result`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async cancelTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/codevideo-mcp/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }
  }

  static async listTasks(page = 1, limit = 10, status?: string): Promise<{ tasks: MCPTask[]; total: number; page: number; limit: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      params.append('status', status);
    }

    const response = await fetch(`${API_BASE_URL}/codevideo-mcp/tasks?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getCapabilities(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/codevideo-mcp/capabilities`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  static async getHealth(): Promise<{ status: string; timestamp: string; mcpServerReady: boolean }> {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }
}
