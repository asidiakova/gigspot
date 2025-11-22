import { z } from "zod";
import {
  EmailAlreadyInUseError,
  NicknameAlreadyInUseError,
} from "@/domain/errors";
import type { User, UserRole } from "@/domain/entities/User";
import type { UserRepositoryInterface } from "@/domain/repositories/UserRepositoryInterface";
import type { PasswordHasher } from "./PasswordHasher";

export const RegisterUserInputSchema = z.object({
  email: z.string().trim().toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  nickname: z
    .string()
    .trim()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
  role: z.custom<UserRole>(
    (val): val is UserRole => val === "user" || val === "organizer"
  ),
  avatarUrl: z.string().optional().or(z.literal("")),
});

export type RegisterUserInput = z.infer<typeof RegisterUserInputSchema>;

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
}
