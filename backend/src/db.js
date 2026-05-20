import pg from 'pg';
import { config } from './config.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5000)
});

pool.on('error', (err) => {
  console.error(JSON.stringify({
    level: 'error',
    event: 'db.pool_error',
    message: err.message
  }));
});

export async function query(text, params = []) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  if (config.logSql) {
    console.log(JSON.stringify({
      level: 'info',
      event: 'db.query',
      durationMs: duration,
      rows: result.rowCount
    }));
  }

  return result;
}

export async function checkDatabase() {
  await pool.query('SELECT 1');
  return true;
}
