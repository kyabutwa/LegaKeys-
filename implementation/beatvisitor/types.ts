export type UUID = string;

export type VisitorInvitationState =
  | "DRAFT" | "SENT" | "ACCEPTED" | "VERIFICATION_PENDING"
  | "VERIFIED" | "ACTIVE" | "ENDED" | "EXPIRED" | "REVOKED";

export type VisitorEntryPolicy =
  | "SINGLE_ENTRY" | "MULTI_ENTRY" | "REENTRY_ALLOWED" | "END_ON_DEPARTURE";

export type VisitorEvidenceType = "PASSPORT" | "NATIONAL_ID" | "OTHER_ID";

export type VisitorVerificationType =
  | "DOCUMENT" | "OCR" | "FACE_LIVENESS" | "FINGERPRINT"
  | "PALM" | "DEVICE_BIOMETRIC" | "IDENTITY_MATCH" | "MANUAL_REVIEW";

export type VisitorVerificationResult =
  | "VERIFIED" | "FAILED" | "DENIED" | "PENDING"
  | "UNKNOWN" | "UNAVAILABLE" | "EXPIRED";

export type VisitorAccessAttemptType = "ARRIVAL" | "REENTRY" | "DEPARTURE";

export interface VisitorInvitation {
  invitationId: UUID;
  inviterEntityId: UUID;
  visitorEntityId?: UUID;
  visitorContactRef?: string;
  destinationPlaceId?: UUID;
  state: VisitorInvitationState;
  entryPolicy: VisitorEntryPolicy;
  verificationPolicy: string;
  accessScope: Record<string, unknown>;
  purpose?: string;
  validFrom: string;
  validUntil: string;
  endedAt?: string;
  endedByEntityId?: UUID;
}

export interface VisitorIdentityEvidence {
  evidenceId: UUID;
  invitationId: UUID;
  evidenceType: VisitorEvidenceType;
  storageReference?: string;
  documentNumberRef?: string;
  issuer?: string;
  documentValidFrom?: string;
  documentValidUntil?: string;
  captureMethod: "CAMERA" | "SCANNER" | "NFC" | "PROVIDER";
  truthState: "DECLARED" | "OBSERVED" | "VERIFIED" | "UNKNOWN" | "REJECTED";
  providerId?: string;
  providerReference?: string;
}

export interface VisitorOcrExtraction {
  extractionId: UUID;
  evidenceId: UUID;
  fieldName: string;
  fieldValue?: string;
  confidence?: number;
  extractionState: "EXTRACTED" | "REVIEWED" | "VERIFIED" | "REJECTED" | "UNKNOWN";
  providerId?: string;
  providerReference?: string;
}

export interface VisitorVerification {
  verificationId: UUID;
  invitationId: UUID;
  verificationType: VisitorVerificationType;
  modality?: "FACE" | "FINGERPRINT" | "PALM" | "DEVICE_BIOMETRIC" | "DOCUMENT" | "OCR";
  result: VisitorVerificationResult;
  assuranceLevel?: string;
  providerId?: string;
  providerReference?: string;
  purpose: string;
  legalBasisReference?: string;
  deviceBindingRef?: string;
  occurredAt: string;
}

export interface VisitorAccessAttempt {
  attemptId: UUID;
  invitationId: UUID;
  authorizationId?: UUID;
  accessOperationId?: UUID;
  attemptType: VisitorAccessAttemptType;
  result: "PENDING" | "ALLOWED" | "DENIED" | "UNKNOWN" | "FAILED";
  attemptedAt: string;
  correlationId: string;
  idempotencyKey: string;
}

export interface EndInvitationCommand {
  invitationId: UUID;
  actorEntityId: UUID;
  reason?: string;
  idempotencyKey: string;
}

export interface VisitorReentryCommand {
  invitationId: UUID;
  visitorEntityId: UUID;
  accessPointId: UUID;
  authorizationId: UUID;
  idempotencyKey: string;
}
