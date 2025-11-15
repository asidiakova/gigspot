export interface ReactionRepositoryInterface {
  add(userId: string, eventId: string): Promise<void>;
  remove(userId: string, eventId: string): Promise<void>;
  has(userId: string, eventId: string): Promise<boolean>;
  countForEvent(eventId: string): Promise<number>;
}


