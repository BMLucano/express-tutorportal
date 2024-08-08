import { z } from "zod";

const createNoteSchema = z.object({
  studentUsername: z.string(),
  title: z.string(),
  contentPath: z.string().optional(),
  sessionId: z.number(),
}).strict();

const updateNoteSchema = z.object({
  studentUsername: z.string().optional(),
  title: z.string().optional(),
  contentPath: z.string().optional(),
  sessionId: z.number().optional(),
}).strict();

export { createNoteSchema, updateNoteSchema };