class Session {
  /**
   * Creates a new session and updates db.
   * @param {SessionDataToCreate} data - The session data.
   * @returns {SessionData} - the created session
   * @throws {BadRequestError} - if session already in db.
   */
  static async create(data: SessionDataToCreate): Promise<SessionData>{}


  /**
   * Updates a session in db with partial data or all data.
   *
   * @param {SessionDataToUpdate} data - Partial or full session data to update.
   * @param {number} id - Session id to update
   * @returns {SessionData} - Updated session
   * @throws {NotFoundError} - if session not found
   */
  static async update(id: number, data: SessionDataToUpdate): Promise<SessionData>{}


  /**
   * Deletes a session from db by id.
   *
   * @param {number} id - Session id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if session not found
   */
  static async delete(id: number): Promise<void>{}


  /**
   * Gets a session by ID.
   *
   * @param {number} id - The session ID
   * @returns {SessionData} - The session data
   * @throws {NotFoundError} - if session not found
   */
  static async getById(id: number): Promise<SessionData>{}


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
  static async getAllSessions(): Promise<SessionData[]>{}
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