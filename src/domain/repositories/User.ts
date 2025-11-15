import type { User, UserId } from "../entities/User";

export interface UserRepositoryInterface {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  upsert(input: { id?: UserId } & Omit<User, "id" | "createdAt">): Promise<User>;
  delete(id: UserId): Promise<void>;
}
