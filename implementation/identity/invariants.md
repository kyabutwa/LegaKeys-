# Identity + Account + Participant Invariants

1. Entity, Identity, Person, Account and Participant IDs are immutable.
2. Identity != Account.
3. Account != Participant.
4. Participant != Role.
5. Role != Authority.
6. Authentication != Authorization.
7. Participation is contextual.
8. One identity may have multiple participation contexts.
9. Participation does not create authority.
10. Community membership does not imply system-wide authority.
11. Workspace membership does not imply authority.
12. Credential secrets remain outside ordinary domain records.
13. Biometric material remains outside ordinary domain records.
14. Revoked credentials cannot authenticate.
15. Expired or revoked sessions cannot authenticate.
16. Onboarding and session creation are auditable and idempotent.
17. Identity resolution is evidence-based.
18. Name similarity never proves legal identity.
19. Merge and split operations preserve history.
20. Current projections never overwrite historical events.
21. UNKNOWN and UNVERIFIED remain representable.
22. External provider state never silently becomes LegaKeys authorization.
23. AI cannot promote an identity to authorized state.
24. NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
