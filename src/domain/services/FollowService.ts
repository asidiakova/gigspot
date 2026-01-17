import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import type { FollowRepositoryInterface } from "@/domain/repositories/FollowRepositoryInterface";
import {
  CannotFollowNonOrganizerError,
  CannotFollowSelfError,
  UserNotFoundError,
} from "@/domain/errors";

export class FollowService {
  constructor(
    private readonly followRepository: FollowRepositoryInterface,
    private readonly userRepository: UserRepositoryInterface
  ) {}

  async follow(followerId: string, organizerId: string): Promise<void> {
    if (followerId === organizerId) {
      throw new CannotFollowSelfError();
    }

    const organizer = await this.userRepository.findById(organizerId);
    if (!organizer || organizer.deletedAt) {
      throw new UserNotFoundError(organizerId);
    }

    if (organizer.role !== "organizer") {
      throw new CannotFollowNonOrganizerError();
    }

    await this.followRepository.follow(followerId, organizerId);
  }

  async unfollow(followerId: string, organizerId: string): Promise<void> {
    await this.followRepository.unfollow(followerId, organizerId);
  }

  async isFollowing(followerId: string, organizerId: string): Promise<boolean> {
    return this.followRepository.isFollowing(followerId, organizerId);
  }
}
