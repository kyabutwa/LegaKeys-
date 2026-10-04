# GENESIS Service Contract

## Runtime command

A GENESIS run is a governed reasoning request over a declared scope.

Required:
- run ID
- requester / initiating actor
- purpose
- context reference
- input references
- allowed data scope
- operating mode
- policy/governance profile
- model/provider reference
- deadline
- correlation ID

## Pipeline

INGEST → VALIDATE → NORMALIZE → CONTEXTUALIZE → DETECT → REASON → EVALUATE → OUTPUT → GOVERN → AUDIT

GENESIS may call read-only tools directly when policy allows. Any tool capable of consequential mutation MUST return to the Authorization → Action execution boundary.

## Endpoints

POST /genesis/runs
POST /genesis/runs/:id/evaluate
POST /genesis/runs/:id/propose
POST /genesis/runs/:id/approve
POST /genesis/runs/:id/pause
POST /genesis/runs/:id/cancel
POST /genesis/runs/:id/reconcile
GET /genesis/runs/:id
GET /genesis/runs/:id/inputs
GET /genesis/runs/:id/findings
GET /genesis/runs/:id/proposals
GET /genesis/runs/:id/evidence
GET /genesis/runs/:id/timeline

## Proposal contract

A proposal MUST identify:
- what is proposed
- why
- target
- expected outcome
- material assumptions
- uncertainty
- risk / impact class
- required capability
- required authority
- required authorization
- expiration / revalidation window
- supporting evidence

Approval changes governance state; it does not itself execute the action.

## Tool contract

Each tool declares:
- tool identity/version
- read/write classification
- capability required
- allowed scopes
- input schema
- output schema
- side-effect class
- timeout
- provenance behavior
- failure behavior

Consequential tools are deny-by-default unless explicitly enabled by policy.

## Model contract

Model execution records:
model/provider identifier
model version where available
configuration reference
prompt/template reference
input references
output reference
safety/policy result
latency/cost metadata where governed

Raw prompts and sensitive inputs are retained only according to data-governance policy.

## Evaluation

Every material output can be evaluated for:
- groundedness
- correctness
- policy compliance
- safety
- scope compliance
- provenance completeness
- calibration/uncertainty
- harmful or unauthorized tool use

Evaluation findings create new evidence/events; they do not rewrite the original run.

## Failure

If data is unavailable, tool state is unknown, provenance is insufficient, or policy cannot be evaluated, GENESIS returns UNKNOWN/DEGRADED rather than inventing certainty.

NO AUTHORIZATION → NO CONSEQUENTIAL ACTION.
