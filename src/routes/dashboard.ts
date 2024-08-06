import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth } from "../middleware/auth";
import User from "../models/user";

router.get('/', studentAuth, async function(req: Request, res: Response,
    next: NextFunction){

      const username = res.locals.user.username;
      const dashboardData = await User.getUserDashboard(username);

      return res.json( dashboardData )
})

export default router;