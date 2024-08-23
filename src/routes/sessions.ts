import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Session, { SessionData } from "../models/session";

// import { z } from "zod";
// import { createResourceSchema, updateResourceSchema } from "../schemas/resources";

import { BadRequestError, NotFoundError } from "../expressError";

/** Routes for handling session retrieval, creation, updating, and deleting */

/**
 * GET /sessions: get all sessions
 * **for tutors: get all in db
 * **for students: get all by username
 *
 * Auth required: tutor or student
 *
 * @returns {SessionData[]}
 */
router.get("/", ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

})


/**
 * GET /sessions/:id : get details of specific session
 *
 * Auth required: tutor or student
 *
 * @returns {SessionData}
 */
router.get("/:id", ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

})


/**
 * POST /sessions : creates a new session
 *
 * Auth required: tutor
 *
 * @returns {SessionData}
 */
router.post("/", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

})


/**
 * PATCH /sessions/:id - updates a session
 *
 * Auth required: tutor
 *
 * @returns {SessionData}
 */
router.patch("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

})


/**
 * DELETE /sessions/:id - deletes a note
 *
 * Auth required: tutor
 *
 * @returns {Record<string, string>}
 */
router.delete("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

})
