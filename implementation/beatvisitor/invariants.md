# BeatVisitor Invariants

## Invitation ownership
1. Every invitation has one explicit inviter owner.
2. Ownership is not inferred from location.
3. Creation does not grant physical access.
4. Only inviter or explicitly authorized governance actor may end an invitation.
5. Visitor cannot extend another principal's invitation.
6. Ended invitation cannot silently reopen.
7. Expired invitation cannot reactivate.
8. Scope is explicit.
9. Time window is explicit.
10. Lifecycle history is immutable.

## Identity evidence
11. Passport/national ID is evidence, not authorization.
12. OCR is not automatically verified.
13. Extracted fields retain provenance.
14. Review cannot erase original evidence provenance.
15. Expired/invalid document cannot be silently accepted.
16. Provider failure is explicit.
17. Unknown verification remains UNKNOWN.
18. Visitor substitution is rejected.
19. Verified visitor is bound to the invitation.
20. Identity proofing never grants authority.

## Biometrics
21. Device Face ID/Touch ID is an authentication assertion, not authorization.
22. Raw device biometric data never enters LegaKeys.
23. Raw fingerprint templates are not stored in ordinary BeatVisitor tables.
24. Raw palm templates are not stored in ordinary BeatVisitor tables.
25. Biometric capture has declared purpose and lawful policy.
26. Result is bound to intended visitor.
27. Biometric failure is explicit.
28. Biometric unavailable is explicit.
29. Biometric lockout is explicit.
30. Biometric result cannot revive a revoked invitation.

## Authorization
31. Verification is not Authorization.
32. Invitation acceptance is not Authorization.
33. Active invitation is not Authorization.
34. Visitor membership is not Authorization.
35. Credential possession is not Authorization.
36. Every re-entry requires fresh authorization evaluation.
37. Access scope is checked every time.
38. Time window is checked every time.
39. Authorization is checked immediately before consequential BeatAccess execution.
40. NO AUTHORIZATION -> NO ACCESS COMMAND.

## Re-entry
41. MULTI_ENTRY permits repeated entry while active.
42. REENTRY_ALLOWED permits repeated entry while active.
43. Departure does not consume reusable invitations.
44. SINGLE_ENTRY prevents later entry after consumption.
45. END_ON_DEPARTURE ends eligibility after departure.
46. Inviter termination blocks future re-entry.
47. Expiry blocks future re-entry.
48. Physical departure is not inferred from invitation termination.
49. Re-entry cannot restore ended invitations.
50. Re-entry cannot expand scope.

## Truth and privacy
51. No biometric data is fabricated.
52. No OCR result is fabricated.
53. No provider connection is invented.
54. Provider success is not automatically LegaKeys truth.
55. UNKNOWN remains UNKNOWN.
56. Audit history is append-oriented.
57. Sensitive evidence is scope-controlled.
58. Identity document retention follows explicit policy.
59. Identity evidence access is governed.
60. AI cannot approve visitor access.

## Operational safety
61. Invitation creation is idempotent.
62. Document capture is safely deduplicated.
63. Duplicate access requests cannot duplicate physical commands.
64. Invitation termination is atomic with eligibility invalidation.
65. Concurrent end/re-entry races fail closed.
66. Offline/degraded state cannot silently expand access.
67. Provider timeout is not success.
68. Command accepted is not physical access granted.
69. Physical result is recorded as evidence.
70. Future modules cannot weaken these invariants.
