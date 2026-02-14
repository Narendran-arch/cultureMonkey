import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters"),
});
