import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";
import { sqlForPartialUpdate } from "./helpers/sql";

/**
 * Note model for creating, updating, deleting, and retrieving notes.
 */

class Note {

  /**
   * Creates a new note and updates db.
   * @param {NoteDataToCreate} data - The note data.
   * @returns {NoteData} - the created note
   * @throws {BadRequestError} - if note already in db.
   */
  static async create(data: NoteDataToCreate): Promise<NoteData>{
    const{ studentUsername, title, contentPath, sessionId } = data;

    const dupeCheck = await db.query(`
      SELECT id FROM notes WHERE content_path = $1`, [contentPath]
    );
    if(dupeCheck.rows[0])
      throw new BadRequestError(`Note already exists with content path ${contentPath}`);

    const result = await db.query(`
      INSERT INTO notes (student_username, title, content_path, session_id)
      VALUES ($1, $2, $3, $4)
      RETURNING id,
                student_username AS "studentUsername",
                title,
                content_path AS "contentPath",
                session_id AS "sessionId"`,
      [studentUsername, title, contentPath, sessionId]
    );
    const note = result.rows[0];

    return note;
  }


  /**
   * Updates a note in db with partial data or all data.
   *
   * @param {NoteDataToUpdate} data - Partial or full note data to update.
   * @param {number} id -Note id to update
   * @returns {NoteData} - Updated note
   * @throws {NotFoundError} - if note not found
   */
  static async update(id: number, data:NoteDataToUpdate): Promise<NoteData>{

    const { sqlSetCols, values } = sqlForPartialUpdate(
      data,
      {
        studentUsername : "student_username",
        contentPath: "content_path",
        sessionId: "session_id"
      }
    );
    const idSanitationIdx = "$" + (values.length + 1);

    const result = await db.query(`
      UPDATE notes
      SET ${sqlSetCols}
      WHERE id = ${idSanitationIdx}
      RETURNING id,
          student_username AS "studentUsername",
          title,
          content_path AS "contentPath",
          session_id AS "sessionId"`,
        [...values, id]
      );
      const note = result.rows[0];

      if(!note)
        throw new NotFoundError(`No note found with id: ${id}`);

      return note;
  }


  /**
   * Deletes a note from db by id.
   *
   * @param {number} id - Note id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if note not found
   */
  static async delete(id: number): Promise<void>{

    const result = await db.query(`
      DELETE FROM notes WHERE id = $1 RETURNING id`,
    [id]
    );
    const note = result.rows[0];

    if(!note)
      throw new NotFoundError(`No note found with id: ${id}`);
  }

  /**
   * Get a single note by id.
   *
   * @param {number} id - Note id to retrieve
   * @returns {NoteData} - note
   * @throws {NotFoundError} - if note not found
   */
  static async get(id: number): Promise<NoteData>{

    const result = await db.query(`
      SELECT id,
             student_username AS "studentUsername",
             title,
             content_path AS "contentPath",
             session_id AS "sessionId"
      FROM notes
      WHERE id = $1`, [id]
    );
    const note = result.rows[0];

    if(!note)
      throw new NotFoundError(`No note found with id: ${id}`);

    return note;
  }

  /**
   * Get all notes.
   * @returns {NoteData[]} - note
   */
    static async getAll(): Promise<NoteData[]>{}

  /**
   * Gets notes based on student.
   *
   * @param {string} studentUsername
   * @returns {NoteData[]} - a list of all notes for a student
   * @throws {NotFoundError} - if student not found
   */
  static async getNotesByStudent(studentUsername: string): Promise<NoteData[]>{}

  /**
   * Gets Notes based on a session.
   *
   * @param {number} - a session id
   * @returns {NoteData[]} - a list of all notes for a session
   * @throws {NotFoundError} - if session not found
   */
  static async getNotesBySession(sessionId: number): Promise<NoteData[]>{}
}

type NoteDataToUpdate = {
  studentUsername?: string | null,
  title?: string | null,
  contentPath?: string | null,
  sessionId?: number | null,
}
type NoteDataToCreate = {
  studentUsername: string,
  title: string,
  contentPath: string,
  sessionId: number
}

type NoteData = {
  id: number,
  studentUsername: string,
  title: string,
  contentPath: string,
  sessionId: number
}


export default Note;