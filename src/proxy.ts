import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    if (
      req.nextUrl.pathname.startsWith("/organizer") &&
      req.nextauth.token?.role !== "organizer"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/organizer/:path*", "/profile/:path*"],
};
