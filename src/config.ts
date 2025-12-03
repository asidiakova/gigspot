import { z } from "zod";

const envSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
});

const envParams = envSchema.safeParse(process.env);

if (!envParams.success) {
  console.error("Invalid environment variables:", envParams.error);
  throw new Error("Invalid environment variables");
}

export const config = {
  auth: {
    secret: envParams.data.NEXTAUTH_SECRET,
    saltRounds: 12,
    maxAgeSecs: 60 * 24 * 30, // 1 day
  },
  db: {
    url: envParams.data.DATABASE_URL,
  },
} as const;
