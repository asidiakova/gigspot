"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface CityFilterProps {
  cities: string[];
}

export function CityFilter({ cities }: CityFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get("city") ?? "all";

  const handleCityChange = (value: string) => {
    if (value === "all") {
      router.push("/events");
    } else {
      router.push(`/events?city=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <Select value={currentCity} onValueChange={handleCityChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by city" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

