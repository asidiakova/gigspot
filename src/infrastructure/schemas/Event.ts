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
  title: z.string().min(3, "Title must be at least 3 characters"),
  flyerUrl: z.string().optional().or(z.literal("")),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export const CreateEventSchema = EventInsertSchema.omit({
  id: true,
  organizerId: true,
  createdAt: true,
});

export const UpdateEventSchema = CreateEventSchema.partial();
