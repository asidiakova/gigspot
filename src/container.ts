import { AuthService } from "@/domain/services/AuthService";
import { UserService } from "@/domain/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { EventRepository } from "@/infrastructure/repositories/EventRepository";
import { ReactionRepository } from "@/infrastructure/repositories/ReactionRepository";
import { BcryptPasswordHasher } from "@/infrastructure/security/BcryptPasswordHasher";
import { config } from "@/config";
import { EventService } from "@/domain/services/EventService";
import { AttendanceService } from "@/domain/services/AttendanceService";

// Infrastructure
const userRepository = new UserRepository();
const eventRepository = new EventRepository();
const reactionRepository = new ReactionRepository();
const passwordHasher = new BcryptPasswordHasher(config.auth.saltRounds);

// Domain
const authService = new AuthService({
  userRepository,
  passwordHasher,
});

const userService = new UserService({
  userRepository,
});

const eventService = new EventService({
  eventRepository,
});

const attendanceService = new AttendanceService({
  eventRepository,
  reactionRepository,
});

// DI Container
export const container = {
  authService,
  userService,
  eventService,
  attendanceService,
  userRepository,
  eventRepository,
  reactionRepository,
  passwordHasher,
};
