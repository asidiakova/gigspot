import { db } from "@/db";
import { users } from "@/db";
import { eq, or, ilike } from "drizzle-orm";
import type { User, UserId } from "@/domain/entities/User";
import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import {
  UserInsertSchema,
  UserSelectSchema,
} from "@/infrastructure/schemas/User";

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

  async findByNickname(nickname: string): Promise<User | null> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.nickname, nickname))
      .limit(1);
    return row ? UserSelectSchema.parse(row) : null;
  }

  async findByEmailOrNickname(identifier: string): Promise<User | null> {
    const trimmed = identifier.trim();
    const normalizedEmail = trimmed.toLowerCase();
    const [row] = await db
      .select()
      .from(users)
      .where(or(eq(users.nickname, trimmed), ilike(users.email, normalizedEmail)))
      .limit(1);
    return row ? UserSelectSchema.parse(row) : null;
  }

  async create(input: Omit<User, "id" | "createdAt">): Promise<User> {
    const values = UserInsertSchema.parse({
      nickname: input.nickname,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role,
      avatarUrl: input.avatarUrl ?? null,
    });
    const [row] = await db.insert(users).values(values).returning();
    return UserSelectSchema.parse(row);
  }

  async update(id: UserId, input: Partial<Omit<User, "id" | "createdAt">>): Promise<User> {
    const [row] = await db
      .update(users)
      .set({
        nickname: input.nickname,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
        avatarUrl: input.avatarUrl,
      })
      .where(eq(users.id, id))
      .returning();
    
    if (!row) {
      throw new Error("User not found");
    }

    return UserSelectSchema.parse(row);
  }

  async delete(id: UserId): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}
