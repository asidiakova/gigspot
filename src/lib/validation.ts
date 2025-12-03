import type { ZodError, ZodType } from "zod";

export type FieldErrors<T extends Record<string, unknown>> = Partial<
  Record<keyof T, string[]>
>;

export function collectZodErrors<T extends Record<string, unknown>>(
  error: ZodError,
  initial?: FieldErrors<T>
): FieldErrors<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const out: Record<string, string[]> = { ...(initial as any) };
  for (const issue of error.issues) {
    const key = typeof issue.path[0] === "string" ? issue.path[0] : undefined;
    if (!key) continue;
    if (!out[key]) out[key] = [];
    out[key]!.push(issue.message);
  }
  return out as FieldErrors<T>;
}

export function validate<T extends Record<string, unknown>>(
  schema: ZodType<T>,
  data: unknown
): { data: T } | { errors: FieldErrors<T> } {
  const res = schema.safeParse(data);
  if (res.success) return { data: res.data };
  return { errors: collectZodErrors<T>(res.error) };
}
