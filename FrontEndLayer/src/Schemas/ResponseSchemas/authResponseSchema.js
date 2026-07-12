import { z } from 'zod';

export const UserSchema = z.object({
  _id: z.string(),
  universityId: z.string(),
  email: z.string().email(),
  role: z.string(),
  isActive: z.boolean().optional(),
  name: z.string().optional(),
}).passthrough();

export const LoginResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: UserSchema,
    token: z.string().optional(),
  }),
}).passthrough();

export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
}).passthrough();

export const MessageResponseSchema = z.object({
  message: z.string(),
}).passthrough();
