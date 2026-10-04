export type UUID = string;

export type AuthorizationDecision =
  | "ALLOW"
  | "DENY"
  | "STEP_UP"
  | "PENDING"
  | "UNKNOWN"
  | "UNAVAILABLE";

export type AuthorizationRequestState =
  | "RECEIVED"
  | "EVALUATING"
  | "DECIDED"
  | "EXPIRED"
  | "REVOKED"
  | "CONSUMED";

export type ScopeEvaluation =
  | "MATCH"
  | "NO_MATCH"
  | "UNKNOWN";

export type ConditionEvaluation =
  | "SATISFIED"
  | "FAILED"
  | "UNKNOWN"
  | "NOT_APPLICABLE";

export type AuthorizationReasonType =
  | "MATCH"
  | "MISSING"
  | "FAILED"
  | "CONFLICT"
  | "EXPIRED"
  | "REVOKED"
  | "STEP_UP"
  | "SYSTEM";

export interface AuthorizationRequest {
  authorizationId: UUID;
  requestId: UUID;
  principalEntityId: UUID;
  actionType: string;
  targetEntityId?: UUID;
  contextId?: UUID;
  capabilityId?: UUID;
  authorityId?: UUID;
  requestedResourceId?: UUID;
  requestedServiceId?: UUID;
  requestPurpose?: string;
  requestState: AuthorizationRequestState;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizationDecisionRecord {
  decisionId: UUID;
  authorizationId: UUID;
  decisionVersion: number;
  decision: AuthorizationDecision;
  policyVersion?: string;
  effectiveFrom: string;
  expiresAt?: string;
  evaluatedAt: string;
  decisionProvenance?: string;
}

export interface AuthorizationScope {
  scopeId: UUID;
  authorizationId: UUID;
  scopeEntityId: UUID;
  scopeType: string;
  evaluationResult: ScopeEvaluation;
}

export interface AuthorizationCondition {
  conditionId: UUID;
  authorizationId: UUID;
  conditionType: string;
  expectedValue?: string;
  observedValue?: string;
  evaluationResult: ConditionEvaluation;
  source?: string;
  provenanceReference?: string;
  evaluatedAt: string;
}

export interface AuthorizationReason {
  reasonId: UUID;
  decisionId: UUID;
  reasonCode: string;
  reasonType: AuthorizationReasonType;
  detail?: string;
  visibility: "STANDARD" | "RESTRICTED" | "SENSITIVE";
}

export interface AuthorizationEvidence {
  evidenceId: UUID;
  authorizationId: UUID;
  evidenceReference: string;
  evidenceType: string;
  truthState:
    | "VERIFIED"
    | "DECLARED"
    | "OBSERVED"
    | "INFERRED"
    | "PROPOSED"
    | "UNKNOWN";
  source?: string;
  provenanceReference?: string;
  validFrom?: string;
  validTo?: string;
}

export interface AuthorizationEvaluationCommand {
  requestId: UUID;
  principalEntityId: UUID;
  actionType: string;
  targetEntityId?: UUID;
  contextId?: UUID;
  requestedResourceId?: UUID;
  requestedServiceId?: UUID;
  requestPurpose?: string;
  idempotencyKey: string;
}

export interface AuthorizationResolution {
  authorization: AuthorizationRequest;
  decision: AuthorizationDecisionRecord;
  reasons: AuthorizationReason[];
  scopes: AuthorizationScope[];
  conditions: AuthorizationCondition[];
}

export interface ExecutionGateCommand {
  authorizationId: UUID;
  requestId: UUID;
  actionId: UUID;
  principalEntityId: UUID;
  targetEntityId?: UUID;
  actionType: string;
  idempotencyKey: string;
}

export interface ExecutionGateResult {
  status: "ALLOWED_TO_EXECUTE" | "REJECTED";
  authorizationId: UUID;
  actionId: UUID;
  reasonCode?: string;
}
