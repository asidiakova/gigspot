"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Event } from "@/domain/entities/Event";
import { CreateEventInputSchema } from "@/domain/validation/event";
import { validate, type FieldErrors } from "@/lib/validation";
import { FieldError } from "@/components/form/field-error";

interface EventFormProps {
  initialData?: Event;
}

type EventFormFields = {
  title: string;
  description: string;
  datetime: string;
  city: string;
  location: string;
  price: string;
  flyerUrl: string;
};

type EventFormErrors = FieldErrors<EventFormFields>;

export function EventForm({ initialData }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<EventFormFields>({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    datetime: initialData?.datetime
      ? new Date(initialData.datetime).toISOString().slice(0, 16)
      : "",
    city: initialData?.city ?? "",
    location: initialData?.location ?? "",
    price: initialData?.price ?? "",
    flyerUrl: initialData?.flyerUrl ?? "",
  });

  const [errors, setErrors] = useState<EventFormErrors>({});

  const handleDelete = async () => {
    if (!initialData?.id) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/events/${initialData.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete event");
      }

      toast.success("Event deleted successfully");
      router.push("/events/mine");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name in formData) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = validate(CreateEventInputSchema, formData);
    if ("errors" in result) {
      setErrors(result.errors);
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing ? `/api/events/${initialData?.id}` : "/api/events";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(
          error.error || `Failed to ${isEditing ? "update" : "create"} event`
        );
      }

      toast.success(`Event ${isEditing ? "updated" : "created"} successfully!`);
      router.push(isEditing ? `/events/${initialData?.id}` : "/events/mine");
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Summer Music Festival"
          required
          value={formData.title}
          onChange={handleChange}
        />
        <FieldError messages={errors.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Tell people about your event..."
          required
          value={formData.description}
          onChange={handleChange}
        />
        <FieldError messages={errors.description} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="datetime">Date & Time</Label>
          <Input
            id="datetime"
            name="datetime"
            type="datetime-local"
            required
            value={formData.datetime}
            onChange={handleChange}
          />
          <FieldError messages={errors.datetime} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            placeholder="e.g. $20 or Free"
            required
            value={formData.price}
            onChange={handleChange}
          />
          <FieldError messages={errors.price} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            placeholder="e.g. New York"
            required
            value={formData.city}
            onChange={handleChange}
          />
          <FieldError messages={errors.city} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location (Venue)</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Madison Square Garden"
            required
            value={formData.location}
            onChange={handleChange}
          />
          <FieldError messages={errors.location} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="flyerUrl">Flyer Image URL</Label>
        <Input
          id="flyerUrl"
          name="flyerUrl"
          placeholder="https://example.com/flyer.jpg"
          type="url"
          value={formData.flyerUrl}
          onChange={handleChange}
        />
        <p className="text-sm text-muted-foreground">
          Provide a URL for your event flyer image.
        </p>
        <FieldError messages={errors.flyerUrl} />
      </div>

      <div className="pt-4 space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update Event"
            : "Create Event"}
        </Button>

        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            disabled={isLoading}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete Event
          </Button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full space-y-4">
            <h3 className="text-lg font-semibold">Delete Event</h3>
            <p className="text-muted-foreground">
              Are you sure you want to delete this event? You will not be able to
              recover it.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Yes, Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
