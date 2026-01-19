export interface FollowRepositoryInterface {
  follow(followerId: string, organizerId: string): Promise<void>;
  unfollow(followerId: string, organizerId: string): Promise<void>;
  isFollowing(followerId: string, organizerId: string): Promise<boolean>;
  getFollowers(
    organizerId: string
  ): Promise<{ id: string; nickname: string; avatarUrl: string | null }[]>;
}
