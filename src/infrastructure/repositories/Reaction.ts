import { db } from "@/db";
import { reactions } from "@/db";
import { and, count, eq } from "drizzle-orm";
import type { ReactionRepositoryInterface } from "@/domain/repositories/Reaction";

export class ReactionRepository implements ReactionRepositoryInterface {
  async add(userId: string, eventId: string): Promise<void> {
    await db
      .insert(reactions)
      .values({ userId, eventId })
      .onConflictDoNothing({ target: [reactions.userId, reactions.eventId] });
  }

  async remove(userId: string, eventId: string): Promise<void> {
    await db
      .delete(reactions)
      .where(and(eq(reactions.userId, userId), eq(reactions.eventId, eventId)));
  }

  async has(userId: string, eventId: string): Promise<boolean> {
    const rows = await db
      .select({ exists: reactions.userId })
      .from(reactions)
      .where(and(eq(reactions.userId, userId), eq(reactions.eventId, eventId)))
      .limit(1);
    return rows.length > 0;
  }

  async countForEvent(eventId: string): Promise<number> {
    const [row] = await db
      .select({ value: count() })
      .from(reactions)
      .where(eq(reactions.eventId, eventId));
    return Number(row?.value ?? 0);
  }
}
