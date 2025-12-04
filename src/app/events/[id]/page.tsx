import { notFound } from "next/navigation";
import { container } from "@/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import Link from "next/link";
import { AttendButton } from "@/components/attend-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventDetailsPage(props: PageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const eventId = params.id;

  const event = await container.eventRepository.findById(eventId);
  if (!event) {
    notFound();
  }

  const isEventOwner = session?.user?.id === event.organizerId;
  const isOrganizerRole = session?.user?.role === "organizer";
  const isAttending = session?.user?.id
    ? await container.reactionRepository.has(session.user.id, eventId)
    : false;

  const attendantsCount =
    await container.reactionRepository.countForEvent(eventId);
  const recentAttendants =
    await container.reactionRepository.getRecentAttendants(eventId, 3);

  const isEventInPast = new Date(event.datetime) < new Date();

  let attendingText;
  if (attendantsCount === 0) {
    attendingText = "Nobody is attending yet";
  } else {
    const names = recentAttendants.map((a) => a.nickname).join(", ");
    const remaining = attendantsCount - recentAttendants.length;

    attendingText =
      remaining > 0
        ? `${names}, and ${remaining} more are attending`
        : attendantsCount > 1
          ? `${names} are attending`
          : `${names} is attending`;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{event.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Details */}
        <div className="space-y-6">
          {/* Description Box */}
          <div className="bg-muted/50 rounded-lg p-6 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {event.description}
          </div>

          {/* Info Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <CalendarIcon className="h-5 w-5" />
              <span className="text-lg">
                {new Date(event.datetime).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-base py-1 px-3 gap-2">
                <MapPinIcon className="h-4 w-4" />
                {event.location}, {event.city}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-base py-1 px-3 gap-2">
                <TicketIcon className="h-4 w-4" />
                {event.price}
              </Badge>
            </div>
          </div>

          {/* Attendants Section */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex -space-x-3">
              {recentAttendants.map((attendant, i) => (
                <Avatar
                  key={i}
                  className="border-2 border-background w-10 h-10"
                >
                  <AvatarImage src={attendant.avatarUrl ?? undefined} />
                  <AvatarFallback>
                    {attendant.nickname[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {attendantsCount === 0 && (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground border-2 border-background">
                  0
                </div>
              )}
            </div>
            <div className="text-sm">
              {attendantsCount > 0 ? (
                <Link
                  href={`/events/${eventId}/attendees`}
                  className="text-muted-foreground hover:underline"
                >
                  {attendingText}
                </Link>
              ) : (
                <p className="text-muted-foreground">{attendingText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Image & Action */}
        <div className="space-y-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-muted border">
            {event.flyerUrl ? (
              <Image
                src={event.flyerUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No Flyer Image
              </div>
            )}
          </div>

          <div className="flex justify-start">
            {isEventOwner ? (
              <Button asChild className="w-full md:w-auto">
                <Link href={`/events/${eventId}/edit`}>Edit Event</Link>
              </Button>
            ) : session?.user ? (
              !isOrganizerRole && (
                <AttendButton
                  eventId={eventId}
                  initialIsAttending={isAttending}
                  isPastEvent={isEventInPast}
                />
              )
            ) : (
              <Button asChild className="w-full md:w-auto">
                <Link href="/login">Login to Attend</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
