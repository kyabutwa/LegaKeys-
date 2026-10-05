# Kenya Compliance Baseline — LegaKeys v1.1.0

> Engineering baseline, not legal advice. Final obligations depend on the exact LegaKeys entity structure, processing activities, contracts and regulated services.

## 1. Primary baseline

### Data Protection Act, 2019
LegaKeys must treat personal data protection as a first-class architectural boundary:
- lawful, fair and transparent processing;
- specified and legitimate purposes;
- data minimisation;
- accuracy and correction;
- retention limitation;
- data-subject rights;
- security safeguards;
- controlled cross-border transfers;
- controller/processor accountability.

The platform therefore keeps identity, evidence, verification, access, service and intelligence records separated; records provenance and purpose; and avoids turning authentication into blanket authorization.

### Data Protection Regulations, 2021
The implementation should track:
- General Regulations;
- Registration of Data Controllers and Data Processors Regulations;
- Complaints Handling and Enforcement Regulations.

The compliance registry must record the instrument, version/date, source, applicable processing domain, controls, owner, review date and implementation status.

### ODPC guidance
The architecture must be ready for:
- DPIAs where processing risk requires them;
- biometric-data safeguards;
- children's-data safeguards where applicable;
- health-data safeguards;
- cross-border transfer controls;
- data-subject rights and complaint workflows;
- controller/processor registration assessment.

## 2. Cybersecurity

The Computer Misuse and Cybercrimes Act (Cap. 79C), including the 2025 amendment, is an architectural input for:
- access control;
- credential protection;
- unauthorized-access prevention;
- audit trails;
- incident response;
- evidence preservation;
- secure handling of subscriber/traffic information;
- security monitoring and recovery.

The execution model must therefore fail closed, keep immutable event/evidence history, bind consequential actions to authorization, and avoid hidden privilege escalation.

## 3. Consumer protection

Where LegaKeys supplies consumer-facing services, marketplace/service flows should be designed for:
- truthful descriptions;
- transparent terms and pricing;
- non-deceptive interfaces;
- complaint and dispute paths;
- auditable transactions;
- clear provider/platform responsibility boundaries.

## 4. Sector overlays

BeatPay, health, education, mobility, utilities, communications, access/security and other services must not be treated as one generic regulatory category. Each adapter/service offering receives a jurisdiction and sector policy profile before activation.

## 5. Continuous legal-update architecture

Create a regulatory_instruments registry with:
- jurisdiction;
- regulator;
- instrument type;
- title;
- citation;
- source URL;
- publication/effective date;
- superseded-by reference;
- version/hash;
- affected domains;
- control mappings;
- review status;
- last reviewed;
- next review;
- evidence of review.

Policy changes must flow:

SOURCE → INGEST → NORMALIZE → VERSION → IMPACT ANALYSIS → CONTROL UPDATE → TESTS → APPROVAL → RUNTIME POLICY

No model or agent is allowed to silently change binding production policy.

## 6. Current baseline sources

- ODPC: https://www.odpc.go.ke/data-protection-laws-kenya/
- ODPC guidance: https://www.odpc.go.ke/guidelines-2/
- ODPC data-subject rights: https://www.odpc.go.ke/rights-of-a-data-subject/
- Kenya Law — Computer Misuse and Cybercrimes Act: https://new.kenyalaw.org/akn/ke/act/2018/5
- Kenya Law — Consumer Protection Act: https://new.kenyalaw.org/akn/ke/act/2012/46/eng@2022-12-31/source.pdf

## 7. v1.1.0 control stance

LegaKeys does not claim that software architecture alone makes the company legally compliant. The architecture is designed to make compliance explicit, testable, reviewable and updateable.
