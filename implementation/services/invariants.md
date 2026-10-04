# LegaKeys Services Invariants

1. Every Beat service has a stable LegaKeys service ID.
2. LegaKeys owns the canonical Beat service definition.
3. Provider ownership never replaces LegaKeys service ownership.
4. Participant ownership never replaces LegaKeys service ownership.
5. Community governance never transfers service ownership.
6. A service can exist without a provider.
7. Provider connection is explicit.
8. Provider connection does not create service identity.
9. Provider availability is not service availability.
10. Service capability is distinct from provider capability.
11. Service definition is distinct from offering.
12. Offering is distinct from request.
13. Request is distinct from authorization.
14. Authorization is distinct from execution.
15. Execution is distinct from outcome.
16. Outcome is distinct from provider response.
17. Every service version is immutable after publication.
18. Service lifecycle is explicit.
19. Service truth state is explicit.
20. UNKNOWN is never silently converted to AVAILABLE.
21. Discovery does not authorize use.
22. Eligibility does not authorize consequential execution.
23. Capability does not authorize consequential execution.
24. Community membership does not authorize service use.
25. Provider connection does not authorize service use.
26. Participant cannot manufacture a provider connection.
27. Provider cannot expand LegaKeys authorization scope.
28. Provider cannot rewrite service history.
29. Provider failures remain explicit.
30. Provider timeout is not success.
31. Service request has idempotency.
32. Consequential execution has an execution deadline.
33. Duplicate requests cannot create duplicate consequential execution.
34. Current Authorization is required immediately before consequential execution.
35. Failed authorization produces no consequential command.
36. Service adapters cannot bypass Authorization.
37. AI cannot authorize a service.
38. Digital Twin cannot authorize a service.
39. UI cannot authorize a service.
40. Service availability cannot substitute Authorization.
41. Service area does not create authority.
42. Place containment does not create authority.
43. Service history is append-oriented.
44. Outcome evidence is preserved.
45. Reconciliation cannot rewrite original events.
46. External provider state has provenance.
47. Native LegaKeys execution is distinguished from provider fulfillment.
48. Provider credentials are isolated from service data.
49. Sensitive payment/identity/biometric secrets are not stored in generic service tables.
50. Cross-service calls retain correlation IDs.
51. Service dependencies are explicit.
52. Service version changes preserve lineage.
53. Retired services cannot accept new requests unless explicitly allowed by policy.
54. Suspended services fail closed for consequential execution.
55. Degraded services expose degraded state rather than false availability.
56. A provider can be disconnected without deleting service history.
57. Service availability is temporal.
58. Service area is temporal.
59. Eligibility is temporal and contextual.
60. Pricing/fees are explicit and versioned where applicable.
61. Consent requirements are explicit where applicable.
62. Regulatory requirements are explicit where applicable.
63. A provider response cannot become LegaKeys truth without declared mapping.
64. Provider substitution is explicit and auditable.
65. No fabricated provider.
66. No fabricated service.
67. No fabricated availability.
68. No fabricated outcome.
69. Every consequential service action creates an event/evidence chain.
70. NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.
