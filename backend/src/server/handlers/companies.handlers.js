import { createError, readBody } from "h3";
import { query } from "../../db/query.js";
import { getCoordinates } from "../../utils/geocode.js";
import { createUser } from "./users.handlers.js";
import { handleDbError } from "../../utils/dbErrorHandler.js";
/* ================= HELPERS ================= */

const assertCompanyExists = async (company_id) => {
  const rows = await query("SELECT * FROM companies WHERE id = ?", [
    company_id,
  ]);

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "Company not found",
    });
  }
  return rows[0];
};

const getUserInCompanyOrThrow = async (company_id, user_id) => {
  const rows = await query(
    "SELECT id FROM users WHERE id = ? AND company_id = ?",
    [user_id, company_id],
  );

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found in this company",
    });
  }
};

/* ================= CRUD ================= */

export const getCompaniesHandler = async () => {
  try {
    const sql = `
      SELECT
        c.id,
        c.name,
        c.address,
        c.latitude,
        c.longitude,
        c.created_at,
        COUNT(u.id) AS user_count
      FROM companies c
      LEFT JOIN users u
        ON u.company_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `;

    return await query(sql);
  } catch (err) {
    handleDbError(err);
  }
};

export const getCompanyHandler = async (id) => {
  return assertCompanyExists(id);
};

export const createCompany = async ({ name, address }) => {
  try {
    const coords = await getCoordinates(address);

    const result = await query(
      "INSERT INTO companies (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, coords.latitude, coords.longitude],
    );

    return { id: result.insertId, name, address, ...coords };
  } catch (err) {
    handleDbError(err);
  }
};

export const updateCompanyHandler = async (id, { name, address }) => {
  await assertCompanyExists(id);

  try {
    const coords = address ? await getCoordinates(address) : {};

    await query(
      `UPDATE companies
       SET name = COALESCE(?, name),
           address = COALESCE(?, address),
           latitude = COALESCE(?, latitude),
           longitude = COALESCE(?, longitude)
       WHERE id = ?`,
      [name, address, coords.latitude, coords.longitude, id],
    );

    return "Company updated";
  } catch (err) {
    handleDbError(err);
  }
};

export const deleteCompanyHandler = async (id) => {
  await assertCompanyExists(id);

  try {
    const [{ count }] = await query(
      "SELECT COUNT(*) AS count FROM users WHERE company_id = ?",
      [id],
    );

    if (count > 0) {
      throw createError({
        statusCode: 409,
        statusMessage:
          "Cannot delete company with active users. Migrate or delete users first.",
      });
    }

    await query("DELETE FROM companies WHERE id = ?", [id]);
    return "Company deleted";
  } catch (err) {
    if (err.statusCode) throw err;
    handleDbError(err);
  }
};

/* ================= RELATIONS ================= */
export const addUserToCompany = async (company_id, event) => {
  const userData = await readBody(event);

  await assertCompanyExists(company_id);

  userData.company_id = company_id;

  return createUser(userData);
};

export const removeUserFromCompany = async (company_id, user_id) => {
  await getUserInCompanyOrThrow(company_id, user_id);

  try {
    await query("UPDATE users SET company_id = NULL WHERE id = ?", [user_id]);

    return "User removed from company";
  } catch (err) {
    handleDbError(err);
  }
};
