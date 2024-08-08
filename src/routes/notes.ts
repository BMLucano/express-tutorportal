import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Note, { NoteData } from "../models/note";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes";
import { z } from "zod";
import { BadRequestError } from "../expressError";

/*** Routes for handling note retrieveal, creation, updating, and deleting*/

/**
 * GET /notes: get all notes
 *
 * Auth required: tutor or student
 *
 * @returns {NoteData[]}
 */
router.get('/', ensureUser, async function(req: Request, res: Response,
  next: NextFunction){

    const notes = await Note.getAll();
    return res.json(notes);
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

  })

export default router;