import { z } from 'zod';

export const createCompanySchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().min(1).max(500),
});
export const updateCompanySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});
