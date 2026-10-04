# LegaKeys Digital Twin — Invariants

1. Digital Twin is a derived representation, never the authority.
2. Digital Twin != World source of truth.
3. Digital Twin != Authorization.
4. Digital Twin != BeatAccess.
5. Digital Twin != Account.
6. Digital Twin != Participant.
7. Digital Twin != Capability.
8. Digital Twin != Service execution.
9. Identity references must resolve or remain explicitly unresolved.
10. Every state claim has a truth state.
11. UNKNOWN is first-class.
12. Stale data is never silently presented as current.
13. Observed != Verified.
14. Declared != Verified.
15. Inferred != Observed.
16. Proposed != Current.
17. Simulated != Real.
18. Prediction != Observation.
19. Visualization != Truth.
20. A map position does not imply authority.
21. A relationship does not imply authority.
22. Containment does not imply authority.
23. Workspace visibility does not imply authority.
24. Device ownership does not imply authority.
25. Provider connectivity does not imply authority.
26. Current state is a projection.
27. Historical events remain immutable.
28. Corrections append new history; they do not rewrite old history.
29. Evidence remains traceable.
30. Provenance is preserved through transformations.
31. Source timestamps and received timestamps remain distinct.
32. Effective time and processing time remain distinct.
33. Conflicting material sources are not silently collapsed.
34. Reconciliation policy is explicit.
35. Source failure does not become physical failure.
36. Missing telemetry does not become “still true.”
37. A stale sensor does not establish current presence.
38. Provider availability is never invented.
39. External data is untrusted until validated.
40. Model output is not automatically fact.
41. Confidence is not truth.
42. AI inference must retain its inputs and model/version.
43. Scenario data cannot overwrite observed state.
44. Forecast data cannot overwrite observed state.
45. Twin updates require scope validation.
46. Sensitive state requires privacy/data-scope enforcement.
47. Access to twin data is governed independently from physical authority.
48. A twin query cannot grant access.
49. A twin mutation cannot grant authority.
50. A twin cannot execute a consequential command directly.
51. Consequential action must cross Authorization → Action Runtime.
52. Action results update the twin only through recorded Event/Evidence.
53. Event history cannot be rewritten by a twin update.
54. Evidence cannot be fabricated to support a state.
55. Relationship endpoints must be valid.
56. Temporal relationship validity is explicit.
57. State validity intervals are explicit where required.
58. Out-of-order observations are handled deterministically.
59. Replayed observations are idempotent.
60. Correlation IDs are preserved across synchronization.
61. Source identity is preserved.
62. Adapter identity/version is preserved.
63. Provider secrets are never stored in twin state.
64. Raw biometric material is never stored in twin state.
65. Raw authentication secrets are never stored in twin state.
66. Privacy-restricted observations remain restricted.
67. Retention policy cannot erase required immutable evidence silently.
68. Deletion/redaction is governed and does not falsify history.
69. Derived projections are rebuildable from authoritative inputs where required.
70. Search indexes are not authoritative twin history.
71. 3D scenes are projections, not authority.
72. Digital Twin graph edges carry provenance.
73. Property values carry source/quality metadata.
74. State changes emit auditable transitions.
75. Material changes are attributable.
76. Unknown dependencies remain visible.
77. Reconciliation cannot upgrade trust without evidence.
78. Verification rules are explicit.
79. Twin models are versioned.
80. Schema/model migrations preserve historical meaning.
81. A model version cannot silently reinterpret old history.
82. Cross-scope joins require policy permission.
83. Cross-community leakage is rejected.
84. Human-provided facts retain source classification.
85. Constantyna output cannot directly execute consequential twin actions.
86. Genesis output cannot directly execute consequential twin actions.
87. AI cannot convert UNKNOWN to VERIFIED without a governed verification basis.
88. Prompt injection cannot expand twin data scope.
89. Retrieved content cannot issue authority.
90. A twin cannot self-authorize synchronization with restricted sources.
91. Emergency state does not create permanent authority.
92. Physical state is never assumed from authorization alone.
93. Authorization ALLOW does not mean physical success.
94. Command accepted does not mean physical success.
95. No evidence of physical success means UNKNOWN where applicable.
96. Adapter health does not prove physical entity health.
97. A current snapshot identifies its evaluation time.
98. Historical queries identify their as-of time.
99. All consequential pathways terminate in the global execution invariant.
100. **NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.**
