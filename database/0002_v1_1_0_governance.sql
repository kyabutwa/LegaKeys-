-- LegaKeys v1.1.0 governance and regulatory policy registry
create table if not exists legakeys.regulatory_instruments (
  regulatory_id uuid primary key,
  jurisdiction text not null,
  regulator text not null,
  instrument_type text not null,
  title text not null,
  citation text,
  source_url text,
  published_on date,
  effective_on date,
  superseded_by uuid references legakeys.regulatory_instruments(regulatory_id),
  version_label text,
  content_hash text,
  applicability jsonb not null default '{}'::jsonb,
  control_mappings jsonb not null default '{}'::jsonb,
  review_state text not null default 'REVIEW_REQUIRED',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  provenance jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists regulatory_instruments_jurisdiction_idx
  on legakeys.regulatory_instruments(jurisdiction, regulator);
create index if not exists regulatory_instruments_review_idx
  on legakeys.regulatory_instruments(review_state, next_review_at);

insert into legakeys.regulatory_instruments
(regulatory_id,jurisdiction,regulator,instrument_type,title,citation,source_url,effective_on,version_label,review_state,applicability,control_mappings,provenance)
values
('11111111-1111-4111-8111-111111111111','KE','ODPC','ACT','Data Protection Act, 2019','Act No. 24 of 2019','https://www.odpc.go.ke/data-protection-laws-kenya/','2019-11-25','2019','BASELINE', '{"domains":["identity","evidence","services","intelligence"]}'::jsonb, '{"controls":["purpose_limitation","minimisation","rights","retention","security","cross_border_transfer"]}'::jsonb, '{"source":"ODPC","review_basis":"official regulatory framework"}'::jsonb)
on conflict(regulatory_id) do nothing;

insert into legakeys.regulatory_instruments
(regulatory_id,jurisdiction,regulator,instrument_type,title,citation,source_url,effective_on,version_label,review_state,applicability,control_mappings,provenance)
values
('22222222-2222-4222-8222-222222222222','KE','ODPC','REGULATION','Data Protection (General) Regulations, 2021','Legal Notice 34 of 2021','https://www.odpc.go.ke/data-protection-laws-kenya/','2021-07-14','2021','BASELINE', '{"domains":["identity","evidence","services","intelligence"]}'::jsonb, '{"controls":["governance","processing_records","security","rights"]}'::jsonb, '{"source":"ODPC","review_basis":"official regulatory framework"}'::jsonb)
on conflict(regulatory_id) do nothing;

insert into legakeys.regulatory_instruments
(regulatory_id,jurisdiction,regulator,instrument_type,title,citation,source_url,effective_on,version_label,review_state,applicability,control_mappings,provenance)
values
('33333333-3333-4333-8333-333333333333','KE','Kenya Law','ACT','Computer Misuse and Cybercrimes Act','Cap. 79C; amended 2025','https://new.kenyalaw.org/akn/ke/act/2018/5','2018-05-30','2025 amendment','BASELINE', '{"domains":["identity","access","execution","evidence","infrastructure"]}'::jsonb, '{"controls":["authentication","authorization","audit","incident_response","evidence_integrity"]}'::jsonb, '{"source":"Kenya Law","review_basis":"latest consolidated act checked 2026-10-05"}'::jsonb)
on conflict(regulatory_id) do nothing;

insert into legakeys.regulatory_instruments
(regulatory_id,jurisdiction,regulator,instrument_type,title,citation,source_url,effective_on,version_label,review_state,applicability,control_mappings,provenance)
values
('44444444-4444-4444-8444-444444444444','KE','Kenya Law','ACT','Consumer Protection Act','Cap. 501','https://new.kenyalaw.org/akn/ke/act/2012/46/eng@2022-12-31/source.pdf','2013-03-14','current baseline','BASELINE', '{"domains":["services","payments","commerce","marketplace"]}'::jsonb, '{"controls":["truthful_descriptions","transparent_terms","complaints","dispute_handling"]}'::jsonb, '{"source":"Kenya Law","review_basis":"official published act"}'::jsonb)
on conflict(regulatory_id) do nothing;
