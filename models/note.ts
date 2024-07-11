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
  static async create(data: NoteDataToCreate): Promise<NoteData>{}


  /**
   * Updates a note in db with partial data or all data.
   *
   * @param{NoteDataToUpdate} data - Partial or full note data to update.
   * @param {number} id -Note id to update
   * @returns {NoteData} - Updated note
   * @throws {NotFoundError} - if note not found
   */
  static async update(id: number, data:NoteDataToUpdate): Promise<NoteData>{}


  /**
   * Deletes a note from db by id.
   *
   * @param {number} id - Note id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if note not found
   */
  static async delete(id: number): Promise<void>{}


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