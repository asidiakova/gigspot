import { z } from "zod";

export const IdParamsSchema = z.object({
  params: z.promise(
    z.object({
      id: z.string(),
    })
  ),
});
