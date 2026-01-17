import { AuthService } from "@/domain/services/AuthService";
import { UserService } from "@/domain/services/UserService";
import { UserRepository } from "@/infrastructure/repositories/UserRepository";
import { EventRepository } from "@/infrastructure/repositories/EventRepository";
import { ReactionRepository } from "@/infrastructure/repositories/ReactionRepository";
import { FollowRepository } from "@/infrastructure/repositories/FollowRepository";
import { BcryptPasswordHasher } from "@/infrastructure/security/BcryptPasswordHasher";
import { config } from "@/config";
import { EventService } from "@/domain/services/EventService";
import { AttendanceService } from "@/domain/services/AttendanceService";
import { FollowService } from "@/domain/services/FollowService";

// Infrastructure
const userRepository = new UserRepository();
const eventRepository = new EventRepository();
const reactionRepository = new ReactionRepository();
const followRepository = new FollowRepository();
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

const followService = new FollowService(followRepository, userRepository);

export const container = {
  authService,
  userService,
  eventService,
  attendanceService,
  followService,
  userRepository,
  eventRepository,
  reactionRepository,
  followRepository,
  passwordHasher,
};
