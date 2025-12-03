import { container } from "@/container";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AttendeesPage(props: PageProps) {
  const params = await props.params;
  await getServerSession(authOptions);
  const eventId = params.id;
  const event = await container.eventRepository.findById(eventId);
  if (!event) notFound();

  const attendees = await container.reactionRepository.getAttendants(eventId);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="ghost">
          <Link href={`/events/${eventId}`}>← Back to event</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Attendees</CardTitle>
        </CardHeader>
        <CardContent>
          {attendees.length === 0 ? (
            <p className="text-muted-foreground">Nobody is attending yet.</p>
          ) : (
            <ul className="space-y-3">
              {attendees.map((a) => (
                <li key={a.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={a.avatarUrl ?? undefined} />
                    <AvatarFallback>
                      {a.nickname?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{a.nickname}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

