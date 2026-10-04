import type { Action, ActionExecution, ActionOutcome, Event, Evidence, ExecuteActionCommand, RuntimeAdapter } from "./types";

export interface AuthorizationRuntime {
  revalidate(input: { action: Action; now: string }): Promise<{
    decision: "ALLOW" | "DENY" | "STEP_UP" | "PENDING" | "UNKNOWN" | "UNAVAILABLE";
    reason?: string;
  }>;
}

export interface ActionRuntimeStore {
  transaction<T>(work: (tx: ActionRuntimeStore) => Promise<T>): Promise<T>;
  getActionForUpdate(actionId: string): Promise<Action | null>;
  getOutcome(actionId: string): Promise<ActionOutcome | null>;
  claimExecution(action: Action, execution: ActionExecution): Promise<void>;
  appendEvent(event: Event): Promise<void>;
  appendEvidence(evidence: Evidence): Promise<void>;
  saveExecution(execution: ActionExecution): Promise<void>;
  saveAction(action: Action): Promise<void>;
  saveOutcome(outcome: ActionOutcome): Promise<void>;
  findIdempotentAction(actionId: string, idempotencyKey: string): Promise<Action | null>;
}

export interface ActionRuntimeDependencies {
  store: ActionRuntimeStore;
  authorization: AuthorizationRuntime;
  adapter: RuntimeAdapter;
  now: () => string;
  ids: {
    execution(): string;
    event(): string;
    evidence(): string;
    outcome(): string;
  };
}

export class ActionRuntimeError extends Error {
  constructor(
    public readonly code:
      | "NOT_FOUND" | "IDEMPOTENCY_CONFLICT" | "AUTHORIZATION_DENIED"
      | "AUTHORIZATION_UNAVAILABLE" | "EXPIRED" | "INVALID_STATE",
    message: string,
  ) { super(message); }
}

/**
 * Production boundary:
 * 1) short transaction claims the single execution slot;
 * 2) authorization is revalidated inside that boundary;
 * 3) the external adapter runs OUTSIDE the DB transaction;
 * 4) a second short transaction durably records execution, events, evidence and outcome.
 *
 * This avoids holding database locks across slow provider/controller calls while
 * still preventing concurrent consequential execution.
 */
export async function executeAction(
  deps: ActionRuntimeDependencies,
  command: ExecuteActionCommand,
): Promise<ActionOutcome> {
  const claimed = await deps.store.transaction(async (tx) => {
    const action = await tx.getActionForUpdate(command.actionId);
    if (!action) throw new ActionRuntimeError("NOT_FOUND", "Action does not exist.");
    if (action.idempotencyKey !== command.idempotencyKey) {
      throw new ActionRuntimeError("IDEMPOTENCY_CONFLICT", "Idempotency key does not match the action.");
    }

    const existingOutcome = await tx.getOutcome(action.id);
    if (existingOutcome && ["SUCCEEDED","FAILED","CANCELLED","EXPIRED","REVOKED"].includes(action.state)) {
      return { action, execution: null as ActionExecution | null, outcome: existingOutcome };
    }
    if (action.state === "EXECUTING") {
      throw new ActionRuntimeError("INVALID_STATE", "Action is already executing.");
    }

    const now = deps.now();
    if (action.executionDeadline && new Date(now).getTime() > new Date(action.executionDeadline).getTime()) {
      action.state = "EXPIRED";
      action.updatedAt = now;
      await tx.saveAction(action);
      throw new ActionRuntimeError("EXPIRED", "Execution deadline has expired.");
    }

    const decision = await deps.authorization.revalidate({ action, now });
    if (decision.decision !== "ALLOW") {
      action.state = decision.decision === "DENY" ? "REVOKED" : "UNKNOWN";
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

    await tx.claimExecution(action, execution);
    return { action, execution, outcome: null as ActionOutcome | null };
  });

  if (claimed.outcome) return claimed.outcome;
  if (!claimed.execution) throw new ActionRuntimeError("INVALID_STATE", "Execution slot was not created.");

  const { action, execution } = claimed;

  const started: Event = {
    id: deps.ids.event(),
    actionId: action.id,
    executionId: execution.id,
    eventType: "ACTION_EXECUTION_STARTED",
    principalId: action.principalId,
    occurredAt: execution.startedAt,
    recordedAt: deps.now(),
    correlationId: action.correlationId,
    causationId: action.causationId,
    truthState: "OBSERVED",
    sourceType: "LEGAKEYS_RUNTIME",
    payload: { actionId: action.id, attempt: execution.attemptNumber },
    payloadHash: action.id,
  };

  await deps.store.transaction(async (tx) => {
    await tx.appendEvent(started);
  });

  let result: Awaited<ReturnType<RuntimeAdapter["execute"]>>;
  try {
    result = await deps.adapter.execute(action, execution);
  } catch {
    result = { status: "UNKNOWN" };
  }

  const finishedAt = deps.now();
  const executionState: ActionExecution["executionState"] =
    result.status === "COMPLETED" ? "COMPLETED" :
    result.status === "ACCEPTED" ? "ACCEPTED" :
    result.status === "FAILED" ? "FAILED" : "UNKNOWN";

  execution.executionState = executionState;
  execution.finishedAt = finishedAt;
  execution.responseReference = result.responseReference;
  execution.responseHash = result.responseHash;

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
    truthState: result.status === "COMPLETED" ? "OBSERVED" : "UNKNOWN",
    sourceType: "RUNTIME_ADAPTER",
    sourceReference: result.responseReference,
    payload: result.eventPayload ?? { status: result.status },
    payloadHash: result.responseHash,
  };

  const evidence: Evidence[] = (result.evidence ?? []).map((item) => ({
    ...item,
    id: deps.ids.evidence(),
    actionId: action.id,
    eventId: event.id,
    receivedAt: finishedAt,
  }));

  const outcome: ActionOutcome = {
    id: deps.ids.outcome(),
    actionId: action.id,
    requestedResult: { actionType: action.actionType, targetId: action.targetId },
    observedResult: { adapterStatus: result.status, responseReference: result.responseReference },
    normalizedResult: { status: result.status },
    state: result.status === "COMPLETED" ? "COMPLETED" :
      result.status === "FAILED" ? "FAILED" : "UNKNOWN",
    truthState: result.status === "COMPLETED" ? "OBSERVED" : "UNKNOWN",
    evidenceSufficient: result.status === "COMPLETED" && (evidence.length > 0),
    reconciliationState: result.status === "UNKNOWN" ? "PENDING" : "NOT_REQUIRED",
    createdAt: finishedAt,
    updatedAt: finishedAt,
  };

  await deps.store.transaction(async (tx) => {
    await tx.saveExecution(execution);
    await tx.appendEvent(event);
    for (const item of evidence) await tx.appendEvidence(item);

    action.state =
      result.status === "COMPLETED" ? "SUCCEEDED" :
      result.status === "FAILED" ? "FAILED" : "UNKNOWN";
    action.updatedAt = finishedAt;
    if (result.status === "COMPLETED" || result.status === "FAILED") action.completedAt = finishedAt;
    await tx.saveAction(action);
    await tx.saveOutcome(outcome);
  });

  return outcome;
}
