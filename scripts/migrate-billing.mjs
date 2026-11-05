import {Pool} from 'pg';
import {readdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const url=process.env.BILLING_DATABASE_URL;
if(!url)throw new Error('Set BILLING_DATABASE_URL for the existing Natally billing database.');
const pool=new Pool({connectionString:url,max:1});
const client=await pool.connect();
try{
 await client.query('SELECT pg_advisory_lock(2601026)');
 await client.query('CREATE TABLE IF NOT EXISTS billing_schema_migrations(name text PRIMARY KEY,sha256 text NOT NULL,applied_at timestamptz NOT NULL DEFAULT now())');
 const root=new URL('../netlify/database/migrations/',import.meta.url);
 for(const name of (await readdir(root)).filter(name=>name.endsWith('.sql')).sort()){
  const sql=await readFile(new URL(name,root),'utf8'),hash=createHash('sha256').update(sql).digest('hex');
  const old=(await client.query('SELECT sha256 FROM billing_schema_migrations WHERE name=$1',[name])).rows[0];
  if(old){if(old.sha256!==hash)throw new Error('Applied migration changed: '+name);console.log('Already applied: '+name);continue;}
  await client.query('BEGIN');
  try{await client.query(sql);await client.query('INSERT INTO billing_schema_migrations(name,sha256) VALUES($1,$2)',[name,hash]);await client.query('COMMIT');console.log('Applied: '+name);}
  catch(error){await client.query('ROLLBACK');throw error;}
 }
}finally{await client.query('SELECT pg_advisory_unlock(2601026)').catch(()=>{});client.release();await pool.end();}
