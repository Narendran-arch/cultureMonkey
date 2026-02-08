import { createError } from "h3";

export const handleDbError = (err) => {
  // If already an H3 error, rethrow
  if (err?.statusCode) {
    throw err;
  }

  if (err?.code === "ER_DUP_ENTRY") {
    throw createError({
      statusCode: 409,
      statusMessage: "Duplicate entry",
    });
  }

  if (err?.code === "ER_ROW_IS_REFERENCED_2") {
    throw createError({
      statusCode: 409,
      statusMessage: "Resource is in use",
    });
  }

  throw createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
  });
};
