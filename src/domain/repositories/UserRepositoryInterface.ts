import type { User, UserId } from "../entities/User";

export interface UserRepositoryInterface {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByNickname(nickname: string): Promise<User | null>;
  create(input: Omit<User, "id" | "createdAt">): Promise<User>;
  update(id: UserId, input: Partial<Omit<User, "id" | "createdAt">>): Promise<User>;
  delete(id: UserId): Promise<void>;
}
