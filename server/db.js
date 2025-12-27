const { Pool } = require('pg');
const { newDb } = require('pg-mem');
require('dotenv').config();

let pool = null;
let memPool = null;
let useMem = false;

try {
  if (process.env.DATABASE_URL) {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
} catch {}

const ensureMemPool = () => {
  if (memPool) return memPool;
  const db = newDb();
  const pgMem = db.adapters.createPg();
  memPool = new pgMem.Pool();
  return memPool;
};

module.exports = {
  query: async (text, params) => {
    if (!useMem && pool) {
      try {
        return await pool.query(text, params);
      } catch {
        useMem = true;
      }
    }
    const mp = ensureMemPool();
    return mp.query(text, params);
  },
  pool,
};
