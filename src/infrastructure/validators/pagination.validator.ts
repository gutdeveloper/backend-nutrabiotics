import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a number string" })
    .default("1"),

  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a number string" })
    .default("10"),
});