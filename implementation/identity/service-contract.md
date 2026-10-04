# Identity Service Contract

## Commands

POST /identity/onboard — idempotently creates or resolves identity, account, and optional contextual participation.

POST /identity/resolve — evidence-based identity resolution; name similarity alone never produces VERIFIED identity.

GET /identity/me — returns identity, person summary, account state, participant, participation, and session state without secrets.

POST /account/sessions — creates the canonical LegaKeys session after successful authentication.

POST /account/sessions/revoke — revokes a canonical session.

POST /participant — creates contextual participation when the participation itself is permitted.

## Current-user pipeline

SESSION -> ACCOUNT -> IDENTITY -> PARTICIPATION -> PARTICIPANT -> RELATIONSHIP/CONTEXT -> CAPABILITY -> AUTHORIZATION

The identity service stops before authorization.

## Stable errors

IDENTITY_NOT_FOUND, IDENTITY_AMBIGUOUS, IDENTITY_VERIFICATION_REQUIRED, ACCOUNT_NOT_FOUND, ACCOUNT_SUSPENDED, CREDENTIAL_INVALID, CREDENTIAL_REVOKED, SESSION_NOT_FOUND, SESSION_EXPIRED, SESSION_REVOKED, PARTICIPATION_NOT_FOUND, PARTICIPATION_NOT_ACTIVE, PARTICIPANT_NOT_ACTIVE, IDEMPOTENCY_CONFLICT, REQUEST_INVALID.

## Read model

ME may flatten identity + account + participant + participation + session for performance. This is a projection, not canonical storage.

## Security

Never return password hashes, bearer tokens, refresh tokens, biometric material, or provider secrets from domain reads.
