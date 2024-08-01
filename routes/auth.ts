/** Routes for authentication. */
import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();
import { z } from "zod";

import { BadRequestError } from "../expressError";
import User from "../models/user";
import { createToken } from "../models/helpers/tokens";
import { userRegisterSchema, userAuthSchema } from "../schemas/users";
import { create } from "domain";


/** POST /auth/token: { username, password } => { token }
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization req: none
*/
router.post("/token", async function(req: Request, res: Response,
    next: NextFunction): Promise<Response | void> {

      try{
        const { username, password } = userAuthSchema.parse(req.body);
        const newUser = await User.authenticate(username, password);

        const token = createToken(username, newUser.role);
        return res.status(200).json({ token })

      }catch(error){
        if(error instanceof z.ZodError){
          const errs = error.issues.map((issue) => issue.message).join(", ");
          return next(new BadRequestError(errs));
        }
        return next(error)
      }
})

/** POST auth/register: { user } => { token }
 *
 * user must include { username, password, firstName, lastName, email, role}
 *
 * Returns JWT token which can be used to authenticate further requests.
 *
 * Authorization required: none
 *
 */

export default router;