-- LEGAKEYS ACCOUNT GOVERNANCE CONTRACT
-- Additive hardening for the existing canonical identity/account/session model.

create index if not exists credentials_account_state_idx on legakeys.credentials(account_id, state);
create index if not exists sessions_account_state_idx on legakeys.sessions(account_id, state);
create index if not exists participants_identity_state_idx on legakeys.participants(identity_id, state);
create index if not exists participations_identity_state_idx on legakeys.participations(identity_id, state);

comment on table legakeys.accounts is 'Canonical application account. Identity, authentication, participation and authorization remain separate concerns.';
comment on table legakeys.credentials is 'Authentication credentials only. Secret material is represented by protected references; plaintext secrets are forbidden.';
comment on table legakeys.sessions is 'Canonical authenticated sessions. Each session is independently revocable and time-bounded.';
comment on table legakeys.participants is 'Participation construct. Participant state never grants authority by itself.';