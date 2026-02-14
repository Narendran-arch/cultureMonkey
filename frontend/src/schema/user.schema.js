import { z } from "zod";

export const userSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  date_of_birth: z.string().min(1, "Date of birth is required"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required")
    .min(2, "Designation must be at least 2 characters"),

  company_id: z.string().min(1, "Company is required"),
});

export const updateUserSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  date_of_birth: z.string().min(1, "Date of birth is required"),

  designation: z
    .string()
    .trim()
    .min(1, "Designation is required")
    .min(2, "Designation must be at least 2 characters"),
});

export const migrateUserSchema = z.object({
  company_id: z.string().min(1, "Company is required"),
});
