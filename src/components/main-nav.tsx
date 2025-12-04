"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
      <div className="flex items-center bg-muted rounded-full p-1">
        <Link
          href="/events"
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            pathname === "/events" || pathname === "/"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          All Events
        </Link>
        <Link
          href="/events/mine"
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
            pathname.includes("/events/mine")
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          My Events
        </Link>
      </div>
    </nav>
  );
}
