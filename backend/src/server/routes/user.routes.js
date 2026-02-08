import { createRouter, createError, readBody } from "h3";

import {
  createUser,
  getUsersHandler,
  getUserHandler,
  updateUserHandler,
  deactivateUserHandler,
  deleteUserHandler,
  migrateUserHandler,
} from "../handlers/users.handlers.js";
import { validate } from "../../utils/validate.js";
import { createUserSchema, updateUserSchema } from "../validators/user.schema.js";
const router = createRouter();

/* ============================
   USERS
============================ */

// CREATE USER
router.post("/users", async (event) => {
  const body = await readBody(event);
  const data = validate(createUserSchema, body);
  return createUser(data);
});

// UPDATE USER
router.put("/users/:id", async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  const data = validate(updateUserSchema, body);
  return updateUserHandler(id, data);
});

// LIST USERS
router.get("/users", () => getUsersHandler());

// GET USER BY ID
router.get("/users/:id", (event) => {
  const { id } = event.context.params;
  return getUserHandler(id);
});


// DEACTIVATE USER
router.patch("/users/:id/deactivate", (event) => {
  const { id } = event.context.params;
  return deactivateUserHandler(id);
});

// MIGRATE USER
router.patch("/users/:id/migrate", async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);

  if (!body.company_id) {
    throw createError({
      statusCode: 400,
      statusMessage: "company_id is required",
    });
  }

  return migrateUserHandler(id, body.company_id);
});

// DELETE USER
router.delete("/users/:id", (event) => {
  const { id } = event.context.params;
  return deleteUserHandler(id);
});

export default router;
