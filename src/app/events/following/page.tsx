import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import Link from "next/link";
import { container } from "@/container";
import { EventCard } from "@/components/event-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserListItem } from "@/components/user-list-item";

export default async function FollowingPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Following</h1>
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-8 text-center">
          <p className="text-lg">
            Please{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="text-blue-600 hover:underline">
              sign up
            </Link>{" "}
            to continue.
          </p>
        </div>
      </div>
    );
  }

  const isOrganizer = session.user.role === "organizer";

  if (isOrganizer) {
    const followers = await container.followRepository.getFollowers(
      session.user.id
    );

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Your Followers</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {followers.length} {followers.length === 1 ? "follower" : "followers"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {followers.length === 0 ? (
              <p className="text-muted-foreground">
                You don&apos;t have any followers yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {followers.map((f) => (
                  <UserListItem
                    key={f.id}
                    id={f.id}
                    nickname={f.nickname}
                    avatarUrl={f.avatarUrl}
                  />
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    );
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
