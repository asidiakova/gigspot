import { AuthService } from "@/domain/services/AuthService";
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

// DI Container
export const container = {
  authService,
};
