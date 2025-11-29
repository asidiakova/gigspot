import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { container } from "@/container";
import { UpdateProfileSchema } from "@/infrastructure/schemas/User";
import { withErrorHandling } from "@/lib/api-handler";

export const PATCH = withErrorHandling(async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const input = UpdateProfileSchema.parse(json);

  await container.userService.updateProfile(session.user.id, input);

  return NextResponse.json({ success: true });
});

