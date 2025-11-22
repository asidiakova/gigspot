export interface FollowRepositoryInterface {
  follow(followerId: string, organizerId: string): Promise<void>;
  unfollow(followerId: string, organizerId: string): Promise<void>;
  isFollowing(followerId: string, organizerId: string): Promise<boolean>;
  listOrganizersFollowedBy(userId: string): Promise<string[]>;
}


