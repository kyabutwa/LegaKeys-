# Action / Event / Evidence Runtime Invariants

1. No authorization means no consequential action.
2. Authorization is revalidated immediately before execution.
3. Action never grants authority.
4. Action identity is stable.
5. Idempotency prevents duplicate consequential execution.
6. Same idempotency key with different material parameters is rejected.
7. Action binds principal, authorization, capability, context, target and purpose.
8. Authorization mismatch is rejected.
9. Expired or revoked authorization is rejected.
10. Execution deadline is enforced.
11. Events are append-only.
12. Historical events are never rewritten.
13. occurred_at and recorded_at remain distinct.
14. Event sequence is monotonic per action where required.
15. Causation and correlation lineage are preserved.
16. Provider callbacks are observations until validated.
17. Provider response is not automatically canonical truth.
18. Evidence cannot create authority.
19. Evidence truth state is explicit.
20. Evidence provenance is mandatory.
21. Evidence integrity/reference hashes are preserved where applicable.
22. Sensitive evidence payloads are isolated.
23. UNKNOWN is not converted without new evidence.
24. Timeout without authoritative result yields UNKNOWN.
25. Duplicate callbacks are idempotent.
26. Reconciliation appends facts.
27. Outcome is derived from action/event/evidence.
28. COMPLETED requires declared completion evidence.
29. ACCEPTED is not COMPLETED.
30. Current state is a projection, not history.
31. Digital Twin cannot authorize.
32. GENESIS cannot authorize.
33. CONSTANTYNA cannot authorize.
34. UI cannot authorize.
35. Provider cannot expand action scope.
36. Compensation is a new action/event.
37. Cross-service actions preserve correlation IDs.
38. Every consequential action has an execution boundary.
39. External results are provenance-tagged.
40. Missing evidence leaves outcome UNKNOWN where completion cannot be established.
41. Authorization, action, event and evidence IDs are distinct.
42. Secrets and raw biometric material never enter generic runtime records.
43. Required audit history is not silently deleted.
44. Identical replay returns the original idempotent result.
45. Concurrency cannot create two successes for a single-use action.
46. Cancellation cannot erase recorded events.
47. Post-execution revocation does not rewrite history.
48. Time-window checks use governed server time.
49. Runtime errors do not leak sensitive data.
50. Runtime fails closed when authorization cannot be established.

Final invariant: NO AUTHORIZATION -> NO CONSEQUENTIAL ACTION.
