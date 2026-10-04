export type UUID = string;
export type TruthState = "VERIFIED"|"DECLARED"|"OBSERVED"|"INFERRED"|"PROPOSED"|"UNKNOWN";
export type GenesisMode = "OBSERVATION_ONLY"|"ANALYSIS"|"ASSISTED"|"GOVERNED_AUTOMATION"|"DEGRADED"|"PAUSED";
export type GenesisOutputType = "ANSWER"|"GUIDANCE"|"CLASSIFICATION"|"FINDING"|"ANOMALY"|"INFERENCE"|"FORECAST"|"RECOMMENDATION"|"PROPOSAL"|"ESCALATION"|"UNKNOWN";
export type RiskLevel = "LOW"|"MODERATE"|"HIGH"|"CRITICAL";

export interface GenesisRun {
  id: UUID;
  initiatorId: UUID;
  purpose: string;
  contextId?: UUID;
  mode: GenesisMode;
  policyVersion: string;
  modelProvider: string;
  modelVersion?: string;
  correlationId: UUID;
  state: "CREATED"|"RUNNING"|"PAUSED"|"COMPLETED"|"FAILED"|"CANCELLED"|"DEGRADED";
  startedAt: string;
  completedAt?: string;
}

export interface GenesisInput {
  id: UUID;
  runId: UUID;
  sourceType: string;
  sourceReference: string;
  observedAt?: string;
  ingestedAt: string;
  truthState: TruthState;
  provenance: Record<string, unknown>;
  scope: Record<string, unknown>;
}

export interface GenesisFinding {
  id: UUID;
  runId: UUID;
  type: "FINDING"|"ANOMALY"|"INFERENCE"|"FORECAST";
  subjectType?: string;
  subjectId?: UUID;
  statement: string;
  truthState: TruthState;
  confidence?: number;
  evidenceIds: UUID[];
  explanation?: string;
  createdAt: string;
}

export interface GenesisProposal {
  id: UUID;
  runId: UUID;
  actionType: string;
  targetType: string;
  targetId: UUID;
  reason: string;
  expectedOutcome?: string;
  assumptions: string[];
  riskLevel: RiskLevel;
  requiredCapability?: UUID;
  requiredAuthority?: UUID;
  authorizationId?: UUID;
  state: "PROPOSED"|"REVIEW_REQUIRED"|"APPROVED"|"REJECTED"|"EXPIRED"|"EXECUTED";
  expiresAt?: string;
  evidenceIds: UUID[];
  createdAt: string;
}

export interface GenesisOutput {
  id: UUID;
  runId: UUID;
  type: GenesisOutputType;
  content: Record<string, unknown>;
  truthState: TruthState;
  confidence?: number;
  evidenceIds: UUID[];
  policyVersion: string;
  modelVersion?: string;
  createdAt: string;
}

export interface GenesisTool {
  id: UUID;
  version: string;
  sideEffect: "READ_ONLY"|"NON_CONSEQUENTIAL_WRITE"|"CONSEQUENTIAL";
  allowedScopes: string[];
  requiredCapability?: UUID;
  timeoutMs: number;
}

export interface GenesisRuntime {
  run(input: {
    initiatorId: UUID;
    purpose: string;
    contextId?: UUID;
    mode: GenesisMode;
    inputs: GenesisInput[];
  }): Promise<GenesisOutput[]>;
}
