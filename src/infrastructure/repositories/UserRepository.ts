import { db } from "@/db";
import { users } from "@/db";
import { eq, or, ilike } from "drizzle-orm";
import type { User, UserId } from "@/domain/entities/User";
import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import {
  UserInsertSchema,
  UserSelectSchema,
} from "@/infrastructure/schemas/User";
import crypto from "crypto";
import { DomainError } from "@/domain/errors";

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
      .where(
        or(eq(users.nickname, trimmed), ilike(users.email, normalizedEmail))
      )
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

  async update(
    id: UserId,
    input: Partial<Omit<User, "id" | "createdAt">>
  ): Promise<User> {
    const [row] = await db
      .update(users)
      .set({
        nickname: input.nickname,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
        avatarUrl: input.avatarUrl,
        deletedAt: input.deletedAt,
      })
      .where(eq(users.id, id))
      .returning();

    if (!row) {
      throw new Error("User not found");
    }

    return UserSelectSchema.parse(row);
  }

  async delete(id: UserId): Promise<void> {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (!row) {
      throw new Error("User not found");
    }
    const user = UserSelectSchema.parse(row);

    const suffix = this.generateRandomSuffix(12);
    const anonymizedNickname = `${user.nickname}_${suffix}_deleted`;
    const anonymizedEmail = this.anonymizeEmailLocalPart(user.email, suffix);
    try {
      await db
        .update(users)
        .set({
          nickname: anonymizedNickname,
          email: anonymizedEmail,
          deletedAt: new Date(),
        })
        .where(eq(users.id, id));
      return;
    } catch {
      throw new DomainError("User deletion failed");
    }
  }

  private generateRandomSuffix(length: number): string {
    const bytes = crypto.randomBytes(Math.ceil((length * 3) / 4));
    return bytes
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "")
      .slice(0, length);
  }

  private anonymizeEmailLocalPart(email: string, suffix: string): string {
    const atIndex = email.indexOf("@");
    if (atIndex === -1) {
      return `${email}_${suffix}_deleted`;
    }
    const local = email.slice(0, atIndex);
    const domain = email.slice(atIndex + 1);
    return `${local}+${suffix}_deleted@${domain}`;
  }
}
