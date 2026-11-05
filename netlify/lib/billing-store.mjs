import { randomUUID } from 'node:crypto';
import { Pool } from 'pg';
import { getDatabase } from '@netlify/database';
let pool;
function database(env) { return pool ||= env('BILLING_DATABASE_URL') ? new Pool({connectionString:env('BILLING_DATABASE_URL'),max:3}) : getDatabase().pool; }
export async function nextAccount(env) {
  return (await database(env).query("SELECT uid FROM billing_accounts WHERE updated_at < now()-interval '1 minute' ORDER BY updated_at LIMIT 1")).rows[0]?.uid;
}
export async function withAccount(env, uid, run) {
  database(env);
  const client = await pool.connect();
  let locked = false;
  try {
    await client.query("SET lock_timeout = '5s'");
    await client.query('SELECT pg_advisory_lock(hashtextextended($1,0))', [uid]);
    locked = true;
    await client.query('INSERT INTO billing_accounts(uid) VALUES($1) ON CONFLICT DO NOTHING', [uid]);
    return await run(new AccountStore(client, uid));
  } finally {
    if (locked) await client.query('SELECT pg_advisory_unlock(hashtextextended($1,0))', [uid]).catch(() => { locked = false; });
    client.release(!locked);
  }
}
export class AccountStore {
  constructor(client, uid) { this.db = client; this.uid = uid; }
  async account() { return (await this.db.query('SELECT state FROM billing_accounts WHERE uid=$1', [this.uid])).rows[0].state; }
  async saveAccount(state) { await this.db.query('UPDATE billing_accounts SET state=$2,updated_at=now() WHERE uid=$1', [this.uid, JSON.stringify(state)]); }
  async orders() { return (await this.db.query('SELECT id,rail,product,state,created_at FROM billing_orders WHERE uid=$1 ORDER BY created_at', [this.uid])).rows; }
  async order(id) { return (await this.db.query('SELECT id,rail,product,state,created_at FROM billing_orders WHERE uid=$1 AND id=$2', [this.uid,id])).rows[0]; }
  async createOrder(requestId, rail, product, state) {
    await this.db.query('INSERT INTO billing_orders(id,uid,request_id,rail,product,state) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(uid,request_id) DO NOTHING', [randomUUID(),this.uid,requestId,rail,product,JSON.stringify(state)]);
    return (await this.db.query('SELECT id,rail,product,state,created_at FROM billing_orders WHERE uid=$1 AND request_id=$2',[this.uid,requestId])).rows[0];
  }
  async saveOrder(order) { await this.db.query('UPDATE billing_orders SET state=$3 WHERE uid=$1 AND id=$2',[this.uid,order.id,JSON.stringify(order.state)]); }
  async receipts() { return (await this.db.query('SELECT identity,order_id,state FROM billing_receipts WHERE uid=$1',[this.uid])).rows; }
  async receipt(identity, order, state) {
    await this.db.query('INSERT INTO billing_receipts(identity,uid,order_id,state) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING',[identity,this.uid,order?.id || null,JSON.stringify(state)]);
    const record = (await this.db.query('SELECT uid,order_id,state FROM billing_receipts WHERE identity=$1',[identity])).rows[0];
    if (record.uid !== this.uid || record.order_id !== (order?.id || null)) throw new Error('Receipt already bound.');
    return record;
  }
  async saveReceipt(identity, state) { await this.db.query('UPDATE billing_receipts SET state=$3 WHERE identity=$1 AND uid=$2',[identity,this.uid,JSON.stringify(state)]); }
  async allocate(id, receipt, micros, turns) {
    await this.db.query('INSERT INTO billing_allocations(id,uid,receipt_id,micros,turns) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',[id,this.uid,receipt,micros,turns]);
  }
  async totals() {
    const sum = (await this.db.query('SELECT COALESCE(sum(micros),0) AS micros,COALESCE(sum(turns),0) AS turns FROM billing_allocations WHERE uid=$1',[this.uid])).rows[0];
    const counts = (await this.db.query("SELECT count(*) FILTER (WHERE status='completed') AS completed,count(*) FILTER (WHERE status='reserved') AS reserved FROM billing_turns WHERE uid=$1",[this.uid])).rows[0];
    return { micros:Number(sum.micros), turns:Number(sum.turns), completed:Number(counts.completed), reserved:Number(counts.reserved) };
  }
  async bindProof(identity, orderId) {
    await this.db.query('INSERT INTO billing_proofs(identity,order_id) VALUES($1,$2) ON CONFLICT DO NOTHING',[identity,orderId]);
    return (await this.db.query('SELECT order_id FROM billing_proofs WHERE identity=$1',[identity])).rows[0].order_id === orderId;
  }
  async expireInference() {
    const expired=await this.db.query("UPDATE billing_inference SET state=jsonb_set(state,'{status}','\"failed\"'::jsonb) WHERE uid=$1 AND state->>'status' IN ('ready','tools') AND (state->>'expiresAt')::bigint < $2 RETURNING id",[this.uid,Date.now()]);
    for(const row of expired.rows) {await this.turn(row.id,'release');await this.opening(row.id,'release');}
    await this.db.query("UPDATE billing_inference SET state=jsonb_build_object('status','expired') WHERE uid=$1 AND (state->>'payloadExpiresAt')::bigint < $2",[this.uid,Date.now()]);
  }
  async inference(id) { return (await this.db.query('SELECT state FROM billing_inference WHERE uid=$1 AND id=$2',[this.uid,id])).rows[0]?.state; }
  async saveInference(id,state) { await this.db.query('INSERT INTO billing_inference(uid,id,state) VALUES($1,$2,$3) ON CONFLICT(uid,id) DO UPDATE SET state=$3',[this.uid,id,JSON.stringify(state)]); }
  async openingAvailable() {
    return (await this.db.query("SELECT 1 FROM billing_orders o CROSS JOIN (VALUES ('natal'),('now')) s(stage) LEFT JOIN billing_openings r ON r.uid=o.uid AND r.order_id=o.id AND r.stage=s.stage WHERE o.uid=$1 AND o.state->>'status'='paid' AND o.state->'product'->>'kind'='bundle' AND (r.status IS NULL OR r.status='released') LIMIT 1",[this.uid])).rows.length>0;
  }
  async opening(id,action,stage) {
    const old=(await this.db.query('SELECT status FROM billing_openings WHERE uid=$1 AND request_id=$2',[this.uid,id])).rows[0];
    if(action==='reserve') {
      if(old)return old.status;
      if(!['natal','now'].includes(stage))return 'exhausted';
      const order=(await this.db.query("SELECT o.id FROM billing_orders o LEFT JOIN billing_openings r ON r.uid=o.uid AND r.order_id=o.id AND r.stage=$2 WHERE o.uid=$1 AND o.state->>'status'='paid' AND o.state->'product'->>'kind'='bundle' AND (r.status IS NULL OR r.status='released') ORDER BY o.created_at LIMIT 1",[this.uid,stage])).rows[0];
      if(!order)return 'exhausted';
      await this.db.query("INSERT INTO billing_openings(uid,order_id,stage,request_id,status) VALUES($1,$2,$3,$4,'reserved') ON CONFLICT(uid,order_id,stage) DO UPDATE SET request_id=$4,status='reserved'",[this.uid,order.id,stage,id]);return 'reserved';
    }
    if(old?.status==='reserved') {const status=action==='complete'?'completed':'released';await this.db.query('UPDATE billing_openings SET status=$3 WHERE uid=$1 AND request_id=$2',[this.uid,id,status]);return status;}
    return old?.status;
  }
  async turn(id, action) {
    const old = (await this.db.query('SELECT status FROM billing_turns WHERE uid=$1 AND id=$2',[this.uid,id])).rows[0];
    if (action === 'reserve') {
      if (old) return old.status;
      const totals = await this.totals();
      if (totals.turns - totals.completed - totals.reserved <= 0) return 'exhausted';
      await this.db.query("INSERT INTO billing_turns(uid,id,status) VALUES($1,$2,'reserved')",[this.uid,id]);
      return 'reserved';
    }
    if (old?.status === 'reserved') await this.db.query('UPDATE billing_turns SET status=$3,updated_at=now() WHERE uid=$1 AND id=$2',[this.uid,id,action === 'complete' ? 'completed' : 'released']);
    return old?.status === 'reserved' ? (action === 'complete' ? 'completed' : 'released') : old?.status;
  }
}
