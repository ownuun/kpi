/**
 * Coordination Logger
 * 에이전트 간 통신 로그를 기록하고 조회하는 시스템
 */

import fs from 'fs/promises';
import path from 'path';
import { CoordinationLogEntry, TaskDelegation } from './types';

export class CoordinationLogger {
  private logPath: string;

  constructor(logPath: string = '.claude/coordination-logs') {
    this.logPath = logPath;
  }

  /**
   * 로그 엔트리 기록
   */
  async log(entry: CoordinationLogEntry): Promise<void> {
    try {
      // 로그 디렉토리 생성
      await fs.mkdir(this.logPath, { recursive: true });

      const filename = path.join(this.logPath, `${entry.taskId}.jsonl`);
      const logLine = JSON.stringify({
        ...entry,
        timestamp: entry.timestamp || Date.now(),
      }) + '\n';

      await fs.appendFile(filename, logLine);
    } catch (error) {
      console.error('Failed to write coordination log:', error);
    }
  }

  /**
   * 특정 작업의 모든 로그 조회
   */
  async getTaskLogs(taskId: string): Promise<CoordinationLogEntry[]> {
    try {
      const filename = path.join(this.logPath, `${taskId}.jsonl`);
      const content = await fs.readFile(filename, 'utf-8');

      return content
        .split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * 특정 에이전트의 모든 로그 조회
   */
  async getAgentLogs(agentName: string): Promise<CoordinationLogEntry[]> {
    try {
      const files = await fs.readdir(this.logPath);
      const logs: CoordinationLogEntry[] = [];

      for (const file of files) {
        if (!file.endsWith('.jsonl')) continue;

        const taskId = file.replace('.jsonl', '');
        const taskLogs = await this.getTaskLogs(taskId);

        logs.push(
          ...taskLogs.filter(log => log.agentName === agentName)
        );
      }

      return logs.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Failed to get agent logs:', error);
      return [];
    }
  }

  /**
   * 작업 상태 조회
   */
  async getTaskStatus(taskId: string): Promise<{
    status: 'in_progress' | 'completed' | 'error' | 'blocked';
    lastUpdate: number;
    currentAgent?: string;
  }> {
    const logs = await this.getTaskLogs(taskId);

    if (logs.length === 0) {
      throw new Error(`Task ${taskId} not found`);
    }

    const lastLog = logs[logs.length - 1];

    return {
      status: lastLog.status,
      lastUpdate: lastLog.timestamp,
      currentAgent: lastLog.agentName,
    };
  }

  /**
   * 작업 트리 시각화 (부모-자식 관계)
   */
  async getTaskTree(taskId: string): Promise<string> {
    const logs = await this.getTaskLogs(taskId);

    const tree: Map<string, string[]> = new Map();

    logs.forEach(log => {
      if (log.parentAgent) {
        const children = tree.get(log.parentAgent) || [];
        if (!children.includes(log.agentName)) {
          children.push(log.agentName);
          tree.set(log.parentAgent, children);
        }
      }
    });

    function buildTree(agent: string, indent: number = 0): string {
      const children = tree.get(agent) || [];
      const prefix = '  '.repeat(indent);

      let result = `${prefix}└─ ${agent}\n`;

      children.forEach((child, index) => {
        result += buildTree(child, indent + 1);
      });

      return result;
    }

    // 최상위 에이전트 찾기
    const topAgent = logs.find(log => log.agentLevel === 1)?.agentName || 'unknown';

    return buildTree(topAgent);
  }

  /**
   * 로그 요약 통계
   */
  async getStats(taskId: string): Promise<{
    totalLogs: number;
    byAgent: Record<string, number>;
    byPhase: Record<string, number>;
    byStatus: Record<string, number>;
    duration: number;
  }> {
    const logs = await this.getTaskLogs(taskId);

    const byAgent: Record<string, number> = {};
    const byPhase: Record<string, number> = {};
    const byStatus: Record<string, number> = {};

    logs.forEach(log => {
      byAgent[log.agentName] = (byAgent[log.agentName] || 0) + 1;
      byPhase[log.phase] = (byPhase[log.phase] || 0) + 1;
      byStatus[log.status] = (byStatus[log.status] || 0) + 1;
    });

    const duration = logs.length > 0
      ? logs[logs.length - 1].timestamp - logs[0].timestamp
      : 0;

    return {
      totalLogs: logs.length,
      byAgent,
      byPhase,
      byStatus,
      duration,
    };
  }
}

// 전역 로거 인스턴스
export const logger = new CoordinationLogger();
