import type {
  Action,
  ActionExecution,
  ActionOutcome,
  Event,
  Evidence,
  ExecuteActionCommand,
  RuntimeAdapter,
} from "./types";

export interface AuthorizationRuntime {
  revalidate(input: {
    action: Action;
    now: string;
  }): Promise<{ decision: "ALLOW" | "DENY" | "STEP_UP" | "PENDING" | "UNKNOWN" | "UNAVAILABLE"; reason?: string }>;
}

export interface ActionRuntimeStore {
  transaction<T>(work: (tx: ActionRuntimeStore) => Promise<T>): Promise<T>;
  getActionForUpdate(actionId: string): Promise<Action | null>;
  getByIdempotency(principalId: string, idempotencyKey: string): Promise<Action | null>;
  markExecuting(action: Action, execution: ActionExecution): Promise<void>;
  appendEvent(event: Event): Promise<void>;
  appendEvidence(evidence: Evidence): Promise<void>;
  saveExecution(execution: ActionExecution): Promise<void>;
  saveAction(action: Action): Promise<void>;
  saveOutcome(outcome: ActionOutcome): Promise<void>;
}

export interface ActionRuntimeDependencies {
  store: ActionRuntimeStore;
  authorization: AuthorizationRuntime;
  adapter: RuntimeAdapter;
  now: () => string;
  ids: { action: () => string; execution: () => string; event: () => string; evidence: () => string; outcome: () => string };
}

export class ActionRuntimeError extends Error {
  constructor(
    public readonly code:
      | "NOT_FOUND"
      | "IDEMPOTENCY_CONFLICT"
      | "AUTHORIZATION_REQUIRED"
      | "AUTHORIZATION_DENIED"
      | "AUTHORIZATION_UNAVAILABLE"
      | "EXPIRED"
      | "INVALID_STATE",
    message: string,
  ) {
    super(message);
  }
}

export async function executeAction(
  deps: ActionRuntimeDependencies,
  command: ExecuteActionCommand,
): Promise<ActionOutcome> {
  return deps.store.transaction(async (tx) => {
    const action = await tx.getActionForUpdate(command.actionId);
    if (!action) throw new ActionRuntimeError("NOT_FOUND", "Action does not exist.");

    if (action.idempotencyKey !== command.idempotencyKey) {
      throw new ActionRuntimeError("IDEMPOTENCY_CONFLICT", "Idempotency key does not match the action.");
    }

    if (["SUCCEEDED", "FAILED", "CANCELLED", "EXPIRED", "REVOKED"].includes(action.state)) {
      const existing = await readExistingOutcome(tx, action.id);
      if (existing) return existing;
      throw new ActionRuntimeError("INVALID_STATE", "Action is terminal without an outcome.");
    }

    const now = deps.now();
    if (action.executionDeadline && now > action.executionDeadline) {
      action.state = "EXPIRED";
      action.updatedAt = now;
      await tx.saveAction(action);
      throw new ActionRuntimeError("EXPIRED", "Execution deadline has expired.");
    }

    const decision = await deps.authorization.revalidate({ action, now });
    if (decision.decision !== "ALLOW") {
      action.state =
        decision.decision === "DENY" ? "REVOKED" :
        decision.decision === "PENDING" ? "REQUESTED" : "UNKNOWN";
      action.updatedAt = now;
      await tx.saveAction(action);
      throw new ActionRuntimeError(
        decision.decision === "DENY" ? "AUTHORIZATION_DENIED" : "AUTHORIZATION_UNAVAILABLE",
        decision.reason ?? "Current authorization cannot establish execution.",
      );
    }

    action.state = "AUTHORIZED";
    action.executionCount += 1;
    action.updatedAt = now;

    const execution: ActionExecution = {
      id: deps.ids.execution(),
      actionId: action.id,
      attemptNumber: action.executionCount,
      executionState: "STARTED",
      startedAt: now,
    };

    await tx.markExecuting(action, execution);

    const started: Event = {
      id: deps.ids.event(),
      actionId: action.id,
      executionId: execution.id,
      eventType: "ACTION_EXECUTION_STARTED",
      principalId: action.principalId,
      occurredAt: now,
      recordedAt: now,
      correlationId: action.correlationId,
      causationId: action.causationId,
      truthState: "DECLARED",
      sourceType: "LEGAKEYS_RUNTIME",
      payload: { actionId: action.id, attempt: execution.attemptNumber },
    };
    await tx.appendEvent(started);

    const result = await deps.adapter.execute(action, execution);
    const finishedAt = deps.now();
    execution.executionState =
      result.status === "COMPLETED" ? "COMPLETED" :
      result.status === "ACCEPTED" ? "ACCEPTED" :
      result.status === "FAILED" ? "FAILED" : "UNKNOWN";
    execution.finishedAt = finishedAt;
    execution.responseReference = result.responseReference;
    execution.responseHash = result.responseHash;

    await tx.saveExecution(execution);

    const event: Event = {
      id: deps.ids.event(),
      actionId: action.id,
      executionId: execution.id,
      eventType: "ACTION_EXECUTION_RESULT",
      principalId: action.principalId,
      occurredAt: finishedAt,
      recordedAt: finishedAt,
      correlationId: action.correlationId,
      causationId: started.id,
      truthState: result.status === "COMPLETED" ? "OBSERVED" : "DECLARED",
      sourceType: "RUNTIME_ADAPTER",
      sourceReference: result.responseReference,
      payload: result.eventPayload ?? { status: result.status },
      payloadHash: result.responseHash,
    };
    await tx.appendEvent(event);

    for (const item of result.evidence ?? []) {
      await tx.appendEvidence({
        ...item,
        id: deps.ids.evidence(),
        actionId: action.id,
        eventId: event.id,
        receivedAt: finishedAt,
      });
    }

    const terminal = result.status === "COMPLETED" || result.status === "FAILED";
    action.state = result.status === "COMPLETED" ? "SUCCEEDED" :
      result.status === "FAILED" ? "FAILED" : "UNKNOWN";
    action.updatedAt = finishedAt;
    if (terminal) action.completedAt = finishedAt;
    await tx.saveAction(action);

    const outcome: ActionOutcome = {
      id: deps.ids.outcome(),
      actionId: action.id,
      requestedResult: { actionType: action.actionType, targetId: action.targetId },
      observedResult: { adapterStatus: result.status, responseReference: result.responseReference },
      normalizedResult: { status: action.state },
      state: result.status === "COMPLETED" ? "COMPLETED" :
        result.status === "FAILED" ? "FAILED" : "UNKNOWN",
      truthState: result.status === "COMPLETED" ? "OBSERVED" : "UNKNOWN",
      evidenceSufficient: result.status === "COMPLETED" && (result.evidence?.length ?? 0) > 0,
      reconciliationState: result.status === "UNKNOWN" ? "PENDING" : "NOT_REQUIRED",
      createdAt: finishedAt,
      updatedAt: finishedAt,
    };
    await tx.saveOutcome(outcome);
    return outcome;
  });
}

async function readExistingOutcome(store: ActionRuntimeStore, actionId: string): Promise<ActionOutcome | null> {
  // Implementations should resolve the unique persisted outcome by action_id.
  // Kept explicit in the contract so replay never re-executes a consequential operation.
  return null;
}
