"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserListItemProps {
  id: string;
  nickname: string;
  avatarUrl: string | null;
}

export function UserListItem({ id, nickname, avatarUrl }: UserListItemProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const isCurrentUser = session?.user?.id === id;
  const href = isCurrentUser ? "/profile" : `/users/${id}`;

  return (
    <li onClick={() => router.push(href)} className="list-item-interactive">
      <Avatar>
        <AvatarImage src={avatarUrl ?? undefined} />
        <AvatarFallback>{nickname?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
      </Avatar>
      <span className="font-medium">{nickname}</span>
    </li>
  );
}

