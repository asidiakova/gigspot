export type EventId = string;

export type Event = {
  id: EventId;
  organizerId: string;
  title: string;
  flyerUrl?: string | null;
  datetime: Date;
  city: string;
  location: string;
  price: string;
  description: string;
  createdAt: Date;
  deletedAt?: Date | null;
};


