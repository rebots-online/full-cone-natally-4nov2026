CREATE TABLE IF NOT EXISTS billing_inference (uid text NOT NULL REFERENCES billing_accounts(uid), id uuid NOT NULL, state jsonb NOT NULL, PRIMARY KEY(uid,id));
