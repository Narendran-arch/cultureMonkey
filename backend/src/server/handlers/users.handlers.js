import { createError } from "h3";
import { query } from "../../db/query.js";

/* ================= HELPERS ================= */

const getUserOrThrow = async (id) => {
  const rows = await query("SELECT * FROM users WHERE id = ?", [id]);

  if (!rows.length) {
    throw createError({
      statusCode: 404,
      statusMessage: "User not found",
    });
  }

  return rows[0];
};

const assertCompanyExists = async (company_id) => {
  if (company_id == null) return;

  const rows = await query("SELECT id FROM companies WHERE id = ?", [
    company_id,
  ]);
  if (rows.length <= 0) {
    throw createError({
      statusCode: 404,
      statusMessage: "Company not found",
    });
  }
};

const handleDbError = (err) => {
  // ✅ If it's already an H3 error, rethrow it
  if (err?.statusCode) {
    throw err;
  }

  // Duplicate email, etc
  if (err?.code === "ER_DUP_ENTRY") {
    throw createError({
      statusCode: 409,
      statusMessage: "Duplicate entry",
    });
  }

  // Fallback: real server error
  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
};

/* ================= CRUD ================= */

export const getUsersHandler = async () => {
  try {
    return await query("SELECT * FROM users");
  } catch (err) {
    handleDbError(err);
  }
};

export const getUserHandler = async (id) => {
  return getUserOrThrow(id);
};

export const createUser = async ({
  first_name,
  last_name,
  email,
  designation,
  dob,
  company_id,
}) => {
  try {
    await assertCompanyExists(company_id);

    const result = await query(
      `INSERT INTO users
       (first_name, last_name, email, designation, dob, company_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, designation, dob, company_id ?? null],
    );

    return {
      id: result.insertId,
      first_name,
      last_name,
      email,
      designation,
      dob,
      company_id,
    };
  } catch (err) {
    handleDbError(err);
  }
};

export const updateUserHandler = async (id, body) => {
  await getUserOrThrow(id);

  const allowedFields = [
    "first_name",
    "last_name",
    "email",
    "designation",
    "dob",
  ];

  const updates = [];
  const values = [];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updates.push(`${field} = ?`);
      values.push(body[field]);
    }
  }

  if (!updates.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "No valid fields to update",
    });
  }

  values.push(id);

  try {
    await query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values);

    return "User updated";
  } catch (err) {
    handleDbError(err);
  }
};

export const deactivateUserHandler = async (id) => {
  await getUserOrThrow(id);

  try {
    await query("UPDATE users SET is_active = FALSE WHERE id = ?", [id]);
    return "User deactivated";
  } catch (err) {
    handleDbError(err);
  }
};

export const deleteUserHandler = async (id) => {
  await getUserOrThrow(id);

  try {
    await query("DELETE FROM users WHERE id = ?", [id]);
    return "User deleted";
  } catch (err) {
    handleDbError(err);
  }
};

/* ================= RELATIONS ================= */

export const migrateUserHandler = async (id, company_id) => {
  await getUserOrThrow(id);
  await assertCompanyExists(company_id);

  try {
    await query("UPDATE users SET company_id = ? WHERE id = ?", [
      company_id,
      id,
    ]);
    return `User migrated to company ${company_id}`;
  } catch (err) {
    handleDbError(err);
  }
};
