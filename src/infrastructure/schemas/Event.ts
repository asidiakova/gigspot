import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { events } from "@/db";
import { z } from "zod";

export const EventSelectSchema = createSelectSchema(events, {
  datetime: z.coerce.date(),
  createdAt: z.coerce.date(),
});

export const EventInsertSchema = createInsertSchema(events, {
  id: z.string().optional(),
  datetime: z.coerce.date(),
});
