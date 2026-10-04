# CAPABILITY INVARIANTS

1. Every capability has a stable identifier.
2. Every capability has an explicit subject.
3. Every capability has an explicit capability type.
4. Capability does not create identity.
5. Capability does not create an account.
6. Capability does not create participation.
7. Capability does not create a role.
8. Capability does not create authority.
9. Capability does not create authorization.
10. Capability does not execute actions.
11. Capability does not directly grant BeatAccess.
12. Capability scope is explicit.
13. Capability scope is not authorization.
14. Context may qualify capability applicability but cannot grant capability.
15. Relationships may explain capability relevance but cannot grant authority.
16. Truth state is always explicit.
17. UNKNOWN is representable.
18. UNAVAILABLE is distinct from FALSE.
19. INFERRED is never silently upgraded to VERIFIED.
20. DECLARED is never silently upgraded to VERIFIED.
21. PROPOSED is never silently upgraded to ACTIVE.
22. Evidence and provenance are retained.
23. Temporal validity is explicit.
24. Expired capability remains historically queryable.
25. Suspended capability cannot be treated as currently applicable.
26. Conflicting assertions are represented explicitly.
27. External provider state is never fabricated.
28. Capability resolution is explainable.
29. Capability creation/update is idempotent where required.
30. Sensitive capability data follows privacy and scope requirements.
31. AI and Digital Twin outputs do not create authoritative capability.
32. UI visibility does not create capability.
33. Team capability does not automatically become individual authority.
34. Role expectation does not prove actual capability.
35. Capability does not imply current availability.
36. Capability does not imply service-provider connectivity.
37. Capability does not imply licensing unless explicitly evidenced.
38. Capability does not imply authorization.
39. Consequential execution requires a separate authorization decision.
40. **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
