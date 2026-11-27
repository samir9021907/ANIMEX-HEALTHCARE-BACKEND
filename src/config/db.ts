import pg from 'pg';
import { ENV } from './env.config';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('❌ Neon PostgreSQL Client Error:', err.message);
});

export const connectDatabase = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
    client.release();
    console.log(`✅ Connected to Neon Cloud PostgreSQL (${res.rows[0].db_name}) at ${res.rows[0].current_time}`);
    return true;
  } catch (error: any) {
    console.error('⚠️ Neon PostgreSQL connection failed:', error.message);
    console.warn('⚡ Fallback: Using resilient in-memory database store for continuous zero-downtime serving.');
    return false;
  }
};

export const query = async (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;
