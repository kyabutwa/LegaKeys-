export type UUID = string;

export type TruthState =
  | "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED" | "PROPOSED" | "UNKNOWN";

export type TwinLifecycle = "PROPOSED" | "ACTIVE" | "DEGRADED" | "SUSPENDED" | "RETIRED";
export type TwinStateStatus = "CURRENT" | "STALE" | "EXPIRED" | "UNKNOWN" | "CONFLICTED";

export type TwinNodeKind =
  | "ENTITY" | "PERSON" | "PARTICIPANT" | "PLACE" | "PHYSICAL_ENTITY"
  | "RESOURCE" | "DEVICE" | "SERVICE" | "ORGANIZATION" | "PROCESS" | "OTHER";

export type RelationshipKind =
  | "CONTAINS" | "LOCATED_IN" | "PART_OF" | "ASSOCIATED_WITH" | "SERVES"
  | "CONNECTED_TO" | "DEPENDS_ON" | "OBSERVED_BY" | "OPERATED_BY" | "OWNED_BY" | "OTHER";

export interface Provenance {
  sourceRef: UUID;
  sourceType: string;
  sourceVersion?: string;
  method?: string;
  observedAt?: string;
  acquiredAt?: string;
  receivedAt: string;
  correlationId: UUID;
  transformationRefs?: UUID[];
}

export interface Twin {
  id: UUID;
  subjectRef: UUID;
  modelRef: UUID;
  modelVersion: string;
  lifecycle: TwinLifecycle;
  scopeRef: UUID;
  truthState: TruthState;
  createdAt: string;
  updatedAt: string;
}

export interface TwinProperty {
  id: UUID;
  twinId: UUID;
  path: string;
  value: unknown;
  unit?: string;
  truthState: TruthState;
  status: TwinStateStatus;
  effectiveAt: string;
  observedAt?: string;
  expiresAt?: string;
  sourceRef: UUID;
  evidenceRefs: UUID[];
  quality?: number;
  provenance: Provenance;
}

export interface TwinObservation {
  id: UUID;
  twinId?: UUID;
  subjectRef: UUID;
  sourceRef: UUID;
  observedAt: string;
  receivedAt: string;
  payload: unknown;
  truthState: TruthState;
  quality?: number;
  provenance: Provenance;
  quarantined: boolean;
  correlationId: UUID;
}

export interface TwinRelationship {
  id: UUID;
  sourceTwinId: UUID;
  targetTwinId: UUID;
  kind: RelationshipKind;
  truthState: TruthState;
  validFrom?: string;
  validUntil?: string;
  provenance: Provenance;
}

export interface TwinTransition {
  id: UUID;
  twinId: UUID;
  propertyPath?: string;
  priorValue?: unknown;
  nextValue?: unknown;
  priorStatus?: TwinStateStatus;
  nextStatus: TwinStateStatus;
  effectiveAt: string;
  recordedAt: string;
  eventRef?: UUID;
  evidenceRefs: UUID[];
  reason?: string;
  provenance: Provenance;
}

export interface TwinScenario {
  id: UUID;
  twinId: UUID;
  baseStateAt: string;
  assumptions: Record<string, unknown>;
  modelRef: UUID;
  modelVersion: string;
  output: unknown;
  truthState: "PROPOSED" | "UNKNOWN";
  createdAt: string;
  validUntil?: string;
}

export interface DigitalTwinRuntime {
  registerTwin(input: Omit<Twin, "createdAt" | "updatedAt">): Promise<Twin>;
  ingestObservation(input: TwinObservation): Promise<TwinObservation>;
  applyProperty(input: TwinProperty): Promise<TwinProperty>;
  upsertRelationship(input: TwinRelationship): Promise<TwinRelationship>;
  recordTransition(input: TwinTransition): Promise<TwinTransition>;
  reconcile(twinId: UUID, sourceRefs: UUID[]): Promise<{
    status: "RECONCILED" | "CONFLICTED" | "UNKNOWN";
    conflicts: UUID[];
  }>;
  getTwin(twinId: UUID): Promise<Twin>;
  getHistory(twinId: UUID): Promise<TwinTransition[]>;
  getProvenance(twinId: UUID, propertyPath?: string): Promise<Provenance[]>;
}
