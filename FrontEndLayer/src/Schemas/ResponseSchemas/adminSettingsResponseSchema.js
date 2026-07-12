import { z } from 'zod';

export const AdminSettingsResponseSchema = z.record(z.string(), z.any());
