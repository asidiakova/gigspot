import type { UserRole } from "@/domain/entities/User";
import type { EventRepositoryInterface } from "@/domain/repositories/EventRepositoryInterface";
import type { ReactionRepositoryInterface } from "@/domain/repositories/ReactionRepositoryInterface";
import { DomainError, EventInPastError, EventNotFoundError } from "@/domain/errors";

export class AttendanceService {
  private readonly eventRepository: EventRepositoryInterface;
  private readonly reactionRepository: ReactionRepositoryInterface;

  constructor(deps: {
    eventRepository: EventRepositoryInterface;
    reactionRepository: ReactionRepositoryInterface;
  }) {
    this.eventRepository = deps.eventRepository;
    this.reactionRepository = deps.reactionRepository;
  }

  async attend(userId: string, userRole: UserRole, eventId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    if (userRole === "organizer") {
      throw new DomainError("Organizers cannot attend events");
    }

    const now = new Date();
    if (event.datetime <= now) {
      throw new EventInPastError();
    }

    await this.reactionRepository.add(userId, eventId);
  }

  async unattend(userId: string, eventId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }
    await this.reactionRepository.remove(userId, eventId);
  }
}

