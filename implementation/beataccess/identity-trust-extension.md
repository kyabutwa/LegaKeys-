# BeatAccess identity trust extension

This extension connects the existing LegaKeys Identity and BeatAccess contracts without collapsing authentication into authorization.

## Canonical separation

Identity evidence -> verification -> assurance -> credential/device presentation -> context -> authorization -> BeatAccess -> action -> event -> evidence.

## Document intake

The platform accepts document metadata and a content hash from upload/camera/scanner/provider flows. Raw documents must only be stored through an approved encrypted object-storage path. The Neon record is the canonical lifecycle/audit record.

OCR is an extraction step, never proof of authenticity.

## Biometrics

- DEVICE_BIOMETRIC represents a local device authentication signal. The platform never receives Face ID/Touch ID source data.
- FACE, FINGERPRINT and PALM_HAND represent remote identity-proofing modalities. They require an approved capture/verification provider or compatible hardware.
- No raw biometric image/template is stored in ordinary domain tables.
- Liveness/PAD state is explicit where applicable.

## Assurance

L0 Unverified
L1 Basic account/contact assurance
L2 Verified identity evidence
L3 Strong identity evidence plus biometric/liveness or trusted external identity
L4 High-assurance, context-specific step-up

Assurance never creates authority.

## Truth

A document can be SUBMITTED, OCR_COMPLETE or REVIEW_REQUIRED without being VERIFIED. A provider connection is not invented merely because the UI exposes the integration point.
