import { container } from "@/container";
import { EventCard } from "@/components/event-card";
import { CityFilter } from "@/components/city-filter";

interface PageProps {
  searchParams: Promise<{
    city?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function MainFeed(props: PageProps) {
  const searchParams = await props.searchParams;
  const city = searchParams.city;

  const [events, cities] = await Promise.all([
    container.eventRepository.listUpcoming(50, city),
    container.eventRepository.getUniqueCities(),
  ]);

  return (
    <div className="page-section animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="page-title mb-0">Upcoming events</h1>
        
        <div className="w-full md:w-auto flex flex-col gap-1">
          <span className="text-sm text-muted-foreground ml-1">City</span>
          <CityFilter cities={cities} />
        </div>
      </div>

      {events.length === 0 ? (
        <div className="empty-state py-20">
          <p className="text-lg text-muted-foreground">No upcoming events found.</p>
          {city && (
            <p className="text-sm mt-2 text-muted-foreground">Try selecting a different city.</p>
          )}
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
