"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AttendeeItemProps {
  id: string;
  nickname: string;
  avatarUrl: string | null;
}

export function AttendeeItem({ id, nickname, avatarUrl }: AttendeeItemProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const isCurrentUser = session?.user?.id === id;
  const href = isCurrentUser ? "/profile" : `/users/${id}`;

  return (
    <li
      onClick={() => router.push(href)}
      className="flex items-center gap-3 p-2 -m-2 rounded-md cursor-pointer hover:bg-muted transition-colors"
    >
      <Avatar>
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{nickname?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{nickname}</span>
    </li>
  );
}

