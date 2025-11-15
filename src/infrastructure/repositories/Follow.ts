import { db } from "@/db";
import { follows } from "@/db";
import { and, eq } from "drizzle-orm";
import type { FollowRepositoryInterface } from "@/domain/repositories/Follow";

export class FollowRepository implements FollowRepositoryInterface {
  async follow(followerId: string, organizerId: string): Promise<void> {
    await db
      .insert(follows)
      .values({ followerId, organizerId })
      .onConflictDoNothing({
        target: [follows.followerId, follows.organizerId],
      });
  }

  async unfollow(followerId: string, organizerId: string): Promise<void> {
    await db
      .delete(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.organizerId, organizerId)
        )
      );
  }

  async isFollowing(followerId: string, organizerId: string): Promise<boolean> {
    const rows = await db
      .select({ exists: follows.followerId })
      .from(follows)
      .where(
        and(
          eq(follows.followerId, followerId),
          eq(follows.organizerId, organizerId)
        )
      )
      .limit(1);
    return rows.length > 0;
  }

  async listOrganizersFollowedBy(userId: string): Promise<string[]> {
    const rows = await db
      .select({ organizerId: follows.organizerId })
      .from(follows)
      .where(eq(follows.followerId, userId));
    return rows.map((r) => r.organizerId);
  }
}
