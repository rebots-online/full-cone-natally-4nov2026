CREATE TABLE IF NOT EXISTS billing_accounts (
  uid text PRIMARY KEY, state jsonb NOT NULL DEFAULT '{}', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS billing_orders (
  id uuid PRIMARY KEY, uid text NOT NULL REFERENCES billing_accounts(uid),
  request_id uuid NOT NULL, rail text NOT NULL, product text NOT NULL,
  state jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(uid, request_id)
);
CREATE INDEX IF NOT EXISTS billing_orders_owner ON billing_orders(uid);
CREATE TABLE IF NOT EXISTS billing_receipts (
  identity text PRIMARY KEY, uid text NOT NULL REFERENCES billing_accounts(uid),
  order_id uuid REFERENCES billing_orders(id), state jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS billing_allocations (
  id text PRIMARY KEY, uid text NOT NULL REFERENCES billing_accounts(uid),
  receipt_id text NOT NULL REFERENCES billing_receipts(identity),
  micros bigint NOT NULL, turns integer NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS billing_turns (
  uid text NOT NULL REFERENCES billing_accounts(uid), id uuid NOT NULL,
  status text NOT NULL CHECK(status IN ('reserved','completed','released')),
  updated_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(uid,id)
);
CREATE TABLE IF NOT EXISTS billing_proofs (
  identity text PRIMARY KEY, order_id uuid NOT NULL REFERENCES billing_orders(id)
);
