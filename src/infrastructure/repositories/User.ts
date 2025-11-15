import { db } from "@/db";
import { users } from "@/db";
import { eq } from "drizzle-orm";
import type { User, UserId } from "@/domain/entities/User";
import type { UserRepositoryInterface } from "@/domain/repositories/User";
import {
  UserInsertSchema,
  UserSelectSchema,
} from "@/infrastructure/schemas/User";
import { randomUUID } from "node:crypto";

export class UserRepository implements UserRepositoryInterface {
  async findById(id: UserId): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return row ? UserSelectSchema.parse(row) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return row ? UserSelectSchema.parse(row) : null;
  }

  async upsert(
    input: { id?: UserId } & Omit<User, "id" | "createdAt">
  ): Promise<User> {
    const id = input.id ?? randomUUID();
    const values = UserInsertSchema.parse({
      id,
      nickname: input.nickname,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      avatarUrl: input.avatarUrl ?? null,
    });
    const [row] = await db
      .insert(users)
      .values(values)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          nickname: values.nickname,
          email: values.email,
          passwordHash: values.passwordHash,
          role: values.role,
          avatarUrl: values.avatarUrl ?? null,
        },
      })
      .returning();
    return UserSelectSchema.parse(row);
  }

  async delete(id: UserId): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
