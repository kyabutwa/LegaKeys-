export type UUID = string;
export type TruthState = "VERIFIED"|"DECLARED"|"OBSERVED"|"INFERRED"|"PROPOSED"|"UNKNOWN";
export type ActionState = "REQUESTED"|"VALIDATING"|"AUTHORIZED"|"EXECUTING"|"SUCCEEDED"|"FAILED"|"UNKNOWN"|"CANCELLED"|"EXPIRED"|"REVOKED";
export type ExecutionState = "STARTED"|"ACCEPTED"|"COMPLETED"|"FAILED"|"UNKNOWN"|"CANCELLED"|"TIMED_OUT";
export type OutcomeState = "PENDING"|"COMPLETED"|"FAILED"|"UNKNOWN"|"DEGRADED"|"CANCELLED";

export interface Action {
  id: UUID; actionType: string; principalId: UUID; authorizationId: UUID;
  capabilityId?: UUID; contextId?: UUID; targetType: string; targetId: UUID;
  purpose?: string; parameters: Record<string, unknown>; state: ActionState;
  truthState: TruthState; idempotencyKey: string; executionDeadline?: string;
  correlationId: UUID; causationId?: UUID; executionCount: number;
  createdAt: string; updatedAt: string; completedAt?: string;
}

export interface ActionExecution {
  id: UUID; actionId: UUID; attemptNumber: number; executionState: ExecutionState;
  adapterType?: string; adapterReference?: string; startedAt: string; finishedAt?: string;
  responseReference?: string; responseHash?: string; errorCode?: string;
}

export interface Event {
  id: UUID;
  eventSource: string;
  eventVersion: string;
  eventType: string;
  actionId?: UUID;
  executionId?: UUID;
  actorId?: UUID;
  principalId?: UUID;
  subjectType?: string;
  subjectId?: UUID;
  occurredAt: string;
  recordedAt: string;
  sequence?: number;
  correlationId: UUID;
  causationId?: UUID;
  truthState: TruthState;
  sourceType: string;
  sourceReference?: string;
  payload: Record<string, unknown>;
  payloadHash?: string;
  previousEventHash?: string;
}

export interface Evidence {
  id: UUID; actionId?: UUID; eventId?: UUID; evidenceType: string;
  truthState: TruthState; sourceType: string; sourceReference?: string;
  capturedAt?: string; receivedAt: string; contentReference?: string;
  contentHash?: string; provenance: Record<string, unknown>;
  integrity: Record<string, unknown>; retentionClass?: string; protectedPayload: boolean;
}

export interface ActionOutcome {
  id: UUID; actionId: UUID; requestedResult: Record<string, unknown>;
  observedResult: Record<string, unknown>; normalizedResult: Record<string, unknown>;
  state: OutcomeState; truthState: TruthState; evidenceSufficient: boolean;
  reconciliationState: "NOT_REQUIRED"|"PENDING"|"RECONCILED";
  createdAt: string; updatedAt: string;
}

export interface ExecuteActionCommand { actionId: UUID; idempotencyKey: string; now: string; }

export interface ExecutionResult {
  action: Action; execution: ActionExecution; events: Event[];
  evidence: Evidence[]; outcome: ActionOutcome;
}

export interface RuntimeAdapter {
  execute(action: Action, execution: ActionExecution): Promise<{
    status: "ACCEPTED"|"COMPLETED"|"FAILED"|"UNKNOWN";
    responseReference?: string; responseHash?: string;
    eventPayload?: Record<string, unknown>;
    evidence?: Omit<Evidence, "id"|"actionId"|"eventId"|"receivedAt">[];
  }>;
}
