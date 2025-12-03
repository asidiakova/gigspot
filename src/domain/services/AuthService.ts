import {
  EmailAlreadyInUseError,
  NicknameAlreadyInUseError,
} from "@/domain/errors";
import { IncorrectPasswordError, DomainError } from "@/domain/errors";
import type { User } from "@/domain/entities/User";
import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import type { PasswordHasher } from "./PasswordHasher";
import {
  RegisterUserInputSchema,
  type RegisterUserInput,
  ChangePasswordSchema,
  type ChangePasswordInput,
} from "@/domain/validation/user";

export class AuthService {
  private readonly userRepository: UserRepositoryInterface;
  private readonly passwordHasher: PasswordHasher;

  constructor(deps: {
    userRepository: UserRepositoryInterface;
    passwordHasher: PasswordHasher;
  }) {
    this.userRepository = deps.userRepository;
    this.passwordHasher = deps.passwordHasher;
  }

  async registerUser(input: RegisterUserInput): Promise<User> {
    const parsed = RegisterUserInputSchema.parse(input);

    const existingByEmail = await this.userRepository.findByEmail(parsed.email);
    if (existingByEmail) {
      throw new EmailAlreadyInUseError(parsed.email);
    }

    const existingByNickname = await this.userRepository.findByNickname(
      parsed.nickname
    );
    if (existingByNickname) {
      throw new NicknameAlreadyInUseError(parsed.nickname);
    }

    const passwordHash = await this.passwordHasher.hash(parsed.password);

    return await this.userRepository.create({
      nickname: parsed.nickname,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
      avatarUrl: parsed.avatarUrl || null,
    });
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) {
      return null;
    }

    const isValid = await this.passwordHasher.compare(
      password,
      user.passwordHash
    );
    if (!isValid) {
      return null;
    }

    return user;
  }

  async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<void> {
    const parsed = ChangePasswordSchema.parse(input);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.passwordHasher.compare(
      parsed.currentPassword,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new IncorrectPasswordError();
    }

    if (parsed.newPassword === parsed.currentPassword) {
      throw new DomainError("New password must be different from current password");
    }

    const newPasswordHash = await this.passwordHasher.hash(parsed.newPassword);

    await this.userRepository.update(user.id, {
      passwordHash: newPasswordHash,
    });
  }
}
