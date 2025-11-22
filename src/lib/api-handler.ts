import { NextResponse } from "next/server";
import { DomainError, EmailAlreadyInUseError, NicknameAlreadyInUseError } from "@/domain/errors";
import { z } from "zod";

type ApiHandler = (req: Request) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: Request) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof EmailAlreadyInUseError || error instanceof NicknameAlreadyInUseError) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }

      if (error instanceof DomainError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input", details: error.issues },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

