import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { container } from "@/container";
import { EventForm } from "@/components/event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditEventPage(props: PageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);
  const eventId = params.id;

  if (!session?.user) {
    redirect("/login");
  }

  const event = await container.eventRepository.findById(eventId);

  if (!event) {
    notFound();
  }

  if (event.organizerId !== session.user.id) {
    redirect("/events/mine");
  }

  return (
    <div className="page-section flex justify-center animate-fade-in">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm initialData={event} />
        </CardContent>
      </Card>
    </div>
  );
}

