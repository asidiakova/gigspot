import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { container } from "@/container";
import { EventCard } from "@/components/event-card";
import { redirect } from "next/navigation";

export default async function FollowingEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Following</h1>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-lg">
            To view events from organizers you follow,{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              sign up
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (session.user.role === "organizer") {
    redirect("/events");
  }

  const events = await container.eventRepository.listByFollowedOrganizers(
    session.user.id
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Following</h1>
      {events.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-lg text-muted-foreground">
            No upcoming events from organizers you follow.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Browse{" "}
            <Link href="/events" className="text-blue-600 hover:underline">
              all events
            </Link>{" "}
            to discover new organizers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

