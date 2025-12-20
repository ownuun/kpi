# State Management

이 디렉토리는 계층적 에이전트 시스템의 상태를 관리합니다.

## 디렉토리 구조

```
state/
├── tasks/                  # 작업 상태 추적
│   ├── active.json        # 현재 실행 중인 작업
│   ├── pending.json       # 대기 중인 작업
│   ├── completed.json     # 완료된 작업 (최근 7일)
│   └── failed.json        # 실패한 작업
│
├── coordination/          # 조율 및 동기화
│   ├── resource-locks.json    # 파일 잠금 상태
│   └── dependencies.json      # 작업 의존성 그래프
│
└── reports/               # 작업 보고서
    └── [YYYY-MM-DD]/
        └── [task-reports...]
```

## 파일 형식

### active.json

현재 실행 중인 작업 목록:

```json
{
  "tasks": [
    {
      "task_id": "TASK-20251217-L2-001",
      "status": "IN_PROGRESS",
      "agent": "api-developer",
      "parent_task": "TASK-20251217-L1-001",
      "started_at": "2025-12-17T10:00:00Z",
      "progress": {
        "percentage": 60,
        "current_step": "Creating API route handler",
        "steps_completed": ["Analyzed patterns", "Defined types"],
        "steps_remaining": ["Implement handler", "Add error handling"]
      },
      "resources_held": [
        "app/api/sns/posts/route.ts"
      ]
    }
  ],
  "last_updated": "2025-12-17T10:30:00Z",
  "schema_version": "1.0.0"
}
```

### resource-locks.json

파일 및 리소스 잠금 상태:

```json
{
  "locks": [
    {
      "resource": "prisma/schema.prisma",
      "locked_by": "infrastructure-lead",
      "task_id": "TASK-20251217-L3-008",
      "locked_at": "2025-12-17T10:30:00Z",
      "expires_at": "2025-12-17T11:00:00Z",
      "reason": "Adding industry field to Lead model",
      "waiting_agents": [
        {
          "agent": "api-developer",
          "task_id": "TASK-20251217-L3-009",
          "waiting_since": "2025-12-17T10:35:00Z"
        }
      ]
    }
  ],
  "last_updated": "2025-12-17T10:35:00Z",
  "schema_version": "1.0.0"
}
```

### dependencies.json

작업 의존성 그래프:

```json
{
  "dependencies": [
    {
      "task_id": "TASK-20251217-L3-012",
      "depends_on": ["TASK-20251217-L3-010", "TASK-20251217-L3-011"],
      "dependency_type": "blocking",
      "status": "waiting"
    }
  ],
  "last_updated": "2025-12-17T10:00:00Z",
  "schema_version": "1.0.0"
}
```

## 사용 방법

### 1. 작업 시작 시

```typescript
// active.json에 작업 추가
{
  "task_id": "TASK-[timestamp]-L[layer]-[seq]",
  "status": "IN_PROGRESS",
  "agent": "agent-name",
  "started_at": new Date().toISOString(),
  ...
}
```

### 2. 리소스 잠금 획득

```typescript
// resource-locks.json에 잠금 추가
{
  "resource": "file/path",
  "locked_by": "agent-name",
  "task_id": "TASK-ID",
  "locked_at": new Date().toISOString(),
  "expires_at": new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30분
  ...
}
```

### 3. 작업 완료 시

```typescript
// active.json에서 제거
// completed.json에 추가
```

## 중복 방지

작업 시작 전 확인:

1. `active.json` 확인 - 동일한 파일/작업이 진행 중인지
2. `resource-locks.json` 확인 - 필요한 리소스가 잠겨있는지
3. `dependencies.json` 확인 - 의존성이 충족되었는지

## 정리 정책

- **active.json**: 작업 완료 시 즉시 제거
- **completed.json**: 7일 후 자동 삭제
- **failed.json**: 30일 후 자동 삭제
- **resource-locks.json**: 만료 시간 도달 시 자동 해제
- **reports/**: 30일 후 자동 삭제
