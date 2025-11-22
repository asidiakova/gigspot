import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind CSS conflict resolution.
 * Combines `clsx` for conditional logic and `tailwind-merge` to handle overrides.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
