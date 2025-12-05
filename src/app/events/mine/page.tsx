import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { container } from "@/container";
import { EventCard } from "@/components/event-card";
import { NewEventCard } from "@/components/new-event-card";

export default async function MyEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Events</h1>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-lg">
            To view your events,{" "}
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

  const isOrganizer = session.user.role === "organizer";
  let events;

  if (isOrganizer) {
    events = await container.eventRepository.listByOrganizer(session.user.id);
  } else {
    events = await container.eventRepository.listAttending(session.user.id);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isOrganizer && <NewEventCard />}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
