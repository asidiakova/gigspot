import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { users } from "@/db";
import { z } from "zod";
export type {
  RegisterUserInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "@/domain/validation/user";

export const UserSelectSchema = createSelectSchema(users, {
  createdAt: z.coerce.date(),
});

export const UserInsertSchema = createInsertSchema(users, {
  id: z.string().optional(),
});
