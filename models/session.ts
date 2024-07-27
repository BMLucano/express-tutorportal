import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";
import { sqlForPartialUpdate } from "./helpers/sql";

class Session {
  /**
   * Creates a new session and updates db.
   * @param {SessionDataToCreate} data - The session data.
   * @returns {SessionData} - the created session
   * @throws {BadRequestError} - if session already in db.
   */
  static async create(data: SessionDataToCreate): Promise<SessionData>{
const { studentUsername, date, time, duration, notes } = data;

    const dupeCheck = await db.query(`
      SELECT id FROM sessions WHERE date = $1 AND time = $2`,
      [date, time]
    );
    if(dupeCheck.rows[0])
      throw new BadRequestError(`
        Session already exists with date and time: ${date} at ${time}`);

    const result = await db.query(`
      INSERT INTO sessions (student_username, date, time, duration, notes)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id,
                student_username AS "studentUsername",
                date,
                time,
                duration,
                notes`, [studentUsername, date, time, duration, notes]
    );
    const session = result.rows[0];

    return session;
  }


  /**
   * Updates a session in db with partial data or all data.
   *
   * @param {SessionDataToUpdate} data - Partial or full session data to update.
   * @param {number} id - Session id to update
   * @returns {SessionData} - Updated session
   * @throws {NotFoundError} - if session not found
   */
  static async update(id: number, data: SessionDataToUpdate):
    Promise<SessionData>{

      const { sqlSetCols, values } = sqlForPartialUpdate(
        data,
        {
          studentUsername : "student_username",
        }
      );
      const idSanitationIdx = "$" + (values.length + 1);

      const result = await db.query(`
        UPDATE sessions
        SET ${sqlSetCols}
        WHERE id = ${idSanitationIdx}
        RETURNING id,
                  student_username AS "studentUsername",
                  date,
                  time,
                  duration,
                  notes`,
                [...values, id]
      );
      const session = result.rows[0];

      if(!session)
        throw new NotFoundError(`No session with id: ${id}`);

      return session;
    }


  /**
   * Deletes a session from db by id.
   *
   * @param {number} id - Session id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if session not found
   */
  static async delete(id: number): Promise<void>{

    const result = await db.query(`
      DELETE FROM sessions
      WHERE id = $1
      RETURNING id`, [id]
    );
    const session = result.rows[0];

    if(!session)
      throw new NotFoundError(`No session with id: ${id}`);

  }


  /**
   * Gets a session by ID.
   *
   * @param {number} id - The session ID
   * @returns {SessionData} - The session data
   * @throws {NotFoundError} - if session not found
   */
  static async get(id: number): Promise<SessionData>{

    const result = await db.query(`
      SELECT id, student_username AS "studentUsername", date, time, duration, notes
      FROM sessions
      WHERE id = $1`,
    [id]
    );
    const session = result.rows[0];
    console.log("session infunc", session)

    if(!session)
      throw new NotFoundError(`No sessionmattching id: ${id}`);

    return session;
  }


  /**
   * Gets sessions based on student.
   *
   * @param {string} studentUsername
   * @returns {SessionData[]} - a list of all sessions for a student
   * @throws {NotFoundError} - if student not found
   */
  static async getSessionsByStudent(studentUsername: string): Promise<SessionData[]>{}


  /**
   * Gets all sessions.
   *
   * @returns {SessionData[]} - a list of all sessions
   */
  static async getAll(): Promise<SessionData[]>{}
}

type SessionDataToUpdate = {
  studentUsername?: string | null,
  date?: string | null,
  time?: string | null,
  duration?: string | null,
  notes?: string | null,
}

type SessionDataToCreate = {
  studentUsername: string,
  date: string,
  time: string,
  duration: string,
  notes?: string,
}

type SessionData = {
  id: number,
  studentUsername: string,
  date: string,
  time: string,
  duration: string,
  notes: string,
  createdAt: string,
  updatedAt: string,
}

export default Session;