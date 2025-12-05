import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { IdParamsSchema } from "@/infrastructure/schemas/shared";
import { withErrorHandling } from "@/lib/api-handler";

export const PATCH = withErrorHandling(
  async (req: Request, context: unknown) => {
    const { params } = await IdParamsSchema.parseAsync(context);
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
    const updatedEvent = await container.eventService.updateEvent(event, json);

    return NextResponse.json(updatedEvent);
  }
);

export const DELETE = withErrorHandling(
  async (req: Request, context: unknown) => {
    const { params } = await IdParamsSchema.parseAsync(context);
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await container.eventService.deleteEvent(session.user.id, params.id);

    return NextResponse.json({ success: true });
  }
);
