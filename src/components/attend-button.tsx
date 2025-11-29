"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface AttendButtonProps {
  eventId: string;
  initialIsAttending: boolean;
}

export function AttendButton({ eventId, initialIsAttending }: AttendButtonProps) {
  const router = useRouter();
  const [isAttending, setIsAttending] = useState(initialIsAttending);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/attend`, {
        method: isAttending ? "DELETE" : "POST",
      });

      if (!res.ok) throw new Error("Failed to update attendance");

      const data = await res.json();
      setIsAttending(data.attending);
      
      if (data.attending) {
        toast.success("You are now attending this event!");
      } else {
        toast.success("You are no longer attending this event.");
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
      variant={isAttending ? "secondary" : "default"}
      className="w-full md:w-auto"
    >
      {isAttending ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          Attending
        </>
      ) : (
        "Attend"
      )}
    </Button>
  );
}

