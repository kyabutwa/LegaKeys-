export type UUID = string;

export type CapabilityTruthState =
  | "VERIFIED"
  | "DECLARED"
  | "OBSERVED"
  | "INFERRED"
  | "PROPOSED"
  | "UNKNOWN";

export type CapabilityLifecycleState =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "EXPIRED"
  | "REVOKED"
  | "CLOSED";

export type CapabilityResolutionStatus =
  | "RESOLVED"
  | "PARTIAL"
  | "UNKNOWN"
  | "UNAVAILABLE"
  | "CONFLICTED"
  | "EXPIRED";

export type CapabilitySensitivity =
  | "STANDARD"
  | "SENSITIVE"
  | "HIGHLY_SENSITIVE";

export interface Capability {
  capabilityId: UUID;
  subjectEntityId: UUID;
  capabilityType: string;
  capabilityCode: string;
  displayName: string;
  description?: string;
  lifecycleState: CapabilityLifecycleState;
  truthState: CapabilityTruthState;
  sourceType: string;
  sourceReference?: string;
  provenanceReference?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  sensitivityLevel: CapabilitySensitivity;
  createdAt: string;
  updatedAt: string;
}

export interface CapabilityScope {
  capabilityScopeId: UUID;
  capabilityId: UUID;
  scopeEntityId: UUID;
  scopeType: string;
  applicabilityState: CapabilityLifecycleState;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceReference?: string;
  provenanceReference?: string;
}

export interface CapabilityCondition {
  conditionId: UUID;
  capabilityId: UUID;
  conditionType: string;
  conditionValue: Record<string, unknown>;
  truthState: CapabilityTruthState;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceReference?: string;
  provenanceReference?: string;
}

export interface CapabilityEvidence {
  capabilityEvidenceId: UUID;
  capabilityId: UUID;
  evidenceReference: string;
  evidenceType: string;
  verificationState: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED";
  issuedAt?: string;
  expiresAt?: string;
  issuerReference?: string;
  provenanceReference?: string;
}

export interface CapabilityResolution {
  status: CapabilityResolutionStatus;
  subjectEntityId: UUID;
  capabilityCode: string;
  capabilityIds: UUID[];
  applicableScopeIds: UUID[];
  conditionIds: UUID[];
  evidenceIds: UUID[];
  truthStates: CapabilityTruthState[];
  explanation: string[];
  resolvedAt: string;
}

export interface CapabilityVerificationCommand {
  capabilityId: UUID;
  evidenceReference: string;
  verifierReference: string;
  reason?: string;
  requestId?: UUID;
}

export interface CapabilityResolutionQuery {
  subjectEntityId: UUID;
  capabilityCode: string;
  contextId?: UUID;
  scopeEntityId?: UUID;
  at?: string;
}
