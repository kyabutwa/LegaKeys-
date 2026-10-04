export type UUID = string;

export type ServiceLifecycle =
  | "PROPOSED" | "DESIGNED" | "CONFIGURED" | "ACTIVE"
  | "DEGRADED" | "SUSPENDED" | "RETIRED";

export type ServiceTruth =
  | "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED" | "PROPOSED" | "UNKNOWN";

export type ServiceMode = "NATIVE" | "PROVIDER_DEPENDENT" | "HYBRID";

export type ServiceAvailability =
  | "AVAILABLE" | "UNAVAILABLE" | "UNKNOWN" | "DEGRADED" | "PENDING";

export type ServiceRequestState =
  | "REQUESTED" | "EVALUATING" | "AUTHORIZED" | "EXECUTING"
  | "ACCEPTED" | "COMPLETED" | "DENIED" | "PENDING" | "UNKNOWN"
  | "FAILED" | "CANCELLED" | "EXPIRED" | "REVOKED" | "DEGRADED";

export interface LegaKeysService {
  serviceId: UUID;
  beatCode: string;
  canonicalName: string;
  description?: string;
  ownerDomain: "LEGAKEYS";
  lifecycleState: ServiceLifecycle;
  truthState: ServiceTruth;
  nativeOrProviderMode: ServiceMode;
}

export interface ServiceVersion {
  serviceVersionId: UUID;
  serviceId: UUID;
  version: string;
  status: "DRAFT" | "PUBLISHED" | "DEPRECATED" | "RETIRED";
  contract: Record<string, unknown>;
}

export interface ServiceOffering {
  offeringId: UUID;
  serviceId: UUID;
  serviceVersionId?: UUID;
  name: string;
  description?: string;
  eligibility: Record<string, unknown>;
  pricing: Record<string, unknown>;
  commitments: Record<string, unknown>;
}

export interface ServiceCapability {
  serviceCapabilityId: UUID;
  serviceId: UUID;
  capabilityCode: string;
  name: string;
  description?: string;
  capabilityContract: Record<string, unknown>;
}

export interface ServiceProviderConnection {
  connectionId: UUID;
  serviceId: UUID;
  providerId: string;
  adapterId: string;
  adapterVersion: string;
  capabilityCode?: string;
  providerReference?: string;
  state: "CONNECTED" | "DEGRADED" | "UNAVAILABLE" | "SUSPENDED" | "DISCONNECTED" | "UNKNOWN";
  credentialReference?: string;
}

export interface ServiceRequest {
  requestId: UUID;
  principalEntityId: UUID;
  serviceId: UUID;
  serviceVersionId?: UUID;
  offeringId?: UUID;
  capabilityCode?: string;
  targetEntityId?: UUID;
  placeId?: UUID;
  contextId?: UUID;
  authorizationId?: UUID;
  intent: Record<string, unknown>;
  parameters: Record<string, unknown>;
  state: ServiceRequestState;
  idempotencyKey: string;
  executionDeadline?: string;
  correlationId: string;
}

export interface ServiceExecution {
  executionId: UUID;
  requestId: UUID;
  authorizationId?: UUID;
  connectionId?: UUID;
  executionState: "STARTED" | "ACCEPTED" | "COMPLETED" | "FAILED" | "TIMEOUT" | "UNKNOWN" | "CANCELLED" | "RECONCILED";
  providerCommandReference?: string;
}

export interface ServiceOutcome {
  outcomeId: UUID;
  requestId: UUID;
  executionId?: UUID;
  status: "SUCCESS" | "PARTIAL" | "FAILED" | "DENIED" | "UNKNOWN" | "CANCELLED";
  requestedResult: Record<string, unknown>;
  actualResult: Record<string, unknown>;
  providerResponseReference?: string;
  evidenceReference?: string;
}

export interface ServiceRequestCommand {
  principalEntityId: UUID;
  serviceId: UUID;
  capabilityCode?: string;
  contextId?: UUID;
  targetEntityId?: UUID;
  placeId?: UUID;
  parameters: Record<string, unknown>;
  idempotencyKey: string;
}
