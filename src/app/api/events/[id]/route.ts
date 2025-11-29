import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { UpdateEventSchema } from "@/infrastructure/schemas/Event";
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
    const input = UpdateEventSchema.parse(json);

    const updatedData = {
      title: input.title ?? event.title,
      flyerUrl: input.flyerUrl ?? event.flyerUrl,
      datetime: input.datetime ?? event.datetime,
      city: input.city ?? event.city,
      location: input.location ?? event.location,
      price: input.price ?? event.price,
      description: input.description ?? event.description,
      id: eventId,
      organizerId: session.user.id,
    };

    const updatedEvent = await container.eventRepository.upsert(updatedData);

    return NextResponse.json(updatedEvent);
  }
);
