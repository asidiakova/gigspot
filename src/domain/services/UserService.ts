import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import {
  UpdateProfileSchema,
  type UpdateProfileInput,
} from "@/domain/validation/user";
import type { User } from "@/domain/entities/User";
import {
  NicknameAlreadyInUseError,
  UserAlreadyDeletedError,
  UserNotFoundError,
} from "@/domain/errors";

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

    const existingByNickname = await this.userRepository.findByNickname(
      parsed.nickname
    );
    if (existingByNickname && existingByNickname.id !== userId) {
      throw new NicknameAlreadyInUseError(parsed.nickname);
    }

    return await this.userRepository.update(userId, {
      nickname: parsed.nickname,
      avatarUrl: parsed.avatarUrl || null,
    });
  }

  async delete(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    if (user.deletedAt) {
      throw new UserAlreadyDeletedError();
    }

    await this.userRepository.delete(userId);
    return;
  }
}

