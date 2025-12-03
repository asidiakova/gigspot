import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { withErrorHandling } from "@/lib/api-handler";
import { IdParamsSchema } from "@/infrastructure/schemas/shared";

export const POST = withErrorHandling(async (req: Request, context: unknown) => {
  const { params } = await IdParamsSchema.parseAsync(context);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventId = params.id;
  const userId = session.user.id;

  await container.attendanceService.attend(userId, session.user.role, eventId);
  return NextResponse.json({ attending: true });
});

export const DELETE = withErrorHandling(async (req: Request, context: unknown) => {
  const { params } = await IdParamsSchema.parseAsync(context);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const eventId = params.id;
  const userId = session.user.id;

  await container.attendanceService.unattend(userId, eventId);
  return NextResponse.json({ attending: false });
});

