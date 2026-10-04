export type UUID = string;

export type TruthState =
  | "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED"
  | "PROPOSED" | "UNKNOWN" | "CONFLICTING" | "STALE";

export type ConstantynaRunState =
  | "RECEIVED" | "UNDERSTANDING" | "CONTEXTUALIZING" | "RESPONDING"
  | "AWAITING_CLARIFICATION" | "ESCALATED" | "COMPLETED"
  | "DEGRADED" | "CANCELLED";

export type ResponseType =
  | "ANSWER" | "GUIDANCE" | "CLARIFICATION" | "EXPLANATION"
  | "SUMMARY" | "RECOMMENDATION" | "PROPOSAL" | "ESCALATION"
  | "REFUSAL" | "UNKNOWN";

export type MemoryType =
  | "SESSION" | "TASK" | "PREFERENCE" | "FACT" | "EPISODIC" | "SYSTEM";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ConstantynaRun {
  id: UUID;
  actorId: UUID;
  sessionId?: UUID;
  purpose: string;
  inputRef: UUID;
  contextRefs: UUID[];
  dataScope: string;
  policyProfile: string;
  modelRef: string;
  state: ConstantynaRunState;
  startedAt: string;
  completedAt?: string;
  correlationId: UUID;
}

export interface HumanInput {
  id: UUID;
  actorId: UUID;
  conversationId?: UUID;
  content: string;
  language?: string;
  receivedAt: string;
  source: "USER" | "SYSTEM" | "INTEGRATION";
  provenance: UUID[];
}

export interface IntentInterpretation {
  label: string;
  evidenceRefs: UUID[];
  confidence: number;
  ambiguity: "LOW" | "MEDIUM" | "HIGH" | "UNKNOWN";
  alternatives: string[];
  clarificationRequired: boolean;
  truthState: TruthState;
}

export interface NeedInterpretation {
  label: string;
  source: "EXPLICIT" | "INFERRED";
  evidenceRefs: UUID[];
  confidence: number;
  truthState: TruthState;
}

export interface ContextSnapshot {
  id: UUID;
  actorId: UUID;
  placeRefs: UUID[];
  timeWindow: { start: string; end?: string };
  relationshipRefs: UUID[];
  capabilityRefs: UUID[];
  authorityRefs: UUID[];
  serviceRefs: UUID[];
  environmentRefs: UUID[];
  eventRefs: UUID[];
  sourceRefs: UUID[];
  assumptions: string[];
  uncertainties: string[];
  generatedAt: string;
}

export interface ConstantynaResponse {
  id: UUID;
  runId: UUID;
  type: ResponseType;
  content: string;
  truthState: TruthState;
  evidenceRefs: UUID[];
  uncertainty?: string[];
  nextStep?: string;
  requiresHumanReview: boolean;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface MemoryRecord {
  id: UUID;
  ownerActorId: UUID;
  type: MemoryType;
  content: string;
  sourceRefs: UUID[];
  truthState: TruthState;
  scope: string;
  retentionUntil?: string;
  revokedAt?: string;
  createdAt: string;
}

export interface HumanHandoff {
  id: UUID;
  runId: UUID;
  reason: string;
  riskLevel: RiskLevel;
  contextRefs: UUID[];
  evidenceRefs: UUID[];
  proposedNextStep?: string;
  requiredRole?: string;
  createdAt: string;
}

export interface ConstantynaRuntime {
  understand(input: HumanInput): Promise<IntentInterpretation>;
  contextualize(actorId: UUID, contextRefs: UUID[]): Promise<ContextSnapshot>;
  respond(runId: UUID): Promise<ConstantynaResponse>;
  requestClarification(runId: UUID, question: string): Promise<ConstantynaResponse>;
  escalate(runId: UUID, reason: string, riskLevel: RiskLevel): Promise<HumanHandoff>;
  writeMemory(record: MemoryRecord): Promise<MemoryRecord>;
}
