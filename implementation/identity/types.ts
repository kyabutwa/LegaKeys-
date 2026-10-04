export type UUID = string;
export type LifecycleState = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE' | 'RETIRED' | 'CLOSED';
export type VerificationState = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED' | 'REVOKED';
export type AccountState = 'PENDING' | 'ACTIVE' | 'LOCKED' | 'SUSPENDED' | 'CLOSED';
export type CredentialState = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'DISABLED';
export type SessionState = 'ACTIVE' | 'EXPIRED' | 'REVOKED';
export type ParticipationState = 'PROPOSED' | 'ACTIVE' | 'SUSPENDED' | 'ENDED' | 'REVOKED';

export interface Entity {
  entityId: UUID;
  entityType: string;
  canonicalName?: string;
  displayName?: string;
  lifecycleState: LifecycleState;
  effectiveFrom?: string;
  effectiveTo?: string;
  sourceReference?: string;
  provenanceReference?: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface BeatIdentity {
  identityId: UUID;
  entityId: UUID;
  identityType: string;
  state: LifecycleState;
  verificationState: VerificationState;
  provenanceReference?: UUID;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  personId: UUID;
  entityId: UUID;
  legalName?: string;
  displayName?: string;
  dateOfBirth?: string;
  countryOfResidence?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  accountId: UUID;
  identityId: UUID;
  state: AccountState;
  primaryCredentialId?: UUID;
  lastAuthenticatedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Credential {
  credentialId: UUID;
  accountId: UUID;
  credentialType: string;
  state: CredentialState;
  subjectReference?: string;
  verificationState: VerificationState;
  secretReference?: string;
  expiresAt?: string;
  revokedAt?: string;
}

export interface Session {
  sessionId: UUID;
  accountId: UUID;
  state: SessionState;
  sessionSecretReference: string;
  createdAt: string;
  lastSeenAt?: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface Participation {
  participationId: UUID;
  identityId: UUID;
  contextEntityId?: UUID;
  state: ParticipationState;
  scope: Record<string, unknown>;
  effectiveFrom?: string;
  effectiveTo?: string;
  provenanceReference?: UUID;
}

export interface Participant {
  participantId: UUID;
  participationId: UUID;
  identityId: UUID;
  state: LifecycleState;
}

export interface IdentityOnboardingCommand {
  requestId: UUID;
  idempotencyKey: string;
  identity: { entityType: 'PERSON'; legalName?: string; displayName?: string; countryOfResidence?: string };
  account: { credentialType: string; subjectReference: string; secretReference?: string };
  participation?: { contextEntityId?: UUID; scope?: Record<string, unknown> };
}

export interface IdentityOnboardingResult {
  entity: Entity;
  identity: BeatIdentity;
  person: Person;
  account: Account;
  credential: Credential;
  participation: Participation;
  participant: Participant;
  correlationId: UUID;
}

// Authentication context intentionally stops before authorization.
export interface CanonicalSessionContext {
  session: Session;
  account: Account;
  identity: BeatIdentity;
  participant: Participant;
  participation: Participation;
}
