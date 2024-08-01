import { z } from "zod";

const userRegisterSchema = z.object({
  username: z.string().min(1).max(25),
  password: z.string().min(5),
  firstName: z.string().min(1).max(25),
  lastName: z.string().min(1).max(25),
  email: z.string().email().min(5).max(60),
  role: z.string().optional().default('student'),
});

const userAuthSchema = z.object({
  username: z.string().min(1).max(25),
  password: z.string().min(5),
})
// const userUpdateSchema = z.object({
//   username: z.string().min(1).max(25),
//   password: z.string().min(5),
//   firstName: z.string().min(1).max(25),
//   lastName: z.string().min(1).max(25),
//   email: z.string().email().min(5).max(60),
//   role: z.string().optional().default('student'),
// });

export { userRegisterSchema, userAuthSchema };