# AUTHORITY INVARIANTS

1. Stable authority identifier.
2. Explicit principal.
3. Explicit source.
4. Source type alone never proves authority.
5. Explicit resource/place scope.
6. Explicit action scope.
7. Authority is not identity.
8. Authority is not account status.
9. Authority is not participation.
10. Authority is not role membership.
11. Authority is not capability.
12. Authority is not authorization.
13. Authority is not BeatAccess.
14. Authority never executes actions.
15. Authority never silently transfers ownership.
16. Context can qualify resolution but cannot create authority.
17. Capability can inform evaluation but cannot create authority.
18. Relationship cannot create authority.
19. Subscription cannot create authority.
20. Workspace membership cannot create authority.
21. Truth state is explicit.
22. UNKNOWN is representable.
23. UNAVAILABLE is distinct from FALSE.
24. CONFLICTED is not permission.
25. Evidence and provenance are retained.
26. Temporal validity is explicit.
27. Expired authority remains historically queryable.
28. Suspended/revoked authority cannot resolve as active.
29. Delegation is explicit and bounded.
30. Delegate scope cannot exceed parent scope.
31. Delegate action scope cannot exceed parent action scope.
32. Delegate validity cannot exceed parent validity.
33. Delegation preserves lineage.
34. Delegation cannot bypass mandatory policy constraints.
35. Policy version is explicit.
36. Separation-of-duties constraints are enforceable.
37. Legal/mandatory constraints cannot be silently overridden.
38. External governance state is never fabricated.
39. AI and Digital Twin outputs do not create authoritative authority.
40. UI visibility does not create authority.
41. Resolution is explainable.
42. Create/update is idempotent where required.
43. Conflicting sources remain explicit.
44. Sensitive authority data follows privacy/scope.
45. Authority does not imply capability.
46. Authority does not imply provider availability.
47. Authority does not imply authorization.
48. Consequential execution requires separate authorization.
49. No Authority endpoint executes consequential actions.
50. **NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.**
