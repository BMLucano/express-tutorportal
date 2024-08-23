import { z } from "zod";

const createResourceSchema = z.object({
  studentUsername: z.string(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
}).strict();

const updateResourceSchema = z.object({
  studentUsername: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  description: z.string().optional(),
}).strict();

export { createResourceSchema, updateResourceSchema };