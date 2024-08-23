import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Resource, { ResourceData } from "../models/resource";

import { z } from "zod";
import { createResourceSchema, updateResourceSchema } from "../schemas/resources";

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

    try{
      const data = createResourceSchema.parse(req.body);
      const resource = await Resource.create(data);

      return res.status(201).json(resource);
    }catch(error){
      if(error instanceof z.ZodError){
        const errs = error.issues.map((issue) => issue.message).join(", ");
        return next(new BadRequestError(errs));
      }
      return next(error);
    }
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

    if(isNaN(+req.params.id)) throw new NotFoundError();

    try{
      const data = updateResourceSchema.parse(req.body);
      const resource = await Resource.update(+req.params.id, data);

      return res.json(resource);
    }catch(error){
      if(error instanceof z.ZodError){
        const errs = error.issues.map((issue) => issue.message).join(", ");
        return next(new BadRequestError(errs));
      }
      return next(error);
    }

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

    if(isNaN(+req.params.id)) throw new NotFoundError();

    await Resource.delete(+req.params.id);
    return res.json({"deleted": +req.params.id});

});

export default router;