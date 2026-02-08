import { query } from './query.js';

export async function findCompanies() {
  const sql = `
    SELECT
      id,
      name,
      address,
      latitude,
      longitude,
      created_at
    FROM companies
    ORDER BY created_at DESC
  `;

  return query(sql);
}
