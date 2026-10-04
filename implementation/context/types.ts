export type UUID = string;

export type ContextTruthState =
  | 'VERIFIED'
  | 'DECLARED'
  | 'OBSERVED'
  | 'INFERRED'
  | 'PROPOSED'
  | 'UNKNOWN';

export type ContextLifecycleState =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'CLOSED';

export type ContextSensitivity =
  | 'STANDARD'
  | 'SENSITIVE'
  | 'HIGHLY_SENSITIVE';

export interface Context {
  contextId: UUID;
  contextType: string;
  actorEntityId?: UUID;
  subjectEntityId?: UUID;
  scopeEntityId?: UUID;
  purposeCode?: string;
  lifecycleState: ContextLifecycleState;
  effectiveFrom?: string;
  effectiveTo?: string;
  sensitivityLevel: ContextSensitivity;
  provenanceReference?: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface ContextReference {
  contextReferenceId: UUID;
  contextId: UUID;
  referenceType: string;
  referencedEntityId: UUID;
  relationshipType?: string;
  truthState: ContextTruthState;
  sourceReference?: string;
  provenanceReference?: UUID;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface ContextCondition {
  conditionId: UUID;
  contextId: UUID;
  conditionType: string;
  conditionValue: unknown;
  truthState: ContextTruthState;
  observedAt?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceReference?: string;
  provenanceReference?: UUID;
}

export interface ContextScopeReference {
  contextScopeRefId: UUID;
  contextId: UUID;
  scopeEntityId: UUID;
  scopeType: string;
  accessVisibility: string;
  effectiveFrom?: string;
  effectiveTo?: string;
}

export interface ContextResolution {
  contextId: UUID;
  status: 'RESOLVED' | 'PARTIAL' | 'UNKNOWN' | 'UNAVAILABLE';
  contexts: Context[];
  references: ContextReference[];
  conditions: ContextCondition[];
  scopes: ContextScopeReference[];
  evidenceReferences: UUID[];
}
