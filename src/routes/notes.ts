import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Note, { NoteData } from "../models/note";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes";
import { z } from "zod";
import { BadRequestError, NotFoundError } from "../expressError";

/*** Routes for handling note retrieveal, creation, updating, and deleting*/

/**
 * GET /notes: get all notes
 * **for tutors: get all in db
 * **for students: get all by username
 *
 * Auth required: tutor or student
 *
 * @returns {NoteData[]}
 */
router.get('/', ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

    if(res.locals.user.role === "tutor"){
      const notes = await Note.getAll();
      return res.json(notes);
    }else if(res.locals.user.role === "student"){
      const notes = await Note.getNotesByStudent(res.locals.user.username);
      return res.json(notes);
    }
})


/**
 * GET /notes/:id : get details of a specific note
 *
 * Auth required: tutor or student
 *
 * @returns {NoteData}
 */
router.get("/:id", ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

    if(isNaN(+req.params.id)) throw new NotFoundError();

    const note = await Note.get(+req.params.id);
    return res.json(note);
})


/**
 * POST /notes - create a new note
 *
 * Auth required: tutor
 *
 * @returns {NoteData}
 */
router.post("/", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

    try{
      const data = createNoteSchema.parse(req.body);
      const note = await Note.create(data);

      return res.status(201).json(note);
    }catch(error){
      if(error instanceof z.ZodError){
        const errs = error.issues.map((issue) => issue.message).join(", ");
        return next(new BadRequestError(errs));
      }
      return next(error);
    }
})


/**
 * PATCH /notes/:id - update a specific note
 *
 * Auth required: tutor
 *
 * @returns {NoteData}
 */
router.patch("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

    try{
      const data = updateNoteSchema.parse(req.body);
      const note = await Note.update(+req.params.id, data);

      return res.json(note);
    }catch(error){
      if(error instanceof z.ZodError){
        const errs = error.issues.map((issue) => issue.message).join(", ");
        return next(new BadRequestError(errs));
      }
      return next(error);
    }
})


/**
 * DELETE /notes/:id - delete a note
 *
 * Auth required: tutor
 *
 * @returns {Record<string, string>} - {"deleted": id}
 */
router.delete("/:id", tutorAuth, async function(req: Request, res: Response,
  next: NextFunction){

    if(isNaN(+req.params.id)) throw new NotFoundError();

    await Note.delete(+req.params.id);
    return res.json({"deleted": +req.params.id})
  })

export default router;