import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { events } from "@/db";
import { z } from "zod";
import { eventInputShape } from "@/domain/validation/event";

export const EventSelectSchema = createSelectSchema(events, {
  createdAt: z.coerce.date(),
});

export const EventInsertSchema = createInsertSchema(events, {
  id: z.string().optional(),
  ...eventInputShape,
});
