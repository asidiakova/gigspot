import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { withErrorHandling } from "@/lib/api-handler";
import { z } from "zod";

const RouteContextSchema = z.object({
  params: z.promise(z.object({
    id: z.string(),
  })),
});

export const POST = withErrorHandling(async (req: Request, context: unknown) => {
  const { params } = await RouteContextSchema.parseAsync(context);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventId = params.id;
  const userId = session.user.id;

  const isAttending = await container.reactionRepository.has(userId, eventId);

  if (isAttending) {
    await container.reactionRepository.remove(userId, eventId);
    return NextResponse.json({ attending: false });
  } else {
    await container.reactionRepository.add(userId, eventId);
    return NextResponse.json({ attending: true });
  }
});

