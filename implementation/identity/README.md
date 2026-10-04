# LEGAKEYS — IDENTITY + ACCOUNT + PARTICIPANT IMPLEMENTATION

Status: Canonical implementation foundation.

Scope: BeatIdentity -> Account -> Participation -> Participant.

The implementation keeps identity, authentication, participation, role, and authority separate. Microsoft Entra explicitly separates authentication from authorization and scoped role assignment; Apple CloudKit separately models durable user identity and record references. citeturn0search18turn0search10turn0search0turn0search2

Canonical chain:

ENTITY -> BEATIDENTITY -> PERSON -> ACCOUNT -> CREDENTIAL/SESSION -> PARTICIPATION -> PARTICIPANT

The module owns identity, person linkage, account lifecycle, credential metadata, canonical sessions, participation, participant lifecycle, verification references, and identity audit events.

It does not own authorization grants, community governance, BeatAccess execution, payment execution, raw secrets, biometric material, or provider secrets.

Atomic onboarding:

Validate -> resolve/create Entity -> create BeatIdentity -> create Person -> create Account -> create Credential metadata -> create Participation -> create Participant -> write lifecycle event -> commit.

External authentication-provider handoff is idempotent and reconciliable; it is not falsely treated as one distributed database transaction.

Critical invariant: NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.

Creating an account, authenticating a session, or becoming a participant never grants consequential authority.
