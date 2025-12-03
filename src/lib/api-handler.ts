import { NextResponse } from "next/server";
import { DomainError, EmailAlreadyInUseError, NicknameAlreadyInUseError, EventNotFoundError } from "@/domain/errors";
import { z } from "zod";

type ApiHandler = (req: Request, ...args: unknown[]) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: Request, ...args: unknown[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      console.error("API Error:", error);

      if (error instanceof EmailAlreadyInUseError || error instanceof NicknameAlreadyInUseError) {
        return NextResponse.json({ error: error.message }, { status: 409 });
      }

      if (error instanceof EventNotFoundError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error instanceof DomainError) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      if (error instanceof z.ZodError) {
        const message = error.issues[0]?.message || "Invalid input";
        return NextResponse.json(
          { error: message, details: error.issues },
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

