CREATE TABLE IF NOT EXISTS billing_openings (
  uid text NOT NULL REFERENCES billing_accounts(uid),
  order_id uuid NOT NULL REFERENCES billing_orders(id),
  stage text NOT NULL CHECK(stage IN ('natal','now')),
  request_id uuid NOT NULL,
  status text NOT NULL CHECK(status IN ('reserved','completed','released')),
  PRIMARY KEY(uid,order_id,stage),
  UNIQUE(uid,request_id)
);
