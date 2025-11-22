import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function MainHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header>
      <NavigationMenu>
        <NavigationMenuList className="flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link href={"/events"}>Events</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          {!session ? (
            <>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={"/login"}>Login</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={"/signup"}>Sign up</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </>
          ) : (
            <>
              <NavigationMenuItem>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold ml-2">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <LogoutButton className={navigationMenuTriggerStyle()} />
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
