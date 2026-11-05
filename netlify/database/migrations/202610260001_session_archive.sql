CREATE TABLE IF NOT EXISTS session_archives (
 id text PRIMARY KEY, uid text NOT NULL REFERENCES billing_accounts(uid), receipt_id text NOT NULL UNIQUE,
 resource_id text NOT NULL, fulfilled_at timestamptz NOT NULL, expires_at timestamptz NOT NULL,
 consent_at timestamptz, deleted_at timestamptz, snapshot jsonb
);
CREATE INDEX IF NOT EXISTS session_archives_owner ON session_archives(uid);
CREATE TABLE IF NOT EXISTS session_exchanges (
 session_id text NOT NULL REFERENCES session_archives(id) ON DELETE CASCADE,
 request_id text NOT NULL, question text NOT NULL, answer text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(session_id,request_id)
);
CREATE TABLE IF NOT EXISTS session_audio (
 session_id text NOT NULL, request_id text NOT NULL, chunk integer NOT NULL CHECK(chunk>=0 AND chunk<256),
 total integer NOT NULL CHECK(total>0 AND total<=256), mime text NOT NULL, data bytea NOT NULL CHECK(octet_length(data)<=524288),
 PRIMARY KEY(session_id,request_id,chunk),
 FOREIGN KEY(session_id,request_id) REFERENCES session_exchanges(session_id,request_id) ON DELETE CASCADE
);
