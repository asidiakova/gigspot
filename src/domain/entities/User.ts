export type UserId = string;
export type UserRole = "user" | "organizer";

export type User = {
  id: UserId;
  nickname: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: Date;
};
