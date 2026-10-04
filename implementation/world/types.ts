export type UUID = string;
export type WorldTruthState = 'VERIFIED' | 'DECLARED' | 'OBSERVED' | 'INFERRED' | 'PROPOSED' | 'UNKNOWN';
export type WorldLifecycleState = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'RETIRED' | 'CLOSED';

export interface Place {
  placeId: UUID; entityId: UUID; placeType: string; parentPlaceId?: UUID;
  canonicalName: string; displayName?: string; description?: string;
  addressLine?: string; countryCode?: string; regionCode?: string; cityName?: string;
  latitude?: number; longitude?: number; locationPrecisionM?: number;
  lifecycleState: WorldLifecycleState; effectiveFrom?: string; effectiveTo?: string;
  createdAt: string; updatedAt: string;
}

export interface PhysicalEntity {
  physicalEntityId: UUID; entityId: UUID; physicalType: string; placeId?: UUID;
  lifecycleState: WorldLifecycleState; operationalState: string;
  manufacturerReference?: string; serialReference?: string;
  installedAt?: string; retiredAt?: string;
}

export interface Resource {
  resourceId: UUID; entityId: UUID; resourceType: string; placeId?: UUID;
  allocationState: string; lifecycleState: WorldLifecycleState;
  quantity?: number; unit?: string; effectiveFrom?: string; effectiveTo?: string;
}

export interface WorldRelationship {
  relationshipId: UUID; subjectEntityId: UUID; relationshipType: string;
  objectEntityId: UUID; contextEntityId?: UUID; state: string; cardinality?: string;
  effectiveFrom?: string; effectiveTo?: string; sourceReference?: string; provenanceReference?: UUID;
}

export interface WorldState {
  worldStateId: UUID; entityId: UUID; stateKey: string; stateValue: unknown;
  truthState: WorldTruthState; observedAt?: string; effectiveFrom?: string;
  effectiveTo?: string; sourceReference?: string; provenanceReference?: UUID;
}

export interface WorldObservation {
  observationId: UUID; entityId: UUID; observationType: string; observedValue: unknown;
  truthState: WorldTruthState; observedAt: string; sourceReference?: string;
  confidence?: number; provenanceReference?: UUID;
}
