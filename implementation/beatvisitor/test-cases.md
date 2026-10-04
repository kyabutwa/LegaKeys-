# BeatVisitor Verification Matrix

## Invitation lifecycle
BV-001 inviter creates invitation
BV-002 invitation has explicit owner
BV-003 visitor accepts invitation
BV-004 acceptance does not grant access
BV-005 invitation scope is explicit
BV-006 invitation window is enforced
BV-007 inviter can end invitation
BV-008 unauthorized actor cannot end invitation
BV-009 ended invitation cannot reopen
BV-010 expired invitation cannot reactivate
BV-011 lifecycle history retained
BV-012 duplicate create idempotent
BV-013 concurrent end/reentry race fails closed
BV-014 end atomically invalidates eligibility
BV-015 visitor cannot extend invitation

## Identity document
BV-016 passport capture creates evidence
BV-017 national ID capture creates evidence
BV-018 unsupported document rejected
BV-019 document provenance retained
BV-020 expired document not verified
BV-021 invalid document result explicit
BV-022 document evidence is not authorization
BV-023 visitor reviews OCR
BV-024 correction does not erase original evidence
BV-025 unknown document status remains unknown

## OCR
BV-026 OCR extracts supported fields
BV-027 each field has provenance
BV-028 confidence preserved
BV-029 OCR provider failure explicit
BV-030 OCR remains unverified until validation
BV-031 OCR cannot create authorization
BV-032 OCR cannot replace identity proofing

## Face and biometrics
BV-033 face/liveness result can be recorded
BV-034 face result binds to invitation
BV-035 face failure explicit
BV-036 device Face ID success creates assertion only
BV-037 raw Face ID data never stored
BV-038 fingerprint provider result explicit
BV-039 raw fingerprint template never stored
BV-040 palm provider result explicit
BV-041 raw palm template never stored
BV-042 biometric unavailable explicit
BV-043 biometric lockout explicit
BV-044 biometric success does not grant authority
BV-045 biometric result cannot revive revoked invitation

## Verification
BV-046 complete verification activates eligible visitor
BV-047 failed verification blocks activation
BV-048 pending remains pending
BV-049 unknown remains unknown
BV-050 assurance retained
BV-051 verification evidence auditable
BV-052 verified visitor bound to invitation
BV-053 substitute visitor rejected

## Authorization and BeatAccess
BV-054 active invitation does not equal authorization
BV-055 every consequential access attempt references authorization
BV-056 authorization principal matches visitor
BV-057 target matches destination
BV-058 scope contains access point
BV-059 authorization time is valid
BV-060 revoked authorization blocks access
BV-061 BeatVisitor never directly commands a lock
BV-062 failed authorization produces no access command
BV-063 BeatAccess remains final execution gate
BV-064 provider availability cannot substitute authorization

## Arrival, exit and re-entry
BV-065 active invitation permits arrival evaluation
BV-066 successful arrival recorded
BV-067 departure recorded separately
BV-068 MULTI_ENTRY allows later re-entry
BV-069 REENTRY_ALLOWED allows later re-entry
BV-070 re-entry creates new access operation
BV-071 each re-entry rechecks authorization
BV-072 each re-entry rechecks time window
BV-073 each re-entry rechecks scope
BV-074 SINGLE_ENTRY prevents second entry
BV-075 END_ON_DEPARTURE ends eligibility
BV-076 inviter ending invitation blocks re-entry
BV-077 expiry blocks re-entry
BV-078 invitation end does not falsely imply physical departure
BV-079 failed re-entry auditable

## Security, privacy and truth
BV-080 no raw biometric templates in BeatVisitor tables
BV-081 no fabricated provider
BV-082 no fabricated OCR
BV-083 no fabricated document verification
BV-084 unknown remains unknown
BV-085 sensitive evidence is scope controlled
BV-086 retention policy explicit
BV-087 evidence access governed
BV-088 AI cannot approve visitor access
BV-089 Digital Twin cannot approve visitor access
BV-090 UI cannot bypass authorization

## Reliability
BV-091 idempotency survives retry
BV-092 duplicate access request cannot duplicate physical command
BV-093 provider timeout is not success
BV-094 command accepted is not physical access granted
BV-095 denied remains denied
BV-096 reconciliation preserves history
BV-097 concurrent re-entry cannot double-consume single entry
BV-098 inviter end is atomic against new access issuance
BV-099 lifecycle correlation survives end-to-end
BV-100 NO AUTHORIZATION -> NO ACCESS COMMAND

## Release gate

BeatVisitor is GREEN only if all 100 cases pass and:
1. inviter-controlled termination is authoritative;
2. reusable invitations support re-entry only after fresh authorization;
3. identity/OCR/biometrics never become authorization by themselves;
4. raw biometric material remains outside ordinary LegaKeys persistence;
5. BeatAccess remains the physical execution boundary;
6. UNKNOWN is never silently promoted to VERIFIED or GRANTED;
7. lifecycle and physical access evidence remain auditable.
