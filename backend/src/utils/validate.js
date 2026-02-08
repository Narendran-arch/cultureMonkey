import { createError } from "h3";

export const validate = (schema, data) => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Validation error",
      data: result.error.flatten(),
    });
  }

  return result.data; // sanitized & typed
};
