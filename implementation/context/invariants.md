# Context Invariants

1. Every Context has a stable Context ID.
2. Every Context has an explicit context type.
3. Context references stable World/Identity IDs.
4. Context never creates an identity implicitly.
5. Context is descriptive, not authoritative.
6. Context scope is explicit.
7. Scope does not imply authorization.
8. Place does not imply authorization.
9. Relationship does not imply authorization.
10. Role does not imply authorization.
11. Participation does not imply authorization.
12. Context type does not imply authorization.
13. Purpose does not imply authorization.
14. Capability does not become active merely because it appears in Context.
15. Authorization remains a separate first-class decision.
16. Context conditions retain truth state.
17. UNKNOWN remains representable.
18. INFERRED never silently becomes VERIFIED.
19. PROPOSED never silently becomes ACTIVE.
20. Context conditions retain provenance.
21. Context is temporally bounded or explicitly timeless by policy.
22. Expired Context is not treated as active.
23. Historical Context is retained according to governance policy.
24. Cross-scope references are explicitly validated.
25. Sensitive context follows privacy policy.
26. Context resolution is explainable through references and evidence.
27. External state is never fabricated.
28. Context creation/update is idempotent.
29. Context cannot execute consequential actions.
30. NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
