import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.string().nullable(),
  type: z.string(),
  director: z.string().nullable().optional(),
  production: z.string().nullable().optional(),
  fileName: z.string().nullable(),
});

export type Project = z.infer<typeof ProjectSchema>;
