import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Resource, { ResourceData } from "../models/resource";
// import { createNoteSchema, updateNoteSchema } from "../schemas/notes";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../expressError";

/** Routes for handling resource retrieval, creation, updating, and deleting */

/**
 * GET /resources: get all resources
 *
 * Auth required: tutor or student
 *
 * @returns {ResourceData[]}
 */
router.get("/", ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

    const resources = await Resource.getAll();
    return res.json(resources);
});


/**
 * GET /resources/:id : get details of a specific resource
 *
 * Auth required: tutor or student
 *
 * @returns {ResourceData}
 */
router.get("/:id", ensureUser, async function(req: Request, res: Response,
  next: NextFunction){


    if(isNaN(+req.params.id)) throw new NotFoundError();

    const resource = await Resource.get(+req.params.id);
    return res.json(resource);

});


/**
 * POST /resources: create a new note
 *
 * Auth required: tutor
 *
 * @returns {ResourceData}
 */
router.post("/", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

});


/**
 * PATCH /resources/:id
 *
 * Auth required: tutor
 *
 * @returns {ResourceData}
 */
router.patch("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

});

/**
 * DELETE /resources/:id - delete a note
 *
 * Auth required: tutor
 *
 * @returns {Record<string, string>}
 */
router.delete("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

});

export default router;