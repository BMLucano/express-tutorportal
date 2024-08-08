import express, { NextFunction, Request, Response, Router } from "express";
const router: Router = express.Router();

import { studentAuth, tutorAuth, ensureUser } from "../middleware/auth";
import Note, { NoteData } from "../models/note";
import { createNoteSchema, updateNoteSchema } from "../schemas/notes";

/*** Routes for handling note retrieveal, creation, updating, and deleting*/

/**
 * GET /notes: get all notes
 *
 * Auth required: valid jwt
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
 * Auth required: valid jwt
 *
 * @returns {NoteData}
 */
router.get("/:id", async function(req: Request, res: Response,
  next: NextFunction){

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