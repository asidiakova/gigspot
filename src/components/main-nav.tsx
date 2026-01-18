"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <div className="pill-nav">
        <Link
          href="/events"
          className={cn(
            "pill-nav-item",
            (pathname === "/events" || pathname === "/") && "active"
          )}
        >
          All Events
        </Link>
        <Link
          href="/events/mine"
          className={cn(
            "pill-nav-item",
            pathname.includes("/events/mine") && "active"
          )}
        >
          My Events
        </Link>
        <Link
          href="/events/following"
          className={cn(
            "pill-nav-item",
            pathname.includes("/events/following") && "active"
          )}
        >
          Following
        </Link>
      </div>
    </nav>
  );
}
