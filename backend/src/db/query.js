import { pool } from './pool.js';

export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

