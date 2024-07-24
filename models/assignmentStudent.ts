import db from "../db";
import { NotFoundError, BadRequestError } from "../expressError";

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
  static async assign(studentUsername: string, assignmentId: number):
  Promise<AssignmentStudentData> {
    //check oif student exists
    const sResult = await db.query(`
      SELECT username FROM users WHERE username = $1`,
      [studentUsername],
    );
    if(!sResult.rows[0])
      throw new NotFoundError(`Student ${studentUsername} not found`);

    //check if assignment exists
    const aResult = await db.query(`
      SELECT id FROM assignments WHERE id = $1`,
      [assignmentId],
    );
    if(!aResult.rows[0])
      throw new NotFoundError(`Assignement ${assignmentId} not found`);

    const result = await db.query(`
      INSERT INTO assignments_students (assignment_id, student_username)
      VALUES ($1, $2)
      RETURNING id,
                assignment_id AS "assignmentId",
                student_username AS "studentUsername",
                status`,
              [assignmentId, studentUsername]
    );
    const assignmentStudent = result.rows[0];
    console.log("assignmentstudent", Boolean(assignmentStudent))

    if(!assignmentStudent)
      throw new NotFoundError("Failed to create assignment-student realtionship");

    return assignmentStudent;
  }

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
  dueDate: string;
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