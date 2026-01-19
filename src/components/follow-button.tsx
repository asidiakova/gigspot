"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus, UserCheck } from "lucide-react";

interface FollowButtonProps {
  organizerId: string;
  initialIsFollowing: boolean;
}

export function FollowButton({
  organizerId,
  initialIsFollowing,
}: FollowButtonProps) {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${organizerId}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data?.error || "Something went wrong");
        return;
      }

      const data = await res.json();
      setIsFollowing(data.following);

      if (data.following) {
        toast.success("You are now following this organizer");
      } else {
        toast.success("You unfollowed this organizer");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isLoading}
      variant={isFollowing ? "secondary" : "default"}
    >
      {isFollowing ? (
        <>
          <UserCheck className="mr-2 h-4 w-4" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Follow
        </>
      )}
    </Button>
  );
}

