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
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Upcoming events</h1>
        
        <div className="w-full md:w-auto flex flex-col gap-1">
          <span className="text-sm text-muted-foreground ml-1">City</span>
          <CityFilter cities={cities} />
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <p className="text-lg">No upcoming events found.</p>
          {city && (
            <p className="text-sm mt-2">Try selecting a different city.</p>
          )}
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
