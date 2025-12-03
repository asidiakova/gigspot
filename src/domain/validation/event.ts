import { z } from "zod";

export const eventInputShape = {
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  datetime: z.coerce.date(),
  city: z.string().min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  price: z.string().min(1, "Price is required"),
  flyerUrl: z.string().optional().or(z.literal("")),
} as const;

export const CreateEventInputSchema = z.object(eventInputShape);
export const UpdateEventInputSchema = CreateEventInputSchema.partial();
