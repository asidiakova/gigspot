import { db } from "@/db";
import { follows, users } from "@/db";
import { and, eq } from "drizzle-orm";
import type { FollowRepositoryInterface } from "@/domain/repositories/FollowRepositoryInterface";

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

  async getFollowers(
    organizerId: string
  ): Promise<{ id: string; nickname: string; avatarUrl: string | null }[]> {
    const rows = await db
      .select({
        id: users.id,
        nickname: users.nickname,
        avatarUrl: users.avatarUrl,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(eq(follows.organizerId, organizerId));
    return rows;
  }
}
