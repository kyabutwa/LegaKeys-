export type UUID = string;

export type AuthorityTruthState = "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED" | "PROPOSED" | "UNKNOWN";
export type AuthorityLifecycleState = "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REVOKED" | "CLOSED";
export type AuthorityResolutionStatus = "RESOLVED" | "PARTIAL" | "UNKNOWN" | "UNAVAILABLE" | "CONFLICTED" | "EXPIRED" | "REVOKED" | "DENIED";
export type AuthoritySensitivity = "STANDARD" | "SENSITIVE" | "HIGHLY_SENSITIVE";

export interface AuthoritySource {
  authoritySourceId: UUID;
  sourceType: string;
  sourceReference: string;
  issuingEntityId?: UUID;
  title?: string;
  description?: string;
  truthState: AuthorityTruthState;
  provenanceReference?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  lifecycleState: AuthorityLifecycleState;
  createdAt: string;
  updatedAt: string;
}

export interface Authority {
  authorityId: UUID;
  principalEntityId: UUID;
  authoritySourceId: UUID;
  authorityType: string;
  authorityCode: string;
  lifecycleState: AuthorityLifecycleState;
  truthState: AuthorityTruthState;
  policyVersion?: string;
  provenanceReference?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  sensitivityLevel: AuthoritySensitivity;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorityScope {
  authorityScopeId: UUID;
  authorityId: UUID;
  scopeEntityId: UUID;
  scopeType: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface AuthorityAction {
  authorityActionId: UUID;
  authorityId: UUID;
  actionClass: string;
  decisionType: string;
  constraints?: Record<string, unknown>;
}

export interface AuthorityCondition {
  conditionId: UUID;
  authorityId: UUID;
  conditionType: string;
  conditionValue: Record<string, unknown>;
  truthState: AuthorityTruthState;
  effectiveFrom?: string;
  effectiveTo?: string;
  provenanceReference?: string;
}

export interface AuthorityEvidence {
  authorityEvidenceId: UUID;
  authorityId: UUID;
  evidenceReference: string;
  evidenceType: string;
  verificationState: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
  issuerReference?: string;
  issuedAt?: string;
  expiresAt?: string;
  provenanceReference?: string;
}

export interface AuthorityDelegation {
  delegationId: UUID;
  parentAuthorityId: UUID;
  delegateeEntityId: UUID;
  delegatedAuthorityId?: UUID;
  scopeConstraints: Record<string, unknown>;
  actionConstraints: Record<string, unknown>;
  conditions?: Record<string, unknown>;
  policyVersion?: string;
  truthState: AuthorityTruthState;
  lifecycleState: AuthorityLifecycleState;
  effectiveFrom?: string;
  effectiveTo?: string;
  provenanceReference?: string;
}

export interface AuthorityResolution {
  status: AuthorityResolutionStatus;
  principalEntityId: UUID;
  requestedActionClass: string;
  contextId?: UUID;
  authorityIds: UUID[];
  delegationIds: UUID[];
  applicableScopeIds: UUID[];
  evidenceIds: UUID[];
  policyVersions: string[];
  explanation: string[];
  resolvedAt: string;
}

export interface AuthorityResolutionQuery {
  principalEntityId: UUID;
  requestedActionClass: string;
  contextId?: UUID;
  scopeEntityId?: UUID;
  at?: string;
}

export interface AuthorityDelegationCommand {
  authorityId: UUID;
  delegateeEntityId: UUID;
  scopeConstraints: Record<string, unknown>;
  actionConstraints: Record<string, unknown>;
  conditions?: Record<string, unknown>;
  effectiveFrom?: string;
  effectiveTo?: string;
  requestId?: UUID;
}
