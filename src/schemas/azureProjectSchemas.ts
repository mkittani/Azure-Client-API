import { z } from 'zod';

export const AzureProjectCreateSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  visibility: z.enum(["private", "public"], {
    errorMap: () => ({ message: "Visibility must be either 'private' or 'public'" }),
  }),
});