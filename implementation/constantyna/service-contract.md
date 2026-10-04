# CONSTANTYNA Service Contract

## Run

A Constantyna run requires:
- run ID
- actor/session reference
- purpose
- input reference
- permitted context scope
- data scope
- model/provider reference
- policy profile
- correlation ID
- startedAt

## Understanding pipeline

INGEST
→ VALIDATE
→ LANGUAGE
→ PARSE
→ IDENTIFY EXPLICIT INTENT
→ EXTRACT EXPRESSED NEEDS
→ RESOLVE REFERENCES
→ LOAD AUTHORIZED CONTEXT
→ CLASSIFY UNCERTAINTY
→ GENERATE RESPONSE
→ SAFETY / POLICY REVIEW
→ DELIVER
→ AUDIT

## Human input

Preserve the original user message. Derived interpretations must never replace the original.

## Intent

Intent contains:
- label
- evidence references
- confidence
- ambiguity
- candidate alternatives
- required clarification

Confidence is not truth.

## Need

A need represents an expressed or explicitly requested goal. Inferred needs are labeled INFERRED and cannot silently become user commitments.

## Clarification

Clarification is required when:
- intent is materially ambiguous
- target is ambiguous
- multiple consequential interpretations exist
- authorization depends on missing information
- context conflicts
- identity/participant scope is unclear

## Context retrieval

Only context allowed by policy and authorization is loaded.

CONTEXT INPUT:
place + time + relationship + capability + authority state + environment + service state + relevant history

The current authorization decision remains authoritative.

## Tool use

Read-only tools may be used when scoped.

Any tool that can:
- unlock
- pay
- order
- create/delete
- modify records
- change access
- send consequential communications
- create authorization

must cross the Authorization → Action Runtime boundary.

## Response provenance

Where factual claims depend on system data, the response records source references.

Where the model cannot establish truth:
return UNKNOWN / NEEDS_CONFIRMATION rather than inventing.

## Human handoff

Escalation contains:
- reason
- uncertainty
- risk level
- relevant context
- evidence references
- proposed next step
- required human/authority role

## Memory contract

Memory writes require:
- memory type
- source
- scope
- retention
- user/system basis
- truth state
- revocation semantics

Memory retrieval is filtered by current authorization and scope.

## Consequential boundary

CONSTANTYNA cannot directly execute consequential operations.

It can prepare:
- an intent
- a proposal
- a clarification
- an authorization request

The execution path is:
PROPOSAL → AUTHORIZATION → ACTION → EVENT → EVIDENCE → OUTCOME.
