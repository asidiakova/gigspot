import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { UserNav } from "@/components/user-nav";
import { MainNav } from "@/components/main-nav";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Podcast } from "lucide-react";

export default async function MainHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b bg-background">
      <div className="relative">
        <div className="flex h-16 items-center px-4 md:px-6 justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity"
            >
              <Podcast className="h-6 w-6 text-[#1764d9]" />
              <span>GigSpot</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session?.user ? (
              <UserNav user={session.user} />
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 pb-2 md:pb-0 md:px-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex justify-center">
          <MainNav />
        </div>
      </div>
    </header>
  );
}
