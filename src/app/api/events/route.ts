import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { CreateEventSchema } from "@/infrastructure/schemas/Event";
import { withErrorHandling } from "@/lib/api-handler";

export const POST = withErrorHandling(async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "organizer") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json();
  const input = CreateEventSchema.parse(json);

  const event = await container.eventRepository.upsert({
    ...input,
    organizerId: session.user.id,
  });

  return NextResponse.json(event, { status: 201 });
});
