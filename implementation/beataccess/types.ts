export type UUID = string;

export type AccessPointType =
  | "DOOR"
  | "GATE"
  | "TURNSTILE"
  | "ELEVATOR"
  | "BARRIER"
  | "FACILITY_ENTRY"
  | "BUILDING_ENTRY"
  | "UNIT_ENTRY"
  | "COMMON_AREA_ENTRY"
  | "OTHER";

export type AccessPointLifecycle =
  | "PENDING"
  | "ACTIVE"
  | "SUSPENDED"
  | "INACTIVE"
  | "RETIRED"
  | "UNKNOWN";

export type AccessOperationalState =
  | "ONLINE"
  | "OFFLINE"
  | "DEGRADED"
  | "FAULT"
  | "UNKNOWN";

export type AccessCredentialType =
  | "MOBILE"
  | "NFC"
  | "CARD"
  | "TOKEN"
  | "PIN"
  | "BIOMETRIC_REFERENCE"
  | "DEVICE"
  | "OTHER";

export type AccessOperationState =
  | "RECEIVED"
  | "VALIDATING"
  | "AUTHORIZED_FOR_EXECUTION"
  | "COMMAND_ISSUED"
  | "COMMAND_ACCEPTED"
  | "COMMAND_REJECTED"
  | "ACCESS_GRANTED"
  | "ACCESS_DENIED"
  | "TIMEOUT"
  | "UNKNOWN"
  | "CONTROLLER_UNAVAILABLE"
  | "PROVIDER_UNAVAILABLE"
  | "FAULT"
  | "RECONCILING"
  | "CANCELLED"
  | "EXPIRED"
  | "CONSUMED";

export interface AccessPoint {
  accessPointId: UUID;
  entityId: UUID;
  placeId?: UUID;
  accessPointType: AccessPointType;
  controllerProviderId?: string;
  controllerReference?: string;
  lifecycleState: AccessPointLifecycle;
  truthState: "VERIFIED" | "DECLARED" | "OBSERVED" | "INFERRED" | "PROPOSED" | "UNKNOWN";
  operationalState: AccessOperationalState;
  provenanceReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessCredential {
  accessCredentialId: UUID;
  principalEntityId: UUID;
  credentialType: AccessCredentialType;
  externalCredentialReference?: string;
  lifecycleState: "PENDING" | "ACTIVE" | "SUSPENDED" | "EXPIRED" | "REVOKED" | "CLOSED";
  providerReference?: string;
  validFrom?: string;
  validTo?: string;
  provenanceReference?: string;
}

export interface AccessOperation {
  operationId: UUID;
  requestId: UUID;
  authorizationId: UUID;
  principalEntityId: UUID;
  actionType: string;
  targetEntityId?: UUID;
  accessPointId: UUID;
  accessCredentialId?: UUID;
  operationState: AccessOperationState;
  executionDeadline?: string;
  commandId?: string;
  idempotencyKey: string;
  providerReference?: string;
  controllerReference?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccessValidationResult {
  validationId: UUID;
  operationId: UUID;
  authorizationValid: boolean;
  principalMatch: boolean;
  actionMatch: boolean;
  targetMatch: boolean;
  scopeMatch: boolean;
  credentialValid?: boolean;
  conditionsSatisfied: boolean;
  replayCheckPassed: boolean;
  executionDeadlineValid: boolean;
  result: "VALID" | "REJECTED" | "UNKNOWN";
  reasonCode?: string;
  authorizationDecisionVersion?: number;
  policyVersion?: string;
  evaluatedAt: string;
}

export interface AccessProviderResult {
  providerResultId: UUID;
  operationId: UUID;
  providerId: string;
  controllerId?: string;
  providerCommandReference?: string;
  providerState:
    | "ACCEPTED"
    | "REJECTED"
    | "GRANTED"
    | "DENIED"
    | "TIMEOUT"
    | "UNAVAILABLE"
    | "FAULT"
    | "UNKNOWN";
  providerCode?: string;
  providerMessage?: string;
  observedAt: string;
  provenanceReference?: string;
}

export interface AccessEvaluationCommand {
  requestId: UUID;
  authorizationId: UUID;
  principalEntityId: UUID;
  actionType: string;
  targetEntityId?: UUID;
  accessPointId: UUID;
  accessCredentialId?: UUID;
  idempotencyKey: string;
}

export interface AccessExecutionResult {
  operationId: UUID;
  state: AccessOperationState;
  commandId?: string;
  providerReference?: string;
  reasonCode?: string;
}

export interface AccessTimelineEvent {
  accessEventId: UUID;
  operationId: UUID;
  eventType: string;
  resultState: string;
  eventAt: string;
  providerReference?: string;
  evidenceReference?: string;
  correlationId?: UUID;
}
