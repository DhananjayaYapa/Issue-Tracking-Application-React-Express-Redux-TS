import { z } from "zod";

export const userIdParamsSchema = z.object({
  id: z.coerce
    .number({ required_error: "User ID is required" })
    .int()
    .positive("User ID must be a positive integer"),
});

export type UserIdParams = z.infer<typeof userIdParamsSchema>;
