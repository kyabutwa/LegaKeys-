# BeatVisitor Service Contract

## Commands

POST /beatvisitor/invitations
Create an inviter-owned invitation.

POST /beatvisitor/invitations/:id/accept
Accept an invitation. Acceptance never grants physical access.

POST /beatvisitor/invitations/:id/document-capture
Capture passport, national ID or other declared identity evidence.

POST /beatvisitor/invitations/:id/ocr-extract
Extract structured fields from captured evidence.

POST /beatvisitor/invitations/:id/identity-review
Visitor reviews/confirms/corrects extracted fields without erasing source provenance.

POST /beatvisitor/invitations/:id/face-verification
Submit approved face/liveness verification.

POST /beatvisitor/invitations/:id/biometric-enrollment
Register approved fingerprint/palm references through governed biometric infrastructure.

POST /beatvisitor/invitations/:id/device-biometric-assertion
Record a device biometric assertion/result. Never store underlying Face ID/Touch ID data.

POST /beatvisitor/invitations/:id/verify
Evaluate the invitation's declared visitor-verification policy.

POST /beatvisitor/invitations/:id/end
End/revoke an inviter-owned invitation. This blocks future visitor eligibility and re-entry.

POST /beatvisitor/invitations/:id/arrival
Record arrival and perform current authorization preflight. It does not directly unlock anything.

POST /beatvisitor/invitations/:id/departure
Record departure. Departure does not end a reusable invitation unless policy says END_ON_DEPARTURE.

POST /beatvisitor/invitations/:id/reentry
Request another entry while the invitation remains active.

## Queries

GET /beatvisitor/invitations/:id
GET /beatvisitor/invitations/:id/timeline
GET /beatvisitor/invitations/:id/verification
GET /beatvisitor/invitations/:id/access
GET /beatvisitor/invitations/:id/evidence
GET /beatvisitor/invitations/:id/status

## Invitation states

DRAFT -> SENT -> ACCEPTED -> VERIFICATION_PENDING -> VERIFIED -> ACTIVE -> ENDED/EXPIRED/REVOKED.

Verification failure is represented separately and never silently changes invitation ownership.

## Entry policy

SINGLE_ENTRY
MULTI_ENTRY
REENTRY_ALLOWED
END_ON_DEPARTURE

Every entry attempt is independently evaluated.

Re-entry requires:
invitation active
AND current time within visit window
AND visitor verification valid
AND authorization ALLOW
AND access scope contains requested access point
AND no revocation/expiry
AND BeatAccess execution validation passes.

## Ending an invitation

The end operation must:
1. verify inviter authority;
2. atomically transition invitation to ENDED/REVOKED;
3. invalidate future visitor eligibility;
4. prevent new BeatAccess operations;
5. preserve historical arrival/departure/access evidence;
6. emit an immutable lifecycle event.

Ending the invitation does not falsely claim that a visitor has physically departed.

## OCR contract

Provider response includes provider ID, evidence ID, extracted fields, confidence when supplied, extraction timestamp, provider reference, provenance and verification state.

Provider availability does not equal document authenticity.

## Biometric contract

A biometric result includes modality, mechanism/provider, visitor/invitation binding, purpose, result, timestamp, provider reference and legal-basis/consent reference where required.

Raw biometric templates are never persisted by BeatVisitor.

## Execution boundary

BeatVisitor -> Authorization -> BeatAccess -> Controller -> Access Event -> Evidence.

No BeatVisitor endpoint directly issues a lock, gate, elevator, turnstile or door command.
