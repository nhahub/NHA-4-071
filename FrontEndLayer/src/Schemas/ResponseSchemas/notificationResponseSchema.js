import { z } from "zod";
export const NotificationItemSchema = z.object({
  _id: z.string(), userId: z.string(), type: z.string(),
  title: z.string(), message: z.string(), date: z.string(), read: z.boolean(),
});
export const NotificationResponseSchema = z.array(NotificationItemSchema);