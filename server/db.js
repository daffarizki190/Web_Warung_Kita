import pg from 'pg';
const { Pool } = pg;
import { newDb } from 'pg-mem';
import dotenv from 'dotenv';
dotenv.config();

let pool = null;
let memPool = null;
let useMem = false;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
} catch {}

const ensureMemPool = () => {
  if (memPool) return memPool;
  const db = newDb();
  const pgMem = db.adapters.createPg();
  memPool = new pgMem.Pool();
  return memPool;
};

export const query = async (text, params) => {
  if (!useMem && pool) {
    try {
      return await pool.query(text, params);
    } catch {
      useMem = true;
    }
  }
  const mp = ensureMemPool();
  return mp.query(text, params);
};

export { pool };
export default { query, pool };
