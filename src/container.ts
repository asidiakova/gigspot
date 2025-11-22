import { AuthService } from "@/domain/services/AuthService";
import { UserService } from "@/domain/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { BcryptPasswordHasher } from "@/infrastructure/security/BcryptPasswordHasher";
import { config } from "@/config";

// Infrastructure
const userRepository = new UserRepository();
const passwordHasher = new BcryptPasswordHasher(config.auth.saltRounds);

// Domain
const authService = new AuthService({
  userRepository,
  passwordHasher,
});

const userService = new UserService({
  userRepository,
});

// DI Container
export const container = {
  authService,
  userService,
  userRepository,
  passwordHasher,
};
