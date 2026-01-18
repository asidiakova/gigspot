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
      <div className="page-section">
        <h1 className="page-title">My Events</h1>
        <div className="empty-state">
          <p className="auth-prompt">
            To view your events,{" "}
            <Link href="/login" className="link-styled">
              log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="link-styled">
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
    <div className="page-section animate-fade-in">
      <h1 className="page-title">My Events</h1>
      <div className="events-grid">
        {isOrganizer && <NewEventCard />}
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
