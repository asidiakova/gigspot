import type { Event, EventId } from "../entities/Event";

export interface EventRepositoryInterface {
  findById(id: EventId): Promise<Event | null>;
  listUpcoming(limit: number, city?: string): Promise<Event[]>;
  listByOrganizer(organizerId: string, limit?: number): Promise<Event[]>;
  listAttending(userId: string): Promise<Event[]>;
  upsert(input: { id?: EventId } & Omit<Event, "id" | "createdAt">): Promise<Event>;
  delete(id: EventId): Promise<void>;
  getUniqueCities(): Promise<string[]>;
}
