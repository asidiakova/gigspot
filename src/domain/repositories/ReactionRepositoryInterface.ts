export interface ReactionRepositoryInterface {
  add(userId: string, eventId: string): Promise<void>;
  remove(userId: string, eventId: string): Promise<void>;
  has(userId: string, eventId: string): Promise<boolean>;
  countForEvent(eventId: string): Promise<number>;
  getRecentAttendants(eventId: string, limit: number): Promise<{ nickname: string; avatarUrl: string | null }[]>;
  getAttendants(eventId: string): Promise<{ id: string; nickname: string; avatarUrl: string | null }[]>;
}


