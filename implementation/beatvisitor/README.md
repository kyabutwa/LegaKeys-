# BeatVisitor — Governed Visitor Identity, Invitation & Re-Entry

## Purpose

BeatVisitor governs:
INVITER -> INVITATION -> ACCEPTANCE -> IDENTITY EVIDENCE -> OCR -> VERIFICATION -> AUTHORIZATION -> BEATACCESS -> ARRIVAL -> EXIT -> RE-ENTRY -> INVITER END/EXPIRY.

BeatVisitor does not replace Identity, Authorization, or BeatAccess.

## Core boundary

IDENTITY EVIDENCE supports who the visitor claims to be.
AUTHORIZATION decides what the visitor may do.
BEATACCESS enforces physical access.
EVENT/EVIDENCE records what actually happened.

NO AUTHORIZATION -> NO ACCESS COMMAND.

## Invitation ownership

The inviter owns the invitation lifecycle.

- The inviter creates the invitation.
- The inviter defines destination, access scope, time window and verification requirements.
- The visitor accepts and completes the required verification.
- A reusable invitation may support exit and re-entry while still active.
- Every re-entry is a new authorization/access evaluation.
- The inviter may end/revoke the invitation at any time.
- Ending an invitation immediately blocks future eligibility and re-entry.
- The visitor cannot extend, reactivate or reopen an inviter-ended invitation.
- Expiration also ends eligibility.

## Identity document and OCR

Supported evidence can include passport, national ID and other legally accepted identity evidence.

OCR may extract legal name, date of birth where required, nationality, document number, issuer, expiry and machine-readable-zone fields where available.

OCR output is EXTRACTED/UNVERIFIED until validation. The visitor reviews the extracted information before it becomes verified identity evidence.

## Biometrics

BeatVisitor distinguishes:

1. Identity-proofing face capture/liveness, when policy requires it.
2. Device biometric authentication such as Face ID/Touch ID, where the platform receives an authentication assertion/result only.
3. Approved fingerprint or palm capture integrations, where lawful and explicitly required.

Raw device biometric data must never enter LegaKeys. Raw fingerprint/palm templates must not be stored in ordinary BeatVisitor tables. Approved providers may hold protected biometric material under their governed boundary.

## Re-entry

A reusable invitation permits another access attempt while all required conditions remain true:

Active invitation + verified visitor + current authorization + valid time + valid scope + valid credential/presentation + BeatAccess execution gate.

Exit does not consume MULTI_ENTRY or REENTRY_ALLOWED invitations.

## Safety

BeatVisitor cannot create authority, create authorization, bypass BeatAccess, convert OCR into permission, treat biometric success as permission, fabricate providers, fabricate document authenticity, reopen an ended invitation, or turn UNKNOWN into VERIFIED.

## Release gate

All invitation ownership, identity evidence, OCR, biometric privacy, authorization binding, re-entry, termination, expiry, audit and BeatAccess tests must pass.
