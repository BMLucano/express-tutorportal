import { z } from "zod";

const createResourceSchema = z.object({
  studentUsername: z.string(),
  title: z.string(),
  url: z.string().url(),
  description: z.string(),
}).strict();

const updateResourceSchema = z.object({
  studentUsername: z.string().optional(),
  title: z.string().optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
}).strict();

export { createResourceSchema, updateResourceSchema };