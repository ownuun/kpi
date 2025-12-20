/**
 * Coordination Log System Types
 * 에이전트 간 통신 및 작업 추적을 위한 타입 정의
 */

export type AgentLevel = 1 | 2 | 3 | 4;

export type TaskPhase =
  | 'routing'      // 작업 라우팅 중
  | 'delegation'   // 하위 에이전트에게 위임 중
  | 'execution'    // 실제 작업 실행 중
  | 'verification' // 결과 검증 중
  | 'synthesis';   // 결과 종합 중

export type TaskStatus =
  | 'in_progress'  // 진행 중
  | 'completed'    // 완료
  | 'error'        // 오류 발생
  | 'blocked';     // 다른 작업에 의해 차단됨

export interface CoordinationLogEntry {
  // 에이전트 식별
  agentLevel: AgentLevel;
  agentName: string;
  parentAgent?: string;
  childrenAgents?: string[];

  // 작업 추적
  taskId: string;
  phase: TaskPhase;
  status: TaskStatus;

  // 타이밍
  timestamp: number;
  startedAt?: number;
  completedAt?: number;

  // 내용
  summary: string;
  input?: any;
  output?: any;
  error?: string;

  // 의존성
  blockedBy?: string[];
  dependsOn?: string[];
}

export interface TaskDelegation {
  taskId: string;
  fromAgent: string;
  toAgent: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: number;
}

export interface VerificationResult {
  passed: boolean;
  issues: string[];
  recommendations: string[];
}
