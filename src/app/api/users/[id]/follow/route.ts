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

  const organizerId = params.id;
  const followerId = session.user.id;

  await container.followService.follow(followerId, organizerId);
  return NextResponse.json({ following: true });
});

export const DELETE = withErrorHandling(async (req: Request, context: unknown) => {
  const { params } = await IdParamsSchema.parseAsync(context);
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const organizerId = params.id;
  const followerId = session.user.id;

  await container.followService.unfollow(followerId, organizerId);
  return NextResponse.json({ following: false });
});

