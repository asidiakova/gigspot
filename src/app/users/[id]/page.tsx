import { container } from "@/container";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FollowButton } from "@/components/follow-button";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserProfilePage(props: PageProps) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  if (session?.user?.id === params.id) {
    redirect("/profile");
  }

  const user = await container.userRepository.findById(params.id);

  if (!user || user.deletedAt) {
    notFound();
  }

  const isOrganizer = user.role === "organizer";
  const canFollow = session?.user?.id && isOrganizer;
  const isFollowing = canFollow
    ? await container.followService.isFollowing(session.user.id, user.id)
    : false;

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader className="flex flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.nickname} />
            <AvatarFallback className="text-2xl">
              {user.nickname[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{user.nickname}</CardTitle>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Member since {user.createdAt.toLocaleDateString()}
          </p>
          {canFollow && (
            <FollowButton
              organizerId={user.id}
              initialIsFollowing={isFollowing}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

