import { z } from "zod";
import type { UserRole } from "@/domain/entities/User";

export const registerUserInputShape = {
  email: z.string().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  nickname: z
    .string()
    .trim()
    .min(3, "Nickname must be at least 3 characters")
    .max(20, "Nickname must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  role: z.custom<UserRole>(
    (val): val is UserRole => val === "user" || val === "organizer"
  ),
  avatarUrl: z.string().optional().or(z.literal("")),
} as const;

export const RegisterUserInputSchema = z.object(registerUserInputShape);
export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

export const updateProfileInputShape = {
  nickname: registerUserInputShape.nickname,
  avatarUrl: registerUserInputShape.avatarUrl,
} as const;

export const UpdateProfileSchema = z.object(updateProfileInputShape);
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const changePasswordInputShape = {
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: registerUserInputShape.password,
} as const;

export const ChangePasswordSchema = z.object(changePasswordInputShape);
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
