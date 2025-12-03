import { NextResponse } from "next/server";
import { RegisterUserInputSchema } from "@/domain/validation/user";
import { withErrorHandling } from "@/lib/api-handler";
import { container } from "@/container";

export const POST = withErrorHandling(async (req: Request) => {
  const json = await req.json();
  const input = RegisterUserInputSchema.parse(json);

  await container.authService.registerUser(input);

  return NextResponse.json({ success: true }, { status: 201 });
});
