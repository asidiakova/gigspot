import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { container } from "@/container";
import { EventCard } from "@/components/event-card";
import { NewEventCard } from "@/components/new-event-card";

export default async function MyEventsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
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
