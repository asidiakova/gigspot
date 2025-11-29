import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import {
  UpdateProfileSchema,
  type UpdateProfileInput,
} from "@/infrastructure/schemas/User";
import type { User } from "@/domain/entities/User";

export class UserService {
  private readonly userRepository: UserRepositoryInterface;

  constructor(deps: { userRepository: UserRepositoryInterface }) {
    this.userRepository = deps.userRepository;
  }

  async updateProfile(
    userId: string,
    input: UpdateProfileInput
  ): Promise<User> {
    const parsed = UpdateProfileSchema.parse(input);

    return await this.userRepository.update(userId, {
      nickname: parsed.nickname,
      avatarUrl: parsed.avatarUrl || null,
    });
  }
}

