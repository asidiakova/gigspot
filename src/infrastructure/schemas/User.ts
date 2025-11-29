import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/db";
import { z } from "zod";
import type { UserRole } from "@/domain/entities/User";

export const UserSelectSchema = createSelectSchema(users, {
  createdAt: z.coerce.date(),
});

export const UserInsertSchema = createInsertSchema(users, {
  id: z.string().optional(),
});

const nicknameSchema = z
  .string()
  .trim()
  .min(3, "Nickname must be at least 3 characters")
  .max(20, "Nickname must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers, and underscores"
  );

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const RegisterUserInputSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: passwordSchema,
  nickname: nicknameSchema,
  role: z.custom<UserRole>(
    (val): val is UserRole => val === "user" || val === "organizer"
  ),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

export const UpdateProfileSchema = z.object({
  nickname: nicknameSchema,
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
