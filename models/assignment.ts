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
  async createAssignment(data: AssignmentDataToCreate): Promise<AssignmentData> {}

  /**
   * Update assignment with partial data.
   *
   * @param {Partial<AssignmentDataToCreate>} data - Partial assignment data to update
   * @returns {Assignment} - Updated assignment
   * @throws {NotFoundError} - if assignment not found
   */
  async updateAssignment(data: Partial<AssignmentDataToCreate>): Promise<AssignmentData> {}

  /**
   * Delete an assignment from database by id.
   *
   * @param {number} id - Assignment id to delete
   * @returns {undefined}
   * @throws {NotFoundError} - if assignment not found
   */
  async deleteAssignment(id: number): Promise<void> {}

  /**
   * Get a single assignment by id.
   *
   * @param {number} id - Assignment id to retrieve
   * @returns {Assignment} - Retrieved assignment
   * @throws {NotFoundError} - if assignment not found
   */
  async getAssignment(id: number): Promise<AssignmentData> {}

  /**
   * Get all assignments for a student.
   *
   * @param {string} studentUsername - Student username to retrieve assignments for
   * @returns {Assignment[]} - Retrieved assignments
   * @throws {NotFoundError} - if no student found
   */
  async getAssignments(studentUsername: string): Promise<AssignmentData[]> {}

  /**
   * Get assignments by status and student.
   *
   * @param {string} status - Assignment status to filter by
   * @param {string} studentUsername - Student username to retrieve assignments for
   * @returns {Assignment[]} - Retrieved assignments
   * @throws {NotFoundError} - if no student found
   */
  async getAssignmentsByStatusAndStudent(
    status: string,
    studentUsername: string
  ): Promise<Assignment[]> {}
}

type AssignmentDataToCreate = {
  title: string;
  description: string;
  dueDate: Date;
};

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
};

export default Assignment;