import { db } from "@/db";
import { events } from "@/db";
import { desc, eq, gt } from "drizzle-orm";
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
      .where(eq(events.id, id))
      .limit(1);
    return row ? EventSelectSchema.parse(row) : null;
  }

  async listUpcoming(limit: number): Promise<Event[]> {
    const now = new Date();
    const rows = await db
      .select()
      .from(events)
      .where(gt(events.datetime, now))
      .orderBy(desc(events.datetime))
      .limit(limit);
    return rows.map((r) => EventSelectSchema.parse(r));
  }

  async listByOrganizer(organizerId: string, limit?: number): Promise<Event[]> {
    if (typeof limit === "number") {
      const rows = await db
        .select()
        .from(events)
        .where(eq(events.organizerId, organizerId))
        .orderBy(desc(events.datetime))
        .limit(limit);
      return rows.map((r) => EventSelectSchema.parse(r));
    } else {
      const rows = await db
        .select()
        .from(events)
        .where(eq(events.organizerId, organizerId))
        .orderBy(desc(events.datetime));
      return rows.map((r) => EventSelectSchema.parse(r));
    }
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
    await db.delete(events).where(eq(events.id, id));
  }
}
