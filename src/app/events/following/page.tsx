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
      <div className="page-section">
        <h1 className="page-title">Following</h1>
        <div className="empty-state">
          <p className="auth-prompt">
            Please{" "}
            <Link href="/login" className="link-styled">
              log in
            </Link>{" "}
            or{" "}
            <Link href="/signup" className="link-styled">
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
      <div className="page-section animate-fade-in">
        <h1 className="page-title">Your Followers</h1>
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
    <div className="page-section animate-fade-in">
      <h1 className="page-title">Following</h1>
      {events.length === 0 ? (
        <div className="empty-state">
          <p className="text-lg text-muted-foreground">
            No upcoming events from organizers you follow.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Browse{" "}
            <Link href="/events" className="link-styled">
              all events
            </Link>{" "}
            to discover new organizers.
          </p>
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
