# World Intelligence Service Contract

## 1. Inputs

Every ingestion request MUST identify:

- source ID and source type
- subject/entity when applicable
- acquisition timestamp
- received timestamp
- source provenance
- requested data scope
- purpose
- privacy/retention class
- correlation ID

## 2. Map contract

A map feature has:
- feature ID
- geometry
- coordinate reference
- semantic type
- source
- truth state
- validity interval
- geometry accuracy/quality
- provenance

Map rendering is a projection. It is not an authority source.

## 3. Live-location contract

A location sample MUST contain:
- subject reference
- coordinate
- accuracy
- timestamp
- acquisition source
- freshness
- truth state
- provenance
- consent/authorization reference where required

Live location is a stream of observations, not a permanent property.

A missing update means UNKNOWN/STALE according to policy; it never means "still there".

## 4. Real-position contract

Position quality is evaluated using:

P = (coordinate, accuracy, timestamp, source, freshness, method, provenance)

A position can be:
- OBSERVED
- VERIFIED
- DECLARED
- INFERRED
- UNKNOWN

"Real position" means the best currently supported position estimate, never perfect certainty.

## 5. Weather contract

Weather observations and forecasts require:
- location/area
- variable
- value + unit
- observation/forecast time
- issue time
- source
- forecast horizon where applicable
- uncertainty/quality
- provenance

Forecast ≠ observation.

## 6. Earth-system contract

Earth-system state may contain coupled observations across:
- atmosphere
- hydrosphere
- biosphere
- cryosphere
- geosphere

Each measurement keeps its source, time, spatial scope and uncertainty.

## 7. Climate contract

Climate records require:
- defined region
- defined variable
- baseline/reference period
- analysis period
- statistical method
- dataset/source
- uncertainty
- trend/confidence metadata

Climate trend ≠ weather forecast.

## 8. Human-understanding contract

Input:
PERSON + EXPRESSED CONTENT + CONVERSATION CONTEXT + AUTHORIZED CONTEXT

Output:
LANGUAGE INTERPRETATION + INTENT + NEED + REFERENCES + UNCERTAINTY + EXPLANATION

The interpreter must distinguish:
- explicit statement
- direct request
- contextual reference
- model inference
- unknown

No inferred sensitive attribute becomes a fact without an independent governed source.

## 9. Contextual-understanding contract

Context combines only permitted dimensions:

PLACE + TIME + PARTICIPATION + RELATIONSHIPS + CAPABILITIES + AUTHORITY + ENVIRONMENT + HUMAN INPUT + CURRENT STATE

The output is:
CONTEXT SNAPSHOT + RELEVANT FACTS + UNCERTAINTIES + POSSIBLE INTERPRETATIONS + REQUIRED NEXT STEP

Contextual understanding cannot turn capability, relationship, location or inference into authority.

## 10. Fibonacci protocol

Adaptive sampling may use Fibonacci intervals:

Iₙ = Iₙ₋₁ + Iₙ₋₂

with bounded minimum/maximum intervals and policy-controlled reset conditions.

Fibonacci selection MUST NOT:
- override safety limits
- reduce mandatory sampling below required frequency
- substitute for statistically valid climate methodology
- become a security decision by itself

## 11. Black-Hole / White-Hole protocol

BLACK-HOLE ENTRY:
- source unavailable
- malformed data
- stale data
- privacy-restricted data
- contradictory observations
- provenance missing
- scope mismatch

Treatment:
QUARANTINE → VALIDATE → RECONCILE → LABEL

WHITE-HOLE EXIT:
Only data that passes configured validation may cross into trusted projections.

A trusted projection must preserve the original truth state and provenance.

## 12. Consequential boundary

World Intelligence may:
- inform
- explain
- detect
- contextualize
- recommend
- propose

It may not execute a consequential action directly.

Consequential flow:
UNDERSTANDING → AUTHORIZATION → ACTION RUNTIME → EVENT → EVIDENCE → OUTCOME.

## 13. Error states

Use:
UNKNOWN
STALE
UNAVAILABLE
LOW_ACCURACY
CONFLICTING
RESTRICTED
DENIED
DEGRADED
INVALID
EXPIRED

Never silently coerce these to SUCCESS or VERIFIED.
