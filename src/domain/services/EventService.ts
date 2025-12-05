import type { Event } from "@/domain/entities/Event";
import type { EventRepositoryInterface } from "@/domain/repositories/EventRepositoryInterface";
import {
  CreateEventInputSchema,
  UpdateEventInputSchema,
} from "@/domain/validation/event";
import {
  EventAlreadyStartedError,
  EventNotFoundError,
  UnauthorizedError,
} from "@/domain/errors";
import type { z } from "zod";

type CreateEventInput = z.infer<typeof CreateEventInputSchema>;
type UpdateEventInput = z.infer<typeof UpdateEventInputSchema>;

export class EventService {
  private readonly eventRepository: EventRepositoryInterface;

  constructor(deps: { eventRepository: EventRepositoryInterface }) {
    this.eventRepository = deps.eventRepository;
  }

  async createEvent(organizerId: string, input: CreateEventInput): Promise<Event> {
    const parsed = CreateEventInputSchema.parse(input);
    return await this.eventRepository.upsert({
      organizerId,
      title: parsed.title,
      flyerUrl: parsed.flyerUrl,
      datetime: parsed.datetime,
      city: parsed.city,
      location: parsed.location,
      price: parsed.price,
      description: parsed.description,
    });
  }

  async updateEvent(event: Event, input: UpdateEventInput): Promise<Event> {
    const now = new Date();
    now.setHours(0, 0, 0, 0); 
    if (event.datetime < now) {
      throw new EventAlreadyStartedError();
    }

    const parsed = UpdateEventInputSchema.parse(input);
    return await this.eventRepository.upsert({
      id: event.id,
      organizerId: event.organizerId,
      title: parsed.title ?? event.title,
      flyerUrl: parsed.flyerUrl ?? event.flyerUrl ?? undefined,
      datetime: parsed.datetime ?? event.datetime,
      city: parsed.city ?? event.city,
      location: parsed.location ?? event.location,
      price: parsed.price ?? event.price,
      description: parsed.description ?? event.description,
    });
  }

  async deleteEvent(userId: string, eventId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    if (event.organizerId !== userId) {
      throw new UnauthorizedError();
    }

    await this.eventRepository.delete(eventId);
  }
}

