import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { EventInsertSchema } from "@/infrastructure/schemas/Event";
import { withErrorHandling } from "@/lib/api-handler";
import { z } from "zod";

const RouteContextSchema = z.object({
  params: z.promise(z.object({
    id: z.string(),
  })),
});

export const PATCH = withErrorHandling(async (req: Request, context: unknown) => {
  const { params } = await RouteContextSchema.parseAsync(context);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventId = params.id;
  const event = await container.eventRepository.findById(eventId);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (event.organizerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json();
  
  // Ensure we keep the existing ID and organizerId
  const input = EventInsertSchema.parse({
    ...json,
    id: eventId,
    organizerId: session.user.id,
  });

  const updatedEvent = await container.eventRepository.upsert(input);

  return NextResponse.json(updatedEvent);
});

