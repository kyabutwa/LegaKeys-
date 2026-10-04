# World Intelligence Verification Cases

100 verification cases.

## Map — WI-001 to WI-015
- WI-001 map feature requires geometry
- WI-002 geometry requires CRS
- WI-003 malformed geometry rejected
- WI-004 provenance required
- WI-005 map feature can be DECLARED
- WI-006 map feature can be OBSERVED
- WI-007 map feature can be VERIFIED
- WI-008 map rendering never grants authority
- WI-009 stale feature remains labeled
- WI-010 conflicting geometry remains CONFLICTING
- WI-011 provider identity preserved
- WI-012 unsupported provider state becomes UNKNOWN
- WI-013 derived route keeps source references
- WI-014 spatial relation records method
- WI-015 privacy-restricted geometry is not exposed

## Live location / real position — WI-016 to WI-040
- WI-016 latitude/longitude required
- WI-017 timestamp required
- WI-018 accuracy preserved
- WI-019 WGS84 default is explicit
- WI-020 unsupported CRS rejected
- WI-021 GNSS source preserved
- WI-022 Wi-Fi source preserved
- WI-023 cellular source preserved
- WI-024 device source preserved
- WI-025 user-input source preserved
- WI-026 altitude may be null
- WI-027 speed may be null
- WI-028 heading may be null
- WI-029 stale sample labeled STALE
- WI-030 missing update never means stationary
- WI-031 position smoothing keeps raw lineage
- WI-032 conflicting sources represented
- WI-033 exact position can be privacy-reduced
- WI-034 unauthorized location consumer rejected
- WI-035 cross-context location leakage rejected
- WI-036 location retention policy required
- WI-037 tracking purpose required
- WI-038 continuous tracking requires governed basis
- WI-039 position does not grant access
- WI-040 position uncertainty remains visible

## Weather — WI-041 to WI-055
- WI-041 observation requires source
- WI-042 observation requires observed time
- WI-043 forecast requires issue time
- WI-044 forecast horizon preserved
- WI-045 forecast is not observation
- WI-046 units required
- WI-047 unknown provider yields UNKNOWN
- WI-048 conflicting weather sources preserved
- WI-049 stale observation labeled
- WI-050 provider response is not automatically VERIFIED
- WI-051 weather alert does not execute action
- WI-052 weather context can inform proposal
- WI-053 weather source provenance retained
- WI-054 forecast uncertainty preserved
- WI-055 unavailable weather remains UNAVAILABLE

## Earth system / climate — WI-056 to WI-070
- WI-056 atmosphere accepted
- WI-057 hydrosphere accepted
- WI-058 biosphere accepted
- WI-059 cryosphere accepted
- WI-060 geosphere accepted
- WI-061 sphere must be explicit
- WI-062 region required
- WI-063 variable required
- WI-064 unit required
- WI-065 observation time required
- WI-066 climate baseline required
- WI-067 climate analysis period required
- WI-068 climate method required
- WI-069 climate trend cannot be represented as weather
- WI-070 environmental inference labeled INFERRED

## Human understanding — WI-071 to WI-085
- WI-071 explicit message preserved
- WI-072 language may be detected but remains labeled
- WI-073 intent may be ambiguous
- WI-074 ambiguous intent triggers clarification for consequential use
- WI-075 inferred interpretation remains INFERRED
- WI-076 confidence is not truth
- WI-077 sensitive attribute is not inferred as fact
- WI-078 human understanding does not authenticate
- WI-079 human understanding does not authorize
- WI-080 conversation references are scoped
- WI-081 context references are explicit
- WI-082 unknown references remain UNKNOWN
- WI-083 human request cannot bypass policy
- WI-084 malicious prompt cannot expand data scope
- WI-085 human understanding cannot execute consequential action

## Contextual understanding — WI-086 to WI-092
- WI-086 context has timestamp
- WI-087 context has source set
- WI-088 place is explicit
- WI-089 time window is explicit
- WI-090 assumptions are surfaced
- WI-091 uncertainties are surfaced
- WI-092 context cannot become authority

## Mathematical / Black-Hole / White-Hole protocol — WI-093 to WI-100
- WI-093 Fibonacci recurrence is deterministic
- WI-094 Fibonacci interval bounded by policy
- WI-095 Fibonacci cannot violate safety minimums
- WI-096 Fibonacci cannot replace statistical climate methods
- WI-097 quarantine preserves raw input
- WI-098 invalid input cannot cross trust boundary
- WI-099 validated release preserves provenance and truth state
- WI-100 NO AUTHORIZATION → NO CONSEQUENTIAL ACTION
