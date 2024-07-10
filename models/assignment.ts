/**
 * Assignment model functions for creating, updating, deleting, and retrieving assignments.
 */
class Assignment {
  /**
   * Create an assignment from given data, update db, return new assignment data.
   *
   * @param {AssignmentDataToCreate} data - Assignment data to create
   * @returns {AssignmentData} - Created assignment
   * @throws {BadRequestError} - if assignment already exists in db
   */
  static async create(data: AssignmentDataToCreate): Promise<AssignmentData> {}

  /**
   * Update assignment with partial data.
   *
   * @param {Partial<AssignmentDataToUpdate>} data - Partial assignment data to update
   * @param {number} id - Assignment id to delete
   * @returns {AssignmentData} - Updated assignment
   * @throws {NotFoundError} - if assignment not found
   */
  static async update(id: number, data: Partial<AssignmentDataToUpdate>): Promise<AssignmentData> {}

  /**
   * Delete an assignment from database by id.
   *
   * @param {number} id - Assignment id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if assignment not found
   */
  static async delete(id: number): Promise<void> {}

  /**
   * Get a single assignment by id.
   *
   * @param {number} id - Assignment id to retrieve
   * @returns {AssignmentData} - Retrieved assignment
   * @throws {NotFoundError} - if assignment not found
   */
  static async get(id: number): Promise<AssignmentData> {}

  /**
   * Get all assignments.
   *
   * @returns {AssignmentData[]} - Retrieved assignments
   */
    static async getAll(): Promise<AssignmentData[]> {}


  /**
   * Get all assignments for a student.
   *
   * @param {string} studentUsername - Student username to retrieve assignments for
   * @returns {AssignmentData[]} - Retrieved assignments
   * @throws {NotFoundError} - if no student found
   */
  static async getAllByStudent(studentUsername: string): Promise<AssignmentData[]> {}

  /**
   * Get assignments by status and student.
   * (use for dashboard - get 'assigned' assignments to include)
   *
   * @param {string} status - Assignment status to filter by
   * @param {string} studentUsername - Student username to retrieve assignments for
   * @returns {AssignmentData[]} - Retrieved assignments
   * @throws {NotFoundError} - if no student found
   */
  static async getAssignmentsByStatus(
    status: string,
    studentUsername: string
  ): Promise<AssignmentData[]> {}
}

type AssignmentDataToCreate = {
  title: string;
  description: string;
  dueDate: Date;
};

type AssignmentDataToUpdate = {
  title?: string | null;
  description?: string | null;
  dueDate?: Date | null;
};

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
};

export default Assignment;