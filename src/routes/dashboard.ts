import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth } from "../middleware/auth";

import User from "../models/user";

/**
 * GET /dashboard
 *
 * Auth required: must be student
 *
 * @returns dashboard data:
 * {user: { username, firstName, lastName, email, role},
 *  nextSession: {id, studentUsername, date, time, duration, notes},
 *  recentAssignments: [{id, title, description, dueDate, questions: []}],
 *  recentResources: [{id, studentUsername, title, url, description},]
 *  recentNotes: [{id, studentUsername, title, contentPath, sessionId}]
 * }
 */

router.get('/', studentAuth, async function(req: Request, res: Response,
    next: NextFunction){

      const username = res.locals.user.username;
      const dashboardData = await User.getUserDashboard(username);

      return res.json( dashboardData )
})

export default router;