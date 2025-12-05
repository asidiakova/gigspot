import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";

export function NewEventCard() {
  return (
    <Link href="/events/new" className="block h-full">
      <Card className="flex flex-col items-center justify-center h-full min-h-[350px] border-dashed border-2 hover:border-primary hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="p-4 rounded-full bg-muted">
            <Plus className="h-8 w-8" />
          </div>
          <span className="font-medium">Create New Event</span>
        </div>
      </Card>
    </Link>
  );
}

