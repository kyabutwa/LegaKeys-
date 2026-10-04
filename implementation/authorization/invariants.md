# AUTHORIZATION INVARIANTS

1. Every authorization evaluation has a stable authorization ID.
2. Every authorization request has a stable request ID.
3. Every consequential request identifies a principal.
4. Every consequential request identifies an action.
5. Every consequential request identifies a target when applicable.
6. Authorization is distinct from authentication.
7. Authorization is distinct from identity.
8. Authorization is distinct from participation.
9. Authorization is distinct from role.
10. Authorization is distinct from capability.
11. Authorization is distinct from authority.
12. Context informs authorization but does not grant it.
13. Authority informs authorization but does not itself execute an action.
14. Capability informs authorization but does not grant authorization.
15. Policy is explicit and versioned.
16. Scope is explicit.
17. Conditions are explicit.
18. Required evidence is explicit.
19. Temporal validity is explicit.
20. Expired authorization cannot execute.
21. Revoked authorization cannot execute.
22. UNKNOWN cannot silently become ALLOW.
23. UNAVAILABLE cannot silently become ALLOW.
24. Missing mandatory inputs fail closed.
25. Conflicting authoritative policy fails closed or escalates explicitly.
26. Delegated authorization retains delegation lineage.
27. Delegation cannot exceed delegator authority.
28. Authorization decisions are immutable historical records.
29. Re-evaluation creates a new decision version rather than rewriting history.
30. Every consequential ALLOW is bound to a concrete request.
31. Execution requires an active matching ALLOW.
32. Execution gate does not itself execute the action.
33. Authorization cannot directly open access, move money, deliver a service, or mutate consequential state.
34. Provider availability does not prove authorization.
35. Digital Twin state does not prove authorization.
36. GENESIS cannot grant authorization.
37. CONSTANTYNA cannot grant authorization.
38. UI state cannot grant authorization.
39. Subscription cannot grant authorization.
40. Relationship cannot silently grant authorization.
41. Location cannot silently grant authorization.
42. Community membership cannot silently grant authorization.
43. Every decision retains policy provenance.
44. Every decision retains decision reasons subject to visibility.
45. Sensitive evidence is access-controlled.
46. Authorization scope cannot expand through client-controlled fields.
47. Idempotency prevents duplicate consequential permission issuance.
48. One-time authorizations cannot be reused where policy forbids reuse.
49. Authorization expiry and revocation are observable and auditable.
50. Correlation/request/action identifiers remain traceable across execution.
51. Historical authorization evidence is retained according to governance policy.
52. Authorization resolution is deterministic for identical authoritative inputs.
53. External integration failure remains explicit.
54. No fabricated provider or policy state is permitted.
55. Cross-scope authorization is explicit.
56. Emergency authorization remains bounded, logged, and policy-controlled.
57. Dual-control requirements cannot be bypassed by one actor.
58. Step-up requirements cannot be bypassed by the client.
59. Authorization is never inferred solely from UI visibility.
60. NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
