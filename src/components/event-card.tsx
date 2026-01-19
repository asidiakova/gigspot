import { Event } from "@/domain/entities/Event";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden card-hover">
      <div className="event-card-image">
        {event.flyerUrl ? (
          <Image
            src={event.flyerUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="no-image-placeholder">No Image</div>
        )}
      </div>
      <CardHeader>
        <CardTitle className="truncate pb-0.5">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-2 text-sm">
        <p className="line-clamp-2 text-muted-foreground">
          {event.description}
        </p>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>
            {new Date(event.datetime).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}, {event.city}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4">
        <Badge variant="secondary" className="flex items-center gap-1 max-w-[50%]">
          <TicketIcon className="h-3 w-3 shrink-0" />
          <span className="truncate">{event.price}</span>
        </Badge>
        <Button asChild size="sm">
          <Link href={`/events/${event.id}`}>Show more...</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

