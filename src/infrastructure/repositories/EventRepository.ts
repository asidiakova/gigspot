import { db } from "@/db";
import { events, reactions } from "@/db";
import { desc, eq, gte, and, asc, isNull } from "drizzle-orm";
import type { Event, EventId } from "@/domain/entities/Event";
import type { EventRepositoryInterface } from "@/domain/repositories/EventRepositoryInterface";
import {
  EventInsertSchema,
  EventSelectSchema,
} from "@/infrastructure/schemas/Event";
import { randomUUID } from "node:crypto";

export class EventRepository implements EventRepositoryInterface {
  async findById(id: EventId): Promise<Event | null> {
    const [row] = await db
      .select()
      .from(events)
      .where(and(eq(events.id, id), isNull(events.deletedAt)))
      .limit(1);
    return row ? EventSelectSchema.parse(row) : null;
  }

  async listUpcoming(limit: number, city?: string): Promise<Event[]> {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today

    const conditions = [gte(events.datetime, now), isNull(events.deletedAt)];
    if (city) {
      conditions.push(eq(events.city, city));
    }

    const rows = await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(asc(events.datetime))
      .limit(limit);
    return rows.map((r) => EventSelectSchema.parse(r));
  }

  async listByOrganizer(organizerId: string, limit?: number): Promise<Event[]> {
    if (typeof limit === "number") {
      const rows = await db
        .select()
        .from(events)
        .where(and(eq(events.organizerId, organizerId), isNull(events.deletedAt)))
        .orderBy(desc(events.datetime))
        .limit(limit);
      return rows.map((r) => EventSelectSchema.parse(r));
    } else {
      const rows = await db
        .select()
        .from(events)
        .where(and(eq(events.organizerId, organizerId), isNull(events.deletedAt)))
        .orderBy(desc(events.datetime));
      return rows.map((r) => EventSelectSchema.parse(r));
    }
  }

  async listAttending(userId: string): Promise<Event[]> {
    const rows = await db
      .select()
      .from(events)
      .innerJoin(reactions, eq(events.id, reactions.eventId))
      .where(and(eq(reactions.userId, userId), isNull(events.deletedAt)))
      .orderBy(desc(events.datetime));

    return rows.map((row) => EventSelectSchema.parse(row.events));
  }

  async upsert(
    input: { id?: EventId } & Omit<Event, "id" | "createdAt">
  ): Promise<Event> {
    const id = input.id ?? randomUUID();
    const values = EventInsertSchema.parse({
      id,
      organizerId: input.organizerId,
      title: input.title,
      flyerUrl: input.flyerUrl ?? null,
      datetime: input.datetime,
      city: input.city,
      location: input.location,
      price: input.price,
      description: input.description,
    });
    const [row] = await db
      .insert(events)
      .values(values)
      .onConflictDoUpdate({
        target: events.id,
        set: {
          organizerId: values.organizerId,
          title: values.title,
          flyerUrl: values.flyerUrl ?? null,
          datetime: values.datetime,
          city: values.city,
          location: values.location,
          price: values.price,
          description: values.description,
        },
      })
      .returning();
    return EventSelectSchema.parse(row);
  }

  async delete(id: EventId): Promise<void> {
    await db
      .update(events)
      .set({ deletedAt: new Date() })
      .where(eq(events.id, id));
  }

  async getUniqueCities(): Promise<string[]> {
    const rows = await db
      .selectDistinct({ city: events.city })
      .from(events)
      .where(isNull(events.deletedAt))
      .orderBy(events.city);
    return rows.map((r) => r.city).filter(Boolean);
  }
}
