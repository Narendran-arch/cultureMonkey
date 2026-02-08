import { z } from "zod";

/* ================= CREATE ================= */

export const createUserSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  designation: z.string().min(1).max(150),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  company_id: z.number().int().positive().optional(),
});

/* ================= UPDATE ================= */

export const updateUserSchema = z
  .object({
    first_name: z.string().min(1).optional(),
    last_name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    designation: z.string().min(1).optional(),
    dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  );
