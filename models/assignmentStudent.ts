
/**
 * Student assignment model for handling the assignment to student relationship.
 */

class AssignmentStudent {
  /**
   * TODO: Do i want this to return a boolean instead??
   * Assign a student to an assignment, given a student username and assignment id.
   *
   * @param {string} studentUsername
   * @param {number} assignmentId
   * @returns {AssignmentStudent} - The updated assignment-student relationship
   */
  static async assign(studentUsername: string, assignmentId: number): Promise<AssignmentStudentData> {}

  /**
   * TODO: Do i want this to return a boolean instead??
   * Updates status of assignment to 'in progress' or 'completed'
   *
   * @param {string} studentUsername
   * @param {number} assignmentId
   * @param {string} status
   * @returns {AssignmentStudent} - The updated assignment-student relationship
   */
  static async updateStatus(studentUsername: string, assignmentId: number, status: string): Promise<AssignmentStudentData> {}

  /**
   * Get all assignments based on student username.
   *
   * @param {string} studentUsername
   * @returns {AssignmentData[]} - Retrieved assignments
   * @throws {NotFoundError} - if student not found
   */
  static async getAssignmentsByStudent(studentUsername: string): Promise<AssignmentData[]> {}

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

  /**
   * Get all Students that an assignment is assigned to, based on assignment id.
   *
   * @param {number} assignmentId
   * @returns {User[]} - List of student User objects
   * @throws {NotFoundError} - if assignment id not found
   */
  static async getStudentsByAssignment(assignmentId: number): Promise<User[]> {}
}

type AssignmentData = {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  questions: QuestionData[];
};

type User = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

type AssignmentStudentData = {
  id: number;
  assignmentId: number;
  studentUsername: string;
  status: string;
};

export default AssignmentStudent;